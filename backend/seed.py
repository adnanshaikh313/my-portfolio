"""One-time seed script (also runs automatically on server startup)."""
from app import db, seed_db

if __name__ == "__main__":
    seed_db()
    print("Seeded:",
          db.profile.count_documents({}), "profile |",
          db.skills.count_documents({}), "skill groups |",
          db.education.count_documents({}), "education |",
          db.projects.count_documents({}), "projects")
