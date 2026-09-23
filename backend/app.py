"""Adnan Shaikh — portfolio backend (FastAPI + MongoDB).

Run:
    pip install -r requirements.txt
    cp .env.example .env        # then edit MONGO_URI / ADMIN_KEY
    uvicorn app:app --reload --port 8000

The database auto-seeds on first startup (same data as seed.py).
"""
import os
from datetime import datetime, timezone

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "portfolio")
ADMIN_KEY = os.getenv("ADMIN_KEY", "change-me-to-something-secret")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

app = FastAPI(title="Adnan Shaikh Portfolio API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------- seed data

SEED_PROFILE = {
    "name": "Adnan Samir Shaikh",
    "headline": "MCA Student | Aspiring Data Engineer",
    "location": "Pune, Maharashtra, India",
    "email": "itzadnanshaikh247@gmail.com",
    "phone": "+91 87675 76226",
    "github": "https://github.com/adnanshaikh313",
    "linkedin": "https://www.linkedin.com/in/adnan-shaikh-603818265/",
    "about": (
        "I'm a data-enthusiastic MCA student from Pune, passionate about turning "
        "raw data into reliable, production-ready pipelines. I work with Python, "
        "SQL, Kafka, Airflow, and modern data tooling to build ETL workflows and "
        "analytics-ready systems. Currently pursuing my MCA at Allana Institute "
        "of Management Sciences and Information Technology, my goal is to become "
        "a data engineer who ships clean, scalable data platforms."
    ),
    "availability": "Open to internships and entry-level data engineering roles",
}

SEED_SKILLS = [
    {"group": "Languages", "items": ["Python", "SQL"]},
    {"group": "Data Engineering",
     "items": ["Apache Kafka", "Apache Airflow", "Pandas", "NumPy", "ETL Pipelines"]},
    {"group": "Databases", "items": ["MongoDB", "Data Modeling"]},
    {"group": "Tools & Platforms", "items": ["Git", "Docker", "Linux"]},
]

SEED_EDUCATION = [
    {
        "degree": "Master of Computer Applications (MCA)",
        "school": "Allana Institute of Management Sciences and Information Technology",
        "location": "Pune, Maharashtra",
        "period": "2024 – 2026",
        "status": "Pursuing",
        "details": "Focused on data engineering: databases, distributed systems and analytics.",
    },
    {
        "degree": "Bachelor's Degree",
        "school": "Abeda Inamdar Senior College of Arts, Commerce and Science",
        "location": "Pune, Maharashtra",
        "period": "2021 – 2024",
        "status": "Completed",
        "details": "Undergraduate foundation in computer science fundamentals.",
    },
]

SEED_PROJECTS = [
    {
        "title": "Real-Time Event Streaming Pipeline",
        "description": (
            "Designed a real-time streaming pipeline that ingests events through "
            "Apache Kafka, transforms them with Python, and lands curated data in "
            "MongoDB for analytics."
        ),
        "tech": ["Python", "Apache Kafka", "MongoDB"],
        "github": "",
        "demo": "",
        "sample": True,
    },
    {
        "title": "ETL Workflow Orchestration",
        "description": (
            "Automated ETL workflows with Apache Airflow DAGs — extracting from "
            "multiple sources, cleaning and validating with Pandas, and loading "
            "modeled tables with SQL."
        ),
        "tech": ["Apache Airflow", "Python", "Pandas", "SQL"],
        "github": "",
        "demo": "",
        "sample": True,
    },
    {
        "title": "E-Commerce Analytics with Pandas",
        "description": (
            "Exploratory analysis of e-commerce order data using Pandas: computed "
            "KPIs, cohort trends and product affinity, and stored aggregates in "
            "MongoDB for dashboarding."
        ),
        "tech": ["Pandas", "MongoDB", "Python"],
        "github": "",
        "demo": "",
        "sample": True,
    },
]


def seed_db():
    if db.profile.count_documents({}) == 0:
        db.profile.insert_one(dict(SEED_PROFILE))
    if db.skills.count_documents({}) == 0:
        db.skills.insert_many([dict(s) for s in SEED_SKILLS])
    if db.education.count_documents({}) == 0:
        db.education.insert_many([dict(e) for e in SEED_EDUCATION])
    if db.projects.count_documents({}) == 0:
        db.projects.insert_many([dict(p) for p in SEED_PROJECTS])


@app.on_event("startup")
def _startup():
    seed_db()


# ------------------------------------------------------------------ helpers

def to_dict(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc


def require_admin(key: str):
    if key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")


# ------------------------------------------------------------------- models

class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(min_length=5, max_length=2000)


class ProjectIn(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=10, max_length=2000)
    tech: list[str] = Field(default_factory=list)
    github: str = ""
    demo: str = ""
    sample: bool = False


# ------------------------------------------------------------------ public

@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/profile")
def get_profile():
    doc = db.profile.find_one()
    if not doc:
        raise HTTPException(status_code=404, detail="Profile not seeded")
    return to_dict(doc)


@app.get("/api/skills")
def get_skills():
    return [to_dict(d) for d in db.skills.find()]


@app.get("/api/education")
def get_education():
    return [to_dict(d) for d in db.education.find()]


@app.get("/api/projects")
def get_projects():
    return [to_dict(d) for d in db.projects.find()]


@app.post("/api/contact", status_code=201)
def contact(payload: ContactIn):
    db.messages.insert_one({
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True, "message": "Thanks! I'll get back to you soon."}


# -------------------------------------------------------------------- admin

@app.get("/api/admin/messages")
def admin_messages(key: str = Query("")):
    require_admin(key)
    return [to_dict(d) for d in db.messages.find().sort("created_at", -1)]


@app.post("/api/admin/messages/{msg_id}/read")
def admin_mark_read(msg_id: str, key: str = Query("")):
    require_admin(key)
    db.messages.update_one({"_id": ObjectId(msg_id)}, {"$set": {"read": True}})
    return {"ok": True}


@app.delete("/api/admin/messages/{msg_id}")
def admin_delete_message(msg_id: str, key: str = Query("")):
    require_admin(key)
    db.messages.delete_one({"_id": ObjectId(msg_id)})
    return {"ok": True}


@app.post("/api/admin/projects", status_code=201)
def admin_add_project(payload: ProjectIn, key: str = Query("")):
    require_admin(key)
    res = db.projects.insert_one(payload.model_dump())
    return to_dict(db.projects.find_one({"_id": res.inserted_id}))


@app.put("/api/admin/projects/{project_id}")
def admin_update_project(project_id: str, payload: ProjectIn, key: str = Query("")):
    require_admin(key)
    db.projects.update_one({"_id": ObjectId(project_id)},
                           {"$set": payload.model_dump()})
    return to_dict(db.projects.find_one({"_id": ObjectId(project_id)}))


@app.delete("/api/admin/projects/{project_id}")
def admin_delete_project(project_id: str, key: str = Query("")):
    require_admin(key)
    db.projects.delete_one({"_id": ObjectId(project_id)})
    return {"ok": True}
