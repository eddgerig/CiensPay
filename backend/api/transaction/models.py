from django.db import models
from api.models import BaseModel

class Transaction(BaseModel, models.Model):
    class TransactionType(models.TextChoices):
        DEPOSITO = 'DEP', 'Depósito'
        RETIRO = 'RET', 'Retiro/Pago'
        TRANSFERENCIA = 'TRA', 'Transferencia'
        REEMBOLSO = 'REE', 'Reembolso'

    card = models.ForeignKey('card.Card', on_delete=models.PROTECT, related_name='transactions')

    tipo = models.CharField(max_length=3, choices=TransactionType.choices)
    monto = models.BigIntegerField()

    saldo_anterior = models.BigIntegerField()
    saldo_posterior = models.BigIntegerField()

    fecha_operacion = models.DateTimeField(auto_now_add=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    exitoso = models.BooleanField(default=True)

    class Meta:
        db_table = 'transaction_history'
        app_label = 'transaction'  # debe coincidir con el nombre real del app
        ordering = ['-fecha_operacion']
        indexes = [
            models.Index(fields=['card', '-fecha_operacion']),
            models.Index(fields=['tipo']),
        ]

    def __str__(self):
        return f"{self.tipo} - {self.monto} - Card: {self.card.numero_tarjeta}"
