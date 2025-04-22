from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ges_project_app.models import Deadline
from ges_project_app.serializers.deadLineSeriliser import DeadlineSerializer
from .permissions import IsAdmin

class DeadlineViewSet(ModelViewSet):
    """
    ViewSet pour gérer les deadlines.
    """
    queryset = Deadline.objects.all()
    serializer_class = DeadlineSerializer
    permission_classes = [IsAdmin]
    
    def create(self, request, *args, **kwargs):
        if Deadline.objects.filter(type="voeux").exists():
            return Response({"error": "Une date limite pour les vœux existe déjà."}, status=400)
        return super().create(request, *args, **kwargs)