from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import JobDescription
from ai.resume_analysis.graph import app
from background_tasks.tasks import hello
from celery.result import AsyncResult

@api_view(["GET"])
def health(request):
    return Response("ok")

@api_view(["POST"])
def resume_review(request):
    resume_text = request.data.get("resume_text")
    job_description_id = request.data.get("job_description_id")
    
    try:
        job_description = JobDescription.objects.get(pk=job_description_id)
    except JobDescription.DoesNotExist:
        return Response({"error": "Job description not found"}, status=status.HTTP_404_NOT_FOUND)

    # Here you would typically invoke your AI graph with both the resume and job description
    # For now, we'll just simulate a response
    res = app.invoke({"resume_text": resume_text, "job_description": job_description.job_description})
    
    return Response({'message': 'Resume submitted for review', 'result': res}, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_job_description(request):
    data = request.data
    scoring_focus = data.get('scoringFocus', {})

    job_description = JobDescription.objects.create(
        job_title=data.get('jobTitle'),
        job_level=data.get('jobLevel'),
        employment_type=data.get('employmentType'),
        department=data.get('department'),
        location=data.get('location'),
        company_name=data.get('companyName'),
        company_website=data.get('companyWebsite'),
        job_description=data.get('jobDescription'),
        key_skills=data.get('keySkills'),
        education_requirements=data.get('educationRequirements'),
        certifications=data.get('certifications'),
        remote_onsite_hybrid=data.get('remoteOnsiteHybrid'),
        skills_match_focus=scoring_focus.get('skillsMatch', False),
        experience_fit_focus=scoring_focus.get('experienceFit', False),
        education_focus=scoring_focus.get('education', False),
        projects_focus=scoring_focus.get('projects', False),
        ats_keywords_focus=scoring_focus.get('atsKeywords', False),
        additional_notes=data.get('additionalNotes')
    )
    return Response({'message': 'Job description created successfully', 'id': job_description.id}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_job_descriptions(request):
    job_descriptions = JobDescription.objects.all().values()
    return Response(list(job_descriptions))

@api_view(['DELETE'])
def delete_job_description(request, pk):
    try:
        job_description = JobDescription.objects.get(pk=pk)
        job_description.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except JobDescription.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
def test_task(request):
    res = hello.delay()
    return Response({"task_id": res.id})

@api_view(["GET"])
def get_task_status(request, task_id):
    result = AsyncResult(task_id)

    response = {
        "task_id": task_id,
        "status": result.status,
    }

    if result.status == "SUCCESS":
        response["result"] = result.result

    return Response(response)