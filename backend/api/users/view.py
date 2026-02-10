from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import  User
from .serializer import UserSerializer, RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password


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
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'data': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login con email + password.
    Devuelve JWT (access/refresh).
    """
    email = request.data.get('email')
    password = request.data.get('password')

    # opcional: compatibilidad hacia atrás si te mandan username
    if not email:
        email = request.data.get('username')
        
    if not email or not password:
        return Response({
            'success': False,
            'message': 'email y password son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)

    # normaliza
    email = email.strip().lower()
    user = User.objects.filter(email=email).first()

    if user is None or not check_password(password, user.password):
        return Response({
            'success': False,
            'message': 'Credenciales inválidas'
        }, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)

    return Response({
        'success': True,
        'message': 'Login exitoso',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response({
        'success': True,
        'user': UserSerializer(request.user).data
    })

 
# Vistas de todos los Usuarios
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def usuarios_list_all(request):
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

