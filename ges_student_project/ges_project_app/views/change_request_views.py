from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .permissions import IsAdmin
from ges_project_app.models import ChangeRequest, StudentsTeams, ProjectAssignment
from ges_project_app.serializers.change_request_serializer import ChangeRequestSerializer
from django.utils.timezone import now


class ChangeRequestViewSet(viewsets.ModelViewSet):
    queryset = ChangeRequest.objects.all()
    serializer_class = ChangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return ChangeRequest.objects.filter(student__user=user)
        elif user.role == "admin":
            return ChangeRequest.objects.all()
        return ChangeRequest.objects.none()

    def perform_create(self, serializer):
        # L’étudiant crée une demande
        student = self.request.user.student
        current_assignment = student.assignments.first()
        current_team = student.teams.first().team if student.teams.exists() else None
        
        desired_project = serializer.validated_data.get("desired_project")
        desired_team = serializer.validated_data.get("desired_team")
        
        # Vérification : empêcher une demande vers le même projet/équipe
        if desired_project and current_assignment and desired_project == current_assignment.project:
            raise ValidationError("Vous êtes déjà affecté à ce projet.")

        if desired_team and current_team and desired_team == current_team:
            raise ValidationError("Vous êtes déjà membre de cette équipe.")

        serializer.save(
            student=student,
            current_project=current_assignment.project if current_assignment else None,
            current_team=current_team
        )
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if user.role != "admin":
            return Response({"error": "Seuls les administrateurs peuvent traiter les demandes."}, status=403)

        if instance.status != "pending":
            return Response({"error": "La demande a déjà été traitée."}, status=400)

        new_status = request.data.get("status")
        if new_status not in ["approved", "rejected"]:
            return Response({"error": "Statut invalide."}, status=400)

        instance.status = new_status
        instance.processed_by = user
        instance.processed_at = now()

        # S’il est approuvé, appliquer le changement
        if new_status == "approved":
            if instance.desired_team:
                StudentsTeams.objects.update_or_create(
                    student=instance.student,
                    defaults={"team": instance.desired_team}
                )
            elif instance.desired_project:
                ProjectAssignment.objects.update_or_create(
                    student=instance.student,
                    defaults={"project": instance.desired_project}
                )

        instance.save()
        return Response({"message": "Demande traitée avec succès."})