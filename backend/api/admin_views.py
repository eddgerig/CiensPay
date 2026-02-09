from django.apps import apps
from django.db.models import Prefetch, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework import status
from api.users.serializer import UserWithCardsSerializer, AdminUserUpdateSerializer


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user and user.is_authenticated and
            (getattr(user, "rol", False) or getattr(user, "is_staff", False))
        )

def _to_int(value, default):
    try:
        return int(value)
    except Exception:
        return default

@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_users_cards(request):
    """
    GET /api/admin/users-cards/?page=1&page_size=20&search=juan&status=active
    Devuelve usuarios + sus tarjetas.
    """
    UserModel = apps.get_model("users", "User")   # app_label='users'
    CardModel = apps.get_model("card", "Card")    # app_label='card'

    page = max(_to_int(request.query_params.get("page"), 1), 1)
    page_size = _to_int(request.query_params.get("page_size"), 20)
    page_size = min(max(page_size, 1), 100)

    search = (request.query_params.get("search") or "").strip()
    status_filter = (request.query_params.get("status") or "").strip()
    has_card = request.query_params.get("has_card")       # "true"/"false"
    card_active = request.query_params.get("card_active") # "true"/"false"

    qs = UserModel.objects.all()

    if search:
        qs = qs.filter(
            Q(full_name__icontains=search) |
            Q(email__icontains=search) |
            Q(document_number__icontains=search)
        )

    if status_filter:
        qs = qs.filter(status=status_filter)

    if has_card in ("true", "false"):
        qs = qs.filter(has_card=(has_card == "true"))

    card_qs = CardModel.objects.all().order_by("-fecha_asignacion")
    if card_active in ("true", "false"):
        card_qs = card_qs.filter(activo=(card_active == "true"))

    qs = qs.prefetch_related(Prefetch("cards", queryset=card_qs))

    total = qs.count()
    start = (page - 1) * page_size
    end = start + page_size
    users = qs.order_by("-registration_date")[start:end]

    data = []
    for u in users:
        cards_data = []
        for c in u.cards.all():
            cards_data.append({
                "id": c.id,
                "numero_tarjeta": c.numero_tarjeta,
                "saldo": c.saldo,
                "fecha_asignacion": c.fecha_asignacion,
                "fecha_vencimiento": c.fecha_vencimiento,
                "activo": c.activo,
            })

        data.append({
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "document_type": u.document_type,
            "document_number": u.document_number,
            "phone": u.phone,
            "status": u.status,
            "registration_date": u.registration_date,
            "has_card": u.has_card,
            "balance": str(u.balance),
            "rol": u.rol,
            "cards_count": len(cards_data),
            "cards": cards_data,
        })

    return Response({
        "success": True,
        "page": page,
        "page_size": page_size,
        "total": total,
        "data": data
    }, status=status.HTTP_200_OK)

@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAdmin])
def admin_user_detail(request, pk: int):
    User = apps.get_model("users", "User")

    user = User.objects.filter(pk=pk).first()
    if not user:
        return Response(
            {"success": False, "message": "Usuario no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    # GET detalle
    if request.method == "GET":
        return Response(
            {"success": True, "data": UserWithCardsSerializer(user).data},
            status=status.HTTP_200_OK
        )

    # PATCH update parcial
    if request.method == "PATCH":
        serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return Response(
            {"success": True, "message": "Usuario actualizado", "data": UserWithCardsSerializer(user).data},
            status=status.HTTP_200_OK
        )

    # DELETE (por defecto: soft delete => status=inactive)
    hard = (request.query_params.get("hard") == "true")
    if hard:
        user.delete()
        return Response(
            {"success": True, "message": "Usuario eliminado (hard delete)"},
            status=status.HTTP_200_OK
        )

    user.status = "inactive"
    user.save(update_fields=["status"])
    return Response(
        {"success": True, "message": "Usuario desactivado (soft delete)", "data": UserWithCardsSerializer(user).data},
        status=status.HTTP_200_OK
    )
