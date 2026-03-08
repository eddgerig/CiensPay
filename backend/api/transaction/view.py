from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
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
from datetime import datetime
import pytz
from django.conf import settings
import requests
from .models import Transaction 
from .serializer import TransactionSerializer, TransactionCreateSerializer

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
    

class TransactionListAPIView(generics.ListCreateAPIView):
    queryset = Transaction.objects.select_related('card').all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TransactionCreateSerializer
        return TransactionSerializer
    
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

class SimulatePaymentAPIView(APIView):
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación para el simulador

    def post(self, request):
        button_bank_external = request.data.get('button_bank_external')
        bank_identifier = request.data.get('bank_identifier')
        card_number = request.data.get('card_number')
        expiry_date = request.data.get('expiry_date') # Formato MM/YY
        cvv = request.data.get('cvv')
        amount = request.data.get('amount')
        description = request.data.get('description', 'Compra simulada')
        expiry_date = request.data.get('expiry_date')
        cvv = request.data.get('cvv')
        

        if not all([card_number, expiry_date, cvv, amount]):
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            amount = float(amount)
            if amount <= 0:
                raise ValueError
        except ValueError:
            return Response({'error': 'Monto inválido'}, status=status.HTTP_400_BAD_REQUEST)

        card= None

        # 1. Validar tarjeta
        try:
            card = Card.objects.get(numero_tarjeta=card_number.replace(" ", ""))
        except Card.DoesNotExist:
            if bank_identifier in [ 'cienspay', '4651', 'grupo2']:
                return Response({'error': 'Tarjeta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        if button_bank_external == True  or (button_bank_external == False and bank_identifier in [ 'cienspay', '4651', 'grupo2']):
                    
            if not card.activo:
                return Response({'error': 'La tarjeta no está activa'}, status=status.HTTP_400_BAD_REQUEST)


            # 2. Validar fecha de vencimiento
            # Asumiendo que expiry_date viene como "MM/YY"
            try:
                exp_month, exp_year = map(int, expiry_date.split('/'))
                # Convertir año de 2 dígitos a 4 (asumiendo 20xx)
                exp_year += 2000
                
                # Obtener el último día del mes de vencimiento para comparar con la fecha de la base de datos
                # O simplemente comparar mes y año si fecha_vencimiento es solo fecha
                if card.fecha_vencimiento:
                    if card.fecha_vencimiento.year != exp_year or card.fecha_vencimiento.month != exp_month:
                        return Response({'error': 'Fecha de vencimiento incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Verificar si ya venció (opcional, dependiendo de si se bloquean transacciones)
                    now = datetime.now(pytz.UTC)
                    if card.fecha_vencimiento < now:
                        return Response({'error': 'La tarjeta ha expirado'}, status=status.HTTP_400_BAD_REQUEST)

            except ValueError:
                return Response({'error': 'Formato de fecha de vencimiento inválido'}, status=status.HTTP_400_BAD_REQUEST)

            # 3. Validar saldo
            if card.saldo < amount:
                return Response({'error': 'Fondos insuficientes'}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Procesar pago
        try:

 # 5. Lógica de Banco Externo
            if button_bank_external is True: # si es un boton de pago externo

                saldo_anterior = card.saldo
                card.saldo -= amount
                card.save()
                
                Transaction.objects.create(
                    card=card,
                    tipo=Transaction.TransactionType.RETIRO, # O 'COMPRA' si existiera
                    monto=amount,
                    saldo_anterior=saldo_anterior,
                    saldo_posterior=card.saldo,
                    descripcion=description,
                    exitoso=True
                )
                    

                    
                if bank_identifier in ['creditbank', 'grupo3']:
                    url = 'https://core-banking-service-6pup.onrender.com/external/transfer-in'
                    
                    payload = {
                        "amount": amount,
                        "target_account_number": "1234567890",
                        "external_bank_name": f"{bank_identifier} cienspay",
                        "external_card_number": card_number
                    }

                    print(f"Enviando a API externa: {url}")
                    print(f"Payload: {payload}")
                    
                    try:
                        
                        response = requests.patch(url, json=payload, timeout=30)  # Método PATCH para el endpoint de balance
                        print(f"Respuesta status: {response.status_code}")
                        print(f"Respuesta contenido: {response.text}")
                        
                        response.raise_for_status()
                        return Response(response.json(), status=status.HTTP_200_OK)

                    except requests.exceptions.RequestException as e:
                        print(f"Error en petición externa: {str(e)}")
                        # Aquí deberías hacer ROLLBACK de la transacción
                        # Revertir el descuento de la tarjeta
                        card.saldo += amount
                        card.save()
                        
                        return Response({
                            'error': f'Error en comunicación bancaria: {str(e)}'
                        }, status=status.HTTP_502_BAD_GATEWAY)
                elif bank_identifier in [ 'grupo5' , 'bancobsidiana']:
                    url = 'https://ecommerce-bancobsidiana-team5-production.up.railway.app/api/v1/transaction/process'
                    
                    payload = {
                         "card_number": card_number,
                        "expiry": expiry_date,
                        "cvv": cvv,
                        "amount": amount,
                        "merchant_id": "t3ch-pr0",
                        "description": description,
                        "destination_account": "1234567890" 
                    }


                    print(f"Enviando a API externa: {url}")
                    print(f"Payload: {payload}")
                    
                    try:
                        
                        response = requests.post(url, json=payload, timeout=30)  # Método PATCH para el endpoint de balance
                        print(f"Respuesta status: {response.status_code}")
                        print(f"Respuesta contenido: {response.text}")
                        
                        response.raise_for_status()
                        return Response(response.json(), status=status.HTTP_200_OK)

                    except requests.exceptions.RequestException as e:
                        print(f"Error en petición externa: {str(e)}")
                        # Aquí deberías hacer ROLLBACK de la transacción
                        # Revertir el descuento de la tarjeta
                        card.saldo += amount
                        card.save()
                        
                        return Response({
                            'error': f'Error en comunicación bancaria: {str(e)}'
                        }, status=status.HTTP_502_BAD_GATEWAY)

                    return Response({
                        'success': True, 
                        'message': 'grupo5',
                        'new_balance': card.saldo
                    }, status=status.HTTP_200_OK)
                else:       
                    return Response({
                        'error': 'Banco no encontrado'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            if button_bank_external is False:
                if bank_identifier in [ 'cienspay', '4651', 'grupo2']:
                    
                    saldo_anterior = card.saldo
                    card.saldo -= amount
                    card.save()
                    
                    Transaction.objects.create(
                        card=card,
                        tipo=Transaction.TransactionType.RETIRO, # O 'COMPRA' si existiera
                        monto=amount,
                        saldo_anterior=saldo_anterior,
                        saldo_posterior=card.saldo,
                        descripcion=description,
                        exitoso=True
                    )
                    url = f"{settings.CIENSPAY_API_URL}/cards/14/balance/"
                    
                    payload = {
                        "balance":amount ,
                    }

                    try:
                        
                        response = requests.patch(url, json=payload, timeout=30)  # Método PATCH para el endpoint de balance
                        print(f"Respuesta status: {response.status_code}")
                        print(f"Respuesta contenido: {response.text}")
                        card_cienspay = Card.objects.get(numero_tarjeta= '4651001855562775')
                        Transaction.objects.create(
                        card=card_cienspay,
                        tipo=Transaction.TransactionType.TRANSFERENCIA, # O 'COMPRA' si existiera
                        monto=amount,
                        saldo_anterior=1,
                        saldo_posterior=2,
                        descripcion='tRANSFERENCIA EXITOSA',
                        exitoso=True
                    )
                        
                        response.raise_for_status()
                        return Response(response.json(), status=status.HTTP_200_OK)

                    except requests.exceptions.RequestException as e:
                        print(f"Error en petición externa: {str(e)}")
                        # Aquí deberías hacer ROLLBACK de la transacción
                        # Revertir el descuento de la tarjeta
                      
                        return Response({
                            'error': f'Error en comunicación bancaria: {str(e)}'
                        }, status=status.HTTP_502_BAD_GATEWAY)

                    return Response({
                        'success': True, 
                        'message': 'Pago realizado con éxito',
                        'new_balance': card.saldo
                    }, status=status.HTTP_200_OK)

                elif bank_identifier in ['creditbank', 'grupo3']:
                    # Lógica para CreditBank/Grupo3
                    url = 'https://core-banking-service-6pup.onrender.com/external/transfer-in'
                    
                    payload = {
                        "amount": amount,
                        "target_account_number": "1234567890",
                        "external_bank_name": f"{bank_identifier} cienspay",
                        "external_card_number": card_number
                    }

                    print(f"Enviando a API CreditBank: {url}")
                    print(f"Payload: {payload}")
                    
                    try:
                        response = requests.post(url, json=payload, timeout=30)
                        print(f"Respuesta status: {response.status_code}")
                        print(f"Respuesta contenido: {response.text}")
                        
                        response.raise_for_status()
                        
                        # Si la respuesta es exitosa, crear la transacción local
                        Transaction.objects.create(
                            card=card,
                            tipo=Transaction.TransactionType.RETIRO,
                            monto=amount,
                            saldo_anterior=saldo_anterior,
                            saldo_posterior=card.saldo,
                            descripcion=f"Transferencia a {bank_identifier}",
                            exitoso=True
                        )
                        
                        return Response({
                            'success': True,
                            'message': f'Transferencia a {bank_identifier} realizada con éxito',
                            'new_balance': card.saldo,
                            'bank_response': response.json() if response.text else {}
                        }, status=status.HTTP_200_OK)

                    except requests.exceptions.RequestException as e:
                        print(f"Error en petición externa a {bank_identifier}: {str(e)}")
                        # ROLLBACK: revertir el descuento de la tarjeta
                        card.saldo += amount
                        card.save()

                elif bank_identifier in [ 'grupo5' , 'bancobsidiana']:
                    # Lógica para CreditBank/Grupo3
                    url = 'https://ecommerce-bancobsidiana-team5-production.up.railway.app/api/v1/transaction/process'
                    
                    payload = {
                        "card_number": card_number,
                        "expiry": expiry_date,
                        "cvv": cvv,
                        "amount": amount,
                        "merchant_id": "t3ch-pr0",
                        "description": description
                    }

                    print(f"Enviando a API CreditBank: {url}")
                    print(f"Payload: {payload}")
                    
                    try:
                        response = requests.post(url, json=payload, timeout=30)
                        print(f"Respuesta status: {response.status_code}")
                        print(f"Respuesta contenido: {response.text}")
                        
                        response.raise_for_status()

                        card_cienspay = Card.objects.get(numero_tarjeta= '4651001855562775')
                        # Si la respuesta es exitosa, crear la transacción local
                        Transaction.objects.create(
                            card=card_cienspay,
                            tipo=Transaction.TransactionType.TRANSFERENCIA,
                            monto=amount,
                            saldo_anterior=2,
                            saldo_posterior=3,
                            descripcion=f"Transferencia de {amount} del banco {bank_identifier}",
                            exitoso=True
                        )
                        
                        return Response({
                            'success': True,
                            'message': f'Transferencia a {bank_identifier} realizada con éxito'
                            
                            
                        }, status=status.HTTP_200_OK)

                    except requests.exceptions.RequestException as e:
                        print(f"Error en petición externa a {bank_identifier}: {str(e)}")
                        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                        

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
        #else:
        #    return Response({'error': 'Banco no encontrado'}, status=status.HTTP_404_NOT_FOUND)


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