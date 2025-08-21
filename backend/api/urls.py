from django.urls import path
from .views import hello, resume_review, create_job_description, get_job_descriptions, delete_job_description

urlpatterns = [
    path("hello/", hello),
    path("resume-review/", resume_review),
    path("job-descriptions/", create_job_description),
    path("job-descriptions/all/", get_job_descriptions),
    path("job-descriptions/<int:pk>/delete/", delete_job_description),
]
