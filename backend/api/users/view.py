from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import  User
from .serializers import UserSerializer
import json



# Vistas para Usuarios
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def user_list(request):
    """Lista todos los usuarios o crea uno nuevo"""
    if request.method == 'GET':
        usuarios = User.objects.all()
        serializer = UserSerializer(usuarios, many=True)
        return Response({
            'success': True,
            'count': usuarios.count(),
            'data': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Usuario creado exitosamente',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# Vista de prueba simple para POST
