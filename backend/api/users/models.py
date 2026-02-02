from django.db import models
from django.contrib.auth.models import AbstractUser

from api.models import BaseModel

class User(BaseModel, models.Model):
    # Definimos las opciones para el estado (Status)
    class StatusOptions(models.TextChoices):
        ACTIVE = 'active', 'Activo'
        INACTIVE = 'inactive', 'Inactivo'
        PENDING = 'pending', 'Pendiente'

    # Campos de la Interfaz
    document_type = models.CharField(max_length=20)
    document_number = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=255)
    # Sobrescribimos el email para que sea obligatorio y único
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    status = models.CharField(
        max_length=10,
        choices=StatusOptions.choices,
        default=StatusOptions.INACTIVE
    )
    
    # registrationDate -> auto_now_add lo gestiona automáticamente
    registration_date = models.DateTimeField(auto_now_add=True)
    
    has_card = models.BooleanField(default=False)
    
    # balance -> Para dinero, DecimalField es mucho más seguro que un Integer
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    rol = models.BooleanField(default=False)
    password = models.CharField(max_length=128)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)

    # Configuraciones extra para que Django sepa cómo tratar a este usuario
    #USERNAME_FIELD = 'email'  # El usuario iniciará sesión con email
    #REQUIRED_FIELDS = ['username', 'full_name', 'document_number']

    class Meta:
        db_table = 'auth_users'
        app_label = 'users'
        #verbose_name = 'Usuario'
        #verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.full_name} - {self.document_number}"