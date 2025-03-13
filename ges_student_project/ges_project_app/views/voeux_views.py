from rest_framework import viewsets, permissions
from rest_framework.response import Response
from ges_project_app.models import Voeux, User, Project
from ges_project_app.serializers.voeux_serializer import VoeuxSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers
from rest_framework.decorators import action

class VoeuxViewSet(viewsets.ModelViewSet):
    queryset = Voeux.objects.all()
    serializer_class = VoeuxSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Un étudiant ne peut voir que ses propres préférences
        return Voeux.objects.filter(student=self.request.user.student)

    @action(detail=False, methods=['post'])
    def submit_voeux(self, request):
        """Soumettre une liste de préférences pour un étudiant."""
        print("Données reçues du frontend:", request.data) 
        student = request.user.student
        preferences = request.data.get('voeux', [])  # Format : [{"project_id": 1, "preference_order": 1, "preference_score": 5}]

        # Supprimer les préférences existantes de l'étudiant
        Voeux.objects.filter(student=student).delete()
        # Créer les nouvelles préférences
        for pref in preferences:
            project_id = pref.get('project_id')
            rank = pref.get('rank')
            note_preference = pref.get('note_preference', None)

            project = Project.objects.get(id=project_id)
            Voeux.objects.create(
                student=student,
                project=project,
                rank=rank,
                note_preference=note_preference,
            )

        return Response({"message": "Préférences soumises avec succès."})