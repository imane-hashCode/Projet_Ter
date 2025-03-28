from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ges_project_app.models import ProjectAssignment
from ges_project_app.attribution.attribution import affecter_projets, calculer_satisfaction

class ProjectAssignmentView(APIView):
    def post(self, request, format=None):
        try:
            result = affecter_projets()
            assignments = ProjectAssignment.objects.all()
            # Créez une réponse structurée
            response_data = {
                "message": result,
                "assignments": [
                    {
                        "student_id": a.student.id,
                        "student_name": a.student.user.username,
                        "project_id": a.project.id,
                        "project_title": a.project.title,
                        "status": a.status
                    } 
                    for a in assignments
                ],
                "count": assignments.count()
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )