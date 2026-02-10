from rest_framework import serializers
from .models import Card
from api.users.models import User

class CardSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.nombre', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Card
        fields = ['id', 'numero_tarjeta', 'saldo', 'activo', 'fecha_asignacion', 'fecha_vencimiento', 'user', 'user_name', 'user_email']
        read_only_fields = ['id', 'numero_tarjeta', 'fecha_asignacion', 'user_name', 'user_email']

class GenerateCardSerializer(serializers.Serializer):
    """Serializer para la generación de tarjetas"""
    user_id = serializers.IntegerField(required=False)
    document_number = serializers.CharField(required=False)
    saldo_inicial = serializers.IntegerField(default=0)
    
    def validate(self, data):
        """Validar que se proporcione user_id o document_number"""
        if not data.get('user_id') and not data.get('document_number'):
            raise serializers.ValidationError("Debe proporcionar user_id o document_number")
        return data
