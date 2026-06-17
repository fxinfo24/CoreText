import uvicorn
from app.init_db import init_database

if __name__ == "__main__":
    init_database()
    print("Launching CoreText Executive OS FastAPI Backend on http://localhost:8000 ...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
