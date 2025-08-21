from celery import shared_task
import time
from ai.resume_analysis.graph import app

@shared_task
def hello():
    time.sleep(10)
    return 'ok'

@shared_task
def analyze_resume(resume_text, job_description):
    res = app.invoke({"resume_text": resume_text, "job_description_text": job_description})
    print(res["resume_analysis"])
    return 'ok'