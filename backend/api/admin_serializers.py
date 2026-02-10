from rest_framework import serializers
from django.apps import apps

User = apps.get_model("users", "User")  #  modelo real (app_label='users')


class AdminUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "document_type", "document_number",
            "full_name",
            "email",
            "phone",
            "status",
            "registration_date",
            "has_card",
            "balance",
            "rol",
            "username",
        ]
        read_only_fields = ["id", "registration_date", "has_card", "balance"]


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """
    PATCH parcial:
    - status, rol
    - full_name, email, phone, username, document_type, document_number
    """
    class Meta:
        model = User
        fields = [
            "document_type", "document_number",
            "full_name",
            "email",
            "phone",
            "status",
            "rol",
            "username",
        ]

    def validate_status(self, value):
        # valida contra choices del modelo
        valid = [c[0] for c in User.StatusOptions.choices]
        if value not in valid:
            raise serializers.ValidationError(f"status inválido. Usa: {valid}")
        return value

    def validate_email(self, value):
        qs = User.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value

    def validate_document_number(self, value):
        qs = User.objects.filter(document_number=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Este documento ya está registrado.")
        return value
