from django.db import models

class BaseModel(models.Model):
    """Clase base para que todas las tablas tengan auditoría automática"""
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última modificación")

    class Meta:
        abstract = True # IMPORTANTE: Indica que esto no crea una tabla propia