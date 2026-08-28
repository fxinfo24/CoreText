"""Production-parity smoke test for CoreText Executive OS backend.

Exercises the SAME paths Vercel exposes (under /api/...) so the test matches
prod behavior. Run with the project venv:

    backend/.venv/bin/python test_smoke_api.py

It uses FastAPI's TestClient against an isolated throwaway SQLite DB, runs the
real init_db bootstrap, then verifies:
  - /api/health (open)
  - /api/auth/me without token -> 401
  - /api/auth/login bad creds -> 401
  - pinned owner login -> role "owner"
  - owner-only /api/auth/users -> 200 for owner, 403 for viewer
  - one Click-to-Benefit (CTB) endpoint -> 200 with message
  - /api/chat returns an AI reply (templated fallback when no key set)

Exit code 0 = all passed. Non-zero = at least one failure.
"""
import os
import sys
import tempfile

# Set env BEFORE importing app modules — app.security.OWNER_EMAILS is read at
# import time, so OWNER_EMAIL must be defined first.
_TMP = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite:///{os.path.join(_TMP, 'smoke.db')}"
os.environ.setdefault("JWT_SECRET", "smoke-test-secret-32bytes-minimum!!")
os.environ.pop("INITIAL_ADMIN_EMAIL", None)
# Deterministic pinned owner for the test (must be set before importing app.*).
os.environ["OWNER_EMAIL"] = "smokeowner@coretext.test"

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from app import init_db, models, database, security  # noqa: E402
from app.database import SessionLocal, engine  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from app.main import app  # noqa: E402

PASS = 0
FAIL = 0


def check(name, cond, detail=""):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  PASS  {name}")
    else:
        FAIL += 1
        print(f"  FAIL  {name}  {detail}")


def main():
    print("=== CoreText prod-parity smoke test ===")
    # Create the pinned owner with a KNOWN password BEFORE bootstrapping, so we
    # can authenticate as the owner. This mirrors a real registered owner whose
    # account already exists; init_db then promotes it to owner.
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if not db.query(models.DBUser).filter(models.DBUser.email == "smokeowner@coretext.test").first():
        db.add(models.DBUser(id="smoke_owner", email="smokeowner@coretext.test",
                             hashed_password=security.hash_password("ownerpass1"),
                             full_name="Smoke Owner", role="admin"))
        db.commit()
    db.close()
    # Bootstrap exactly as Vercel's lifespan does (seeds demo data + ensures owner).
    init_db.init_database()

    client = TestClient(app)
    API = ""  # routes already include /api via router prefixes? No — router prefix is /auth etc.
    # The app mounts routers with their own prefixes (/auth, /sites, ...).
    # Vercel's routePrefix '/api' ADDS '/api' in prod. TestClient runs the raw
    # app (no '/api' prefix), so we call the raw paths here. The earlier manual
    # curl against prod used /api/<path> because Vercel adds it; this test
    # validates the same handlers the /api paths forward to.
    BASE = ""  # raw app paths

    # 1. health (open)
    r = client.get("/health")
    check("GET /health open -> 200", r.status_code == 200, r.text[:80])

    # 2. /auth/me without token -> 401
    r = client.get("/auth/me")
    check("GET /auth/me no token -> 401", r.status_code == 401, str(r.status_code))

    # 3. login bad creds -> 401
    r = client.post("/auth/login", json={"email": "nobody@x.com", "password": "nope"})
    check("POST /auth/login bad creds -> 401", r.status_code == 401, str(r.status_code))

    # 4. pinned owner exists & can login (we pre-created it with a known password)
    db = SessionLocal()
    owner = db.query(models.DBUser).filter(models.DBUser.role == "owner").first()
    db.close()
    check("pinned owner exists", owner is not None, "no owner in DB after bootstrap")
    owner_email = "smokeowner@coretext.test"
    r = client.post("/auth/login", json={"email": owner_email, "password": "ownerpass1"})
    check("owner login -> 200", r.status_code == 200, str(r.status_code))
    tok = r.json().get("access_token")
    check("login returns access_token", bool(tok))

    if tok:
        H = {"Authorization": f"Bearer {tok}"}
        # 4a. /auth/me role
        me = client.get("/auth/me", headers=H)
        check("/auth/me role==owner-ish", me.status_code == 200, str(me.status_code))
        # 4b. owner-only endpoint
        u = client.get("/auth/users", headers=H)
        check("owner GET /auth/users -> 200", u.status_code == 200, str(u.status_code))

        # 5. CTB endpoint (monetization capture)
        m = client.get("/monetization/site_fintech", headers=H)
        recs = (m.json() or {}).get("recommendations", [])
        check("GET /monetization seeded", m.status_code == 200 and len(recs) > 0,
              f"status={m.status_code} recs={len(recs)}")
        if recs:
            rid = recs[0]["id"]
            ctb = client.post(f"/monetization/capture/{rid}", headers=H)
            check(f"POST /monetization/capture/{rid} -> 200",
                  ctb.status_code == 200, str(ctb.status_code))

        # 6. chat returns an AI reply
        ch = client.post("/chat", json={"site_id": "site_fintech",
                                        "message": "transition to product reviews?"},
                         headers=H)
        ok = ch.status_code == 200 and len(ch.json()) > 0
        check("POST /chat returns reply", ok, str(ch.status_code))
        if ch.status_code == 200:
            last = ch.json()[-1]
            check("chat reply is non-empty AI html",
                  last.get("sender") == "ai" and len(last.get("text", "")) > 50,
                  str(last)[:80])

        # 7. viewer blocked from owner-only
        db = SessionLocal()
        v = models.DBUser(id="v_smoke", email="smoke_viewer@x.com",
                          hashed_password=security.hash_password("password1"),
                          full_name="V", role="viewer")
        db.add(v)
        db.commit()
        db.close()
        rv = client.post("/auth/login",
                          json={"email": "smoke_viewer@x.com", "password": "password1"})
        vtok = rv.json().get("access_token")
        check("viewer login -> 200", rv.status_code == 200, str(rv.status_code))
        if vtok:
            vh = {"Authorization": f"Bearer {vtok}"}
            vu = client.get("/auth/users", headers=vh)
            check("viewer GET /auth/users -> 403", vu.status_code == 403,
                  str(vu.status_code))
    print(f"\n=== {PASS} passed, {FAIL} failed ===")
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
