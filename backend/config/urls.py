"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
"""from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse  # Agrega esta línea

from api.views import (
    productos_list, producto_detail,
    usuarios_list, crear_registro_simple
)
# --- ELIMINA ESTA LÍNCA ---
# from apps.api.views import health_check, api_info

# --- REEMPLÁZALA CON ESTAS VISTAS DIRECTAMENTE ---
def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'CiensPay Backend',
        'message': 'Backend funcionando correctamente'
   
    })

def api_info(request):
    return JsonResponse({
        'name': 'CiensPay API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'info': '/api/info/',
            'productos': '/api/productos/',
            'usuarios': '/api/usuarios/',
            'crear_simple': '/api/crear-simple/'
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    path('api/info/', api_info, name='api-info'),
        
    # CRUD Productos
    path('api/productos/', productos_list, name='productos-list'),
    path('api/productos/<int:pk>/', producto_detail, name='producto-detail'),
    
    # CRUD Usuarios
    path('api/usuarios/', usuarios_list, name='usuarios-list'),
    
    # Endpoint simple POST
    path('api/crear-simple/', crear_registro_simple, name='crear-simple'),
]