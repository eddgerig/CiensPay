from django.apps import apps
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class UsersJWTAuthentication(JWTAuthentication):
    """
    Autenticación JWT que resuelve el usuario usando tu modelo custom (auth_users),
    en vez del django.contrib.auth User.
    """

    def get_user(self, validated_token):
        User = apps.get_model("users", "User")  # tu app_label='users'

        user_id = validated_token.get("user_id")
        if not user_id:
            raise AuthenticationFailed("Token inválido: falta user_id", code="token_not_valid")

        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found", code="user_not_found")
