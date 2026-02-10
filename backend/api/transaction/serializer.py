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


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['card', 'tipo', 'monto', 'descripcion']
        
    def validate(self, data):
        card = data['card']
        monto = data['monto']
        tipo = data['tipo']
        
        if os_transaction_type_is_negative(tipo):
            if card.saldo < monto:
                 raise serializers.ValidationError("Saldo insuficiente para realizar esta transacción.")
                 
        return data

    def create(self, validated_data):
        card = validated_data['card']
        monto = validated_data['monto']
        tipo = validated_data['tipo']
        
        # 1. Registrar saldo anterior
        validated_data['saldo_anterior'] = card.saldo
        
        # 2. Actualizar saldo
        if os_transaction_type_is_negative(tipo):
            card.saldo -= monto
        else:
            card.saldo += monto
            
        card.save()
        
        # 3. Registrar saldo posterior
        validated_data['saldo_posterior'] = card.saldo
        
        # 4. Crear transacción
        return super().create(validated_data)

def os_transaction_type_is_negative(tipo):
    # Asumiendo que RETIRO y TRANSFERENCIA restan
    return tipo in [Transaction.TransactionType.RETIRO, Transaction.TransactionType.TRANSFERENCIA]