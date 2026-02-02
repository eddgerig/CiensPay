from django.db import models

from api.models import BaseModel

class Card(BaseModel, models.Model):
    numero_tarjeta = models.CharField(max_length=100)
    saldo = models.IntegerField()
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    fecha_vencimiento = models.DateTimeField(null=True, blank=True)
    
    # El campo booleano para el estado
    activo = models.BooleanField(default=False) 
    
    # La ForeignKey apuntando a tu modelo 'User' de la app 'users'
    # Usamos el string 'users.User' para evitar errores de importación
    user = models.ForeignKey(
        'users.User', 
        on_delete=models.CASCADE, 
        related_name='cards'
    )

    class Meta:
        db_table = 'cards'
        app_label = 'card'  
    
    def __str__(self):
        return f"Tarj: {self.numero_tarjeta} - Usuario: {self.user.full_name}"