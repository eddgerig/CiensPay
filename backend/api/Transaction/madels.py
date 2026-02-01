import uuid
from django.db import models

class Transaction(models.Model):
    # Tipos de transacciones (buena práctica para filtrar)
    """class TransactionType(models.TextChoices):
        DEPOSITO = 'DEP', 'Depósito'
        RETIRO = 'RET', 'Retiro/Pago'
        TRANSFERENCIA = 'TRA', 'Transferencia'
        REEMBOLSO = 'REE', 'Reembolso'

    # 1. Identificadores Únicos
    id_transaccion = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    """
    # 2. Relaciones
    # Vinculamos a la tarjeta. Si se borra la tarjeta, decidimos qué pasa con el historial.
    # Usualmente se prefiere models.PROTECT para no perder registros contables.
    card = models.ForeignKey('cards.Card', on_delete=models.PROTECT, related_name='transactions')
    
    # 3. Datos Financieros
    tipo = models.CharField(max_length=3, choices=TransactionType.choices)
    monto = models.IntegerField() # Usamos Integer porque así definiste el saldo en Card
    
    # Auditoría de saldo: ¿Cuánto había antes y cuánto quedó después?
    # Esto es VITAL para detectar errores en la lógica de negocio.
    saldo_anterior = models.IntegerField()
    saldo_posterior = models.IntegerField()

    # 4. Información de Seguimiento
    fecha_operacion = models.DateTimeField(auto_now_add=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    
    # Estado de la transacción (opcional pero útil)
    exitoso = models.BooleanField(default=True)

    class Meta:
        db_table = 'transaction_history'
        ordering = ['-fecha_operacion'] # Ver las más recientes primero

    def __str__(self):
        return f"{self.tipo} - {self.monto} - Card: {self.card.numero_tarjeta}"