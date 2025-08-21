from rest_framework.decorators import api_view
from rest_framework.response import Response
from ai.resume_analysis.graph import app
from background_tasks.tasks import hello
from celery.result import AsyncResult

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