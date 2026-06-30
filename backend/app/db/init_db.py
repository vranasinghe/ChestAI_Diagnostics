from sqlalchemy import text
from app.db.session import engine
from app.db.base import Base  # noqa: F401 — ensures models are registered


def create_tables() -> None:
    """Create all database tables if they don't exist."""
    Base.metadata.create_all(bind=engine)
    
    # Run migrations to add missing columns to existing tables
    with engine.connect() as conn:
        # Add otp_created_at to patient_portfolios table
        try:
            conn.execute(text("ALTER TABLE patient_portfolios ADD COLUMN IF NOT EXISTS otp_created_at TIMESTAMP WITH TIME ZONE;"))
            conn.commit()
        except Exception as e:
            print(f"Migration patient_portfolios.otp_created_at warning: {e}")
            
        # Add image_path, heatmap_path, predictions to images table
        try:
            conn.execute(text("ALTER TABLE images ADD COLUMN IF NOT EXISTS image_path VARCHAR(500);"))
            conn.execute(text("ALTER TABLE images ADD COLUMN IF NOT EXISTS heatmap_path VARCHAR(500);"))
            conn.execute(text("ALTER TABLE images ADD COLUMN IF NOT EXISTS predictions JSON;"))
            conn.commit()
        except Exception as e:
            print(f"Migration images new columns warning: {e}")

        # Add is_archived to comparisons table
        try:
            conn.execute(text("ALTER TABLE comparisons ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;"))
            conn.commit()
        except Exception as e:
            print(f"Migration comparisons.is_archived warning: {e}")

    # Seed default demo details
    seed_demo_data()


def seed_demo_data() -> None:
    from app.db.session import SessionLocal
    from app.models.doctor import Doctor
    from app.models.patient import PatientPortfolio
    from app.models.enums import GenderEnum
    from app.core.security import hash_password
    from datetime import date

    db = SessionLocal()
    try:
        demo_email = "demo@wedakam.com"
        doctor = db.query(Doctor).filter(Doctor.email == demo_email).first()
        if not doctor:
            print("Seeding demo doctor...")
            doctor = Doctor(
                first_name="Demo",
                last_name="Doctor",
                username="DemoDoctor1",
                email=demo_email,
                phone_no="+1234567890",
                qualification="MD, Radiologist",
                hashed_password=hash_password("password123")
            )
            db.add(doctor)
            db.commit()
            db.refresh(doctor)
        
        patients = [
            {
                "first_name": "John",
                "last_name": "Doe",
                "username": "johndoe",
                "email": "johndoe@example.com",
                "dob": date(1985, 5, 15),
                "gender": GenderEnum.MALE,
                "phone": "+111111111",
                "address": "123 Main St, New York, NY",
                "notes": "Patient reports recurring dry cough for 3 weeks.",
                "is_active": True
            },
            {
                "first_name": "Jane",
                "last_name": "Smith",
                "username": "janesmith",
                "email": "janesmith@example.com",
                "dob": date(1992, 9, 20),
                "gender": GenderEnum.FEMALE,
                "phone": "+222222222",
                "address": "456 Oak Ave, Boston, MA",
                "notes": "Annual medical checkup. Former smoker.",
                "is_active": True
            }
        ]
        
        for p in patients:
            existing_p = db.query(PatientPortfolio).filter(PatientPortfolio.email == p["email"]).first()
            if not existing_p:
                print(f"Seeding patient {p['first_name']} {p['last_name']}...")
                db_p = PatientPortfolio(
                    doctor_id=doctor.id,
                    first_name=p["first_name"],
                    last_name=p["last_name"],
                    username=p["username"],
                    email=p["email"],
                    dob=p["dob"],
                    gender=p["gender"],
                    phone=p["phone"],
                    address=p["address"],
                    notes=p["notes"],
                    is_active=p["is_active"]
                )
                db.add(db_p)
        db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
