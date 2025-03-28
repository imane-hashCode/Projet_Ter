from rest_framework import viewsets, permissions
from ges_project_app.models import Project, Team, Student
from ges_project_app.serializers.projects_serializer import ProjectSerializer, TeamSerializer
from rest_framework.exceptions import PermissionDenied
from .permissions import IsSupervisorOrAdmin


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsSupervisorOrAdmin]
    def get_queryset(self):
        user = self.request.user
        
        if user.is_authenticated and user.role == 'student':
            try:
                student = Student.objects.get(user=user)  
                return Project.objects.filter(level=student.level)
            except Student.DoesNotExist:
                return Project.objects.none() 
            
        if user.is_authenticated and user.role == 'supervisor':
            return Project.objects.filter(supervisor=user)
        return Project.objects.all() 
    
    def perform_create(self, serializer):
        serializer.save(supervisor=self.request.user)
        
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsSupervisorOrAdmin]