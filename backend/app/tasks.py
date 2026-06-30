import os
from celery import Celery
from app.config import settings

REDIS_URL = os.getenv("REDIS_URL")

if REDIS_URL:
    broker = REDIS_URL
    backend = REDIS_URL
else:
    use_redis = False
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, socket_timeout=1)
        r.ping()
        use_redis = True
    except Exception:
        pass

    if use_redis:
        broker = "redis://localhost:6379/0"
        backend = "redis://localhost:6379/0"
    else:
        db_url = settings.DATABASE_URL
        if db_url.startswith("postgresql://"):
            broker = db_url.replace("postgresql://", "sqla+postgresql://", 1)
        else:
            broker = "sqla+" + db_url
        
        if db_url.startswith("postgresql://"):
            backend = db_url.replace("postgresql://", "db+postgresql://", 1)
        else:
            backend = "db+" + db_url

celery_app = Celery(
    "tasks",
    broker=broker,
    backend=backend
)


celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="predict_xray_task")
def predict_xray_task(image_uuid):
    from app.inference.inference_service import inference_service
    result = inference_service.predict_from_file(image_uuid)
    return result

@celery_app.task(name="send_otp_email_task")
def send_otp_email_task(to_email: str, otp: str, patient_name: str):
    from app.core.email import send_otp_email
    send_otp_email(to_email, otp, patient_name)
    return {"status": "sent", "to": to_email}

@celery_app.task(name="send_report_email_task")
def send_report_email_task(to_email: str, report: dict):
    from app.core.email import send_report_email
    send_report_email(to_email, report)
    return {"status": "sent", "to": to_email}

