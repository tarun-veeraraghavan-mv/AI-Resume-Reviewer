from celery import shared_task
import time
from ai.resume_analysis.graph import app
from api.models import JobDescription, ResumeAnalysisResult # Import new models

@shared_task
def hello():
    time.sleep(10)
    return 'ok'

@shared_task
def analyze_resume(resume_text, job_description_text, job_description_id):
    res = app.invoke({"resume_text": resume_text, "job_description_text": job_description_text})

    # Retrieve JobDescription instance
    job_description_instance = JobDescription.objects.get(id=job_description_id)

    # Extract analysis data
    analysis_data = res["resume_analysis"]

    # Create and save ResumeAnalysisResult
    ResumeAnalysisResult.objects.create(
        job_description=job_description_instance,
        resume_text=resume_text,
        ats_score=analysis_data.get("ats_score"),
        skill_match_score=analysis_data.get("skill_match_score"),
        experience_score=analysis_data.get("experience_score"),
        education_score=analysis_data.get("education_score"),
        overall_score=analysis_data.get("overall_score"),
        feedback=analysis_data.get("feedback")
    )

    return "Resume analysis completed and saved."