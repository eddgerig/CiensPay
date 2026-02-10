from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import  Transaction
from .serializer import TransactionSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.users.models import User
from api.card.models import Card
from api.card.serializer import CardSerializer


import json

# Vistas para Usuarios
"""
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def transaction_list(request):
    #Lista todas las transacciones o crea una nueva
    if request.method == 'GET':
        datos = Transaction.objects.all()
        serializer = TransactionSerializer(datos, many=True)
        return Response({
            'success': True,
            'count': datos.count(),
            'data': serializer.data
        })"""
    

class TransactionListAPIView(generics.ListAPIView):
    #serializer_class = TransactionSerializer
    queryset = Transaction.objects.select_related('card').all()
    serializer_class = TransactionSerializer
    
    def transaction_list(self):
        # select_related hace el JOIN en la consulta SQL
        return Transaction.objects.select_related('card').all()
    

class UserCardsTransactionsAPIView(APIView):
    """
    API para obtener todas las tarjetas y transacciones de un usuario
    """
    
    def get(self, request, user_id=None):
        # Si no se proporciona user_id, usar el usuario autenticado
        if not user_id and request.user.is_authenticated:
            user_id = request.user.id
        elif not user_id:
            return Response(
                {"error": "Se requiere user_id o usuario autenticado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el usuario exista
        user = get_object_or_404(User, id=user_id)
        
        # Obtener todas las tarjetas del usuario
        cards = Card.objects.filter(user=user_id).select_related('user')
        
        # Obtener todas las transacciones de las tarjetas del usuario
        card_ids = cards.values_list('id', flat=True)
        transactions = Transaction.objects.filter(
            card_id__in=card_ids
        ).select_related('card').order_by('-fecha_operacion')
        
        # Serializar los datos
        cards_data = CardSerializer(cards, many=True).data
        transactions_data = TransactionSerializer(transactions, many=True).data
        
        # Estructurar la respuesta
        response_data = {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name
            },
            "cards": cards_data,
            "transactions": transactions_data,
            "summary": {
                "total_cards": cards.count(),
                "total_transactions": transactions.count(),
                "total_balance": sum(card.saldo for card in cards if card.activo)
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    """elif request.method == 'POST':
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
    }, status=status.HTTP_400_BAD_REQUEST)"""

"""
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    
    #Login con email + password.
    #Devuelve JWT (access/refresh).
    
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
    #Lista todos los usuarios o crea uno nuevo
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

"""