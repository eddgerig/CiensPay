from rest_framework import serializers

from api.card.models import Card
from .models import  Transaction
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password

"""
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['id']
"""
    
"""def validate_email(self, value):
        #Validación personalizada para email
        if not value:
            raise serializers.ValidationError("El email es requerido")
        return value"""
   

   
class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'numero_tarjeta', 'saldo', 'activo', 'fecha_vencimiento']

        
class TransactionSerializer(serializers.ModelSerializer):
    card_detail = CardSerializer(source='card', read_only=True)
    
    class Meta:
        model = Transaction
        # Opción A: Lista todos los campos manualmente
        fields = [field.name for field in Transaction._meta.fields] + ['card_detail']
        read_only_fields = ['id']