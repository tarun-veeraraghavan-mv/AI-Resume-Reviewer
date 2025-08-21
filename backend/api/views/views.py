from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import JobDescription
from background_tasks.tasks import analyze_resume

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

    res = analyze_resume.delay(resume_text, job_description.job_description, job_description.id)
    
    return Response({'message': 'Resume submitted for review', 'result': res.id}, status=status.HTTP_200_OK)



