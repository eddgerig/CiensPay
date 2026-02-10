from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Card
from .serializers import CardSerializer, GenerateCardSerializer
from api.users.models import User
from datetime import datetime, timedelta

@api_view(['POST'])
@permission_classes([AllowAny])  # Cambiar a IsAuthenticated en producción
def generate_card(request):
    """
    Genera una nueva tarjeta para un usuario
    
    Body params:
    - user_id (opcional): ID del usuario
    - document_number (opcional): Número de documento del usuario
    - saldo_inicial (opcional): Saldo inicial de la tarjeta (default: 0)
    """
    serializer = GenerateCardSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    # Buscar el usuario
    user = None
    if data.get('user_id'):
        try:
            user = User.objects.get(id=data['user_id'])
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
    elif data.get('document_number'):
        # Asumiendo que el documento está en el campo 'edad' o crear un nuevo campo
        # Por ahora buscaremos por email que contenga el documento
        users = User.objects.filter(email__icontains=data['document_number'])
        if not users.exists():
            return Response({
                'success': False,
                'message': 'Usuario no encontrado con ese número de documento'
            }, status=status.HTTP_404_NOT_FOUND)
        user = users.first()
    
    # Verificar si el usuario ya tiene una tarjeta activa
    existing_card = Card.objects.filter(user=user, activo=True).first()
    if existing_card:
        return Response({
            'success': False,
            'message': 'El usuario ya tiene una tarjeta activa',
            'existing_card': CardSerializer(existing_card).data
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Generar número de tarjeta único
        card_number = Card.generate_card_number()
        
        # Fecha de vencimiento: 4 años desde hoy
        expiration_date = datetime.now() + timedelta(days=365*4)
        
        # Usar el balance del usuario como saldo inicial de la tarjeta
        initial_balance = int(user.balance)
        
        # Crear la tarjeta
        card = Card.objects.create(
            numero_tarjeta=card_number,
            saldo=initial_balance,  # Saldo = balance del usuario
            activo=True,
            user=user,
            fecha_vencimiento=expiration_date
        )
        
        # Actualizar el campo has_card del usuario a True
        user.has_card = True
        user.save(update_fields=['has_card'])
        
        return Response({
            'success': True,
            'message': 'Tarjeta generada exitosamente',
            'card': CardSerializer(card).data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error al generar la tarjeta: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_cards(request):
    """Lista todas las tarjetas"""
    cards = Card.objects.all().select_related('user')
    serializer = CardSerializer(cards, many=True)
    return Response({
        'success': True,
        'count': cards.count(),
        'cards': serializer.data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_cards(request, user_id):
    """Obtiene las tarjetas de un usuario específico"""
    try:
        user = User.objects.get(id=user_id)
        cards = Card.objects.filter(user=user)
        serializer = CardSerializer(cards, many=True)
        return Response({
            'success': True,
            'count': cards.count(),
            'cards': serializer.data
        })
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Usuario no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([AllowAny])  # Cambiar a IsAuthenticated en producción
def toggle_card_status(request, card_id):
    """
    Activa o desactiva una tarjeta
    
    Body params:
    - activo (opcional): True o False para activar/desactivar
    Si no se proporciona, se togglea el estado actual
    """
    try:
        card = Card.objects.get(id=card_id)
        
        # Si se proporciona el campo activo, usarlo; sino, togglear
        if 'activo' in request.data:
            new_status = request.data['activo']
        else:
            new_status = not card.activo
        
        card.activo = new_status
        card.save(update_fields=['activo'])
        
        return Response({
            'success': True,
            'message': f'Tarjeta {"activada" if new_status else "desactivada"} exitosamente',
            'card': CardSerializer(card).data
        }, status=status.HTTP_200_OK)
        
    except Card.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Tarjeta no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error al actualizar el estado de la tarjeta: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['PATCH'])
@permission_classes([AllowAny])  # Cambiar a IsAuthenticated en producción
def update_card_balance(request, card_id):
    """
    Actualiza el saldo de una tarjeta
    
    Body params:
    - balance: Nuevo saldo (entero o decimal)
    """
    try:
        card = Card.objects.get(id=card_id)
        
        if 'balance' not in request.data:
            return Response({
                'success': False,
                'message': 'El campo balance es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            new_balance = int(float(request.data['balance']))
        except (ValueError, TypeError):
             return Response({
                'success': False,
                'message': 'El balance debe ser un número válido'
            }, status=status.HTTP_400_BAD_REQUEST)

        if new_balance < 0:
             return Response({
                'success': False,
                'message': 'El balance no puede ser negativo'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        card.saldo = new_balance
        card.save(update_fields=['saldo'])
        
        # También actualizamos el balance del usuario para mantener consistencia 
        # (si esa es la lógica deseada, sino comentar las siguientes 2 líneas)
        if card.user:
            card.user.balance = new_balance
            card.user.save(update_fields=['balance'])
        
        return Response({
            'success': True,
            'message': 'Saldo actualizado exitosamente',
            'card': CardSerializer(card).data
        }, status=status.HTTP_200_OK)
        
    except Card.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Tarjeta no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error al actualizar el saldo: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
