from django.urls import path

# views
from .views.job_description import create_job_description, get_job_descriptions, delete_job_description
from .views.background_tasks import test_task, get_task_status
from .views.resume_analysis import resume_review

urlpatterns = [
    path("resume-review/", resume_review),
    path("job-descriptions/", create_job_description),
    path("job-descriptions/all/", get_job_descriptions),
    path("job-descriptions/<int:pk>/delete/", delete_job_description),
    path("test-task/", test_task),
    path("task-status/<task_id>/", get_task_status),
]
