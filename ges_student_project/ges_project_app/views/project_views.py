from rest_framework import viewsets, permissions
from ges_project_app.models import Project, Team
from ges_project_app.serializers.projects_serializer import ProjectSerializer, TeamSerializer
from rest_framework.exceptions import PermissionDenied
from .permissions import IsSupervisorOrAdmin


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsSupervisorOrAdmin]
    
    def perform_create(self, serializer):
        # Associer automatiquement le superviseur actuel au projet
        serializer.save(supervisor=self.request.user)
        
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsSupervisorOrAdmin]