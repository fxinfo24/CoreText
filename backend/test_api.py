import requests
import time
import subprocess
import os
import sys

def verify_all_endpoints():
    print("================================================================")
    print("🧪 Executing Rigorous End-to-End CoreText API Audit")
    print("================================================================")

    # 1. Check virtual environment
    backend_dir = os.path.dirname(__file__)
    venv_dir = os.path.join(backend_dir, ".venv")
    if not os.path.exists(venv_dir):
        print("🛠️ Creating Python virtual environment and installing packages...")
        subprocess.run(["python3", "-m", "venv", ".venv"], cwd=backend_dir, check=True)
        pip_exe = os.path.join(venv_dir, "bin", "pip")
        subprocess.run([pip_exe, "install", "-r", "requirements.txt"], cwd=backend_dir, check=True)

    python_exe = os.path.join(venv_dir, "bin", "python3")
    
    print("⚡ Starting Python FastAPI Backend on http://localhost:8000 ...")
    server_proc = subprocess.Popen([python_exe, "run.py"], cwd=backend_dir, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Wait for boot
    time.sleep(3)

    base_url = "http://localhost:8000"
    session = requests.Session()
    success_count = 0
    failure_count = 0

    def audit(name, method, endpoint, json=None, expected_status=200):
        nonlocal success_count, failure_count
        url = base_url + endpoint
        try:
            if method == "GET":
                res = session.get(url, timeout=5)
            else:
                res = session.post(url, json=json, timeout=5)
                
            if res.status_code == expected_status:
                print(f"✓ {name} ({method} {endpoint}) -> Passed ({res.status_code})")
                success_count += 1
            else:
                print(f"✗ {name} ({method} {endpoint}) -> Failed! Expected {expected_status}, Got {res.status_code}: {res.text}")
                failure_count += 1
        except Exception as e:
            print(f"✗ {name} ({method} {endpoint}) -> Exception Exception: {e}")
            failure_count += 1

    try:
        # Test Root
        audit("Root Status", "GET", "/")
        
        # Test Sites & Settings
        audit("Get Sites List", "GET", "/api/sites")
        audit("Get FinTech Property", "GET", "/api/sites/site_fintech")
        audit("Get User Settings", "GET", "/api/settings")
        
        # Update Settings
        new_settings = {
            "director_name": "Marcus Vance",
            "shareholder_posture": "Stable Dividend Fiduciary",
            "auto_execute_tier1": True,
            "auto_execute_tier2": True,
            "email_briefing_time": "08:00 AM"
        }
        audit("Update User Settings", "POST", "/api/settings", json=new_settings)

        # Test Morning Briefing
        audit("Get Morning Briefing", "GET", "/api/briefing/site_fintech")

        # Test Nervous System
        audit("Get Nervous System Stack", "GET", "/api/nervous-system/site_fintech")

        # Test Decisions
        audit("Get Decision Significance Queue", "GET", "/api/decisions/site_fintech")
        audit("Execute Tier 1 Decision", "POST", "/api/decisions/execute/t1_1")

        # Test Portfolios
        audit("Get Opportunity Portfolios", "GET", "/api/portfolios/site_fintech")
        audit("Recalculate Portfolios Alpha", "POST", "/api/portfolios/recalculate/site_fintech")
        audit("Atomize Core Portfolio Brief", "POST", "/api/portfolios/atomize", json={"portfolio_id": "cp_ft_1"})

        # Test GEO Studio
        audit("Get GEO Studio Metrics", "GET", "/api/geo/site_fintech")
        audit("Run Dynamic GEO SGE Audit", "POST", "/api/geo/audit/site_fintech")
        audit("Remediate GEO Audit Defect", "POST", "/api/geo/fix/ga_1")

        # Test Decay Shield
        audit("Get Preemptive Decay Warns", "GET", "/api/decay/site_fintech")
        audit("Deploy Preemptive Decay Shield", "POST", "/api/decay/shield/dec_1")

        # Test Monetization
        audit("Get Monetization Engine", "GET", "/api/monetization/site_fintech")
        audit("Capture Affiliate Revenue Gap", "POST", "/api/monetization/capture/mr_1")

        # Test Competitors Radar
        audit("Get Competitive Radar", "GET", "/api/competitors/site_fintech")
        audit("Deploy Forum Trend Interception", "POST", "/api/competitors/intercept/it_1")

        # Test Collective Hive
        audit("Get Collective Hive Network", "GET", "/api/hive")
        audit("Transfer Victorious Hive Moat", "POST", "/api/hive/transfer/hive_1")

        # Test Conversational AI Copilot
        audit("Get Chat Stream", "GET", "/api/chat/site_fintech")
        audit("Transmit Shareholder Directive", "POST", "/api/chat", json={"site_id": "site_fintech", "message": "What is our tactical plan for Direct Indexing?"})

    finally:
        print("\nStopping FastAPI Test Server...")
        server_proc.terminate()
        server_proc.wait()

    print(f"\nAudit Summary: {success_count} Passed | {failure_count} Failed")
    if failure_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    verify_all_endpoints()
