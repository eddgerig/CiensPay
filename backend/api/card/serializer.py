# api/card/serializer.py
from rest_framework import serializers
from .models import Card
from api.transaction.serializer import TransactionSerializer

class CardSerializer(serializers.ModelSerializer):
    # Para incluir las transacciones de esta tarjeta (opcional)
    transactions = TransactionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Card
        fields = ['id', 'numero_tarjeta', 'saldo', 'activo', 
                  'fecha_vencimiento', 'user', 'transactions']