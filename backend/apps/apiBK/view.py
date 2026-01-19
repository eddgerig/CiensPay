from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

@require_GET
@csrf_exempt
def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'CiensPay Backend',
        'message': 'Backend funcionando'
    })

@require_GET
@csrf_exempt  
def api_info(request):
    return JsonResponse({
        'name': 'CiensPay API',
        'version': '1.0.0'
    })