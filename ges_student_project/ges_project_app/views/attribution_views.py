from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from collections import defaultdict
from ges_project_app.models import ProjectAssignment, Student, Project
from ges_project_app.attribution import attribution, gale_shapley_attribution
from .permissions import IsAdmin    

class ProjectAssignmentView(APIView):
    
    # permission_classes = [IsAdmin]
    
    def post(self, request, format=None):
        """
        Lancer l'affectation des étudiants aux projets.
        """
        try:
            
            level = request.data.get("level")
            if level is None:
                return Response(
                    {"error": "Le paramètre 'level' est requis."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # result = attribution.affecter_projets(level=level) 
            result = gale_shapley_attribution.affectation_projet(level=level)
                
            return Response(
                {"message": "Affectation terminée avec succès.", "details": result},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    def get(self, request, format=None):
        """
        Récupérer la liste des projets et des étudiants affectés.
        """
        try:
            
            # Récupérer le niveau depuis les paramètres de la requête
            level = request.query_params.get("level")

            if level is None:
                return Response(
                {"error": "Le paramètre 'level' est requis."},
                status=status.HTTP_400_BAD_REQUEST
            )
            assignments = ProjectAssignment.objects.select_related("student__user", "project__supervisor").filter(project__level=level)
            projects_dict = defaultdict(list)

            for assignment in assignments:
                projects_dict[assignment.project].append({
                    "student_id": assignment.student.id,
                    "student_name": assignment.student.user.username,
                    "student_level": assignment.student.level,
                    "status": assignment.status
                })
                
            # Étudiants non affectés (ceux qui ne sont pas dans ProjectAssignment)
            all_students = set(Student.objects.filter(level=level))

            assigned_students = set(assignment.student for assignment in assignments)
            unassigned_students = all_students - assigned_students

            unassigned_students_list = [
                {
                    "student_id": student.id,
                    "student_name": student.user.username,
                    "student_level": student.level
                }
                for student in unassigned_students
            ]

            # Groupes sans projet (équipes qui n'ont pas d'affectation)
            all_projects = set(Project.objects.filter(level=level))

            assigned_projects = set(assignment.project for assignment in assignments)
            unassigned_projects = all_projects - assigned_projects

            unassigned_projects_list = [
                {
                    "project_id": project.id,
                    "project_code": project.code,
                    "project_title": project.title,
                    "supervisor": project.supervisor.username,
                }
                for project in unassigned_projects
            ]

            # Calcul du score de satisfaction
            # satisfaction_score = attribution.calculer_satisfaction(level=level)
            satisfaction_score = gale_shapley_attribution.calculer_satisfaction(level=level)
            
            response_data = {
                "projects": [
                    {
                        "project_id": project.id,
                        "project_code": project.code,
                        "project_title": project.title,
                        "supervisor": project.supervisor.username,
                        "students": students,
                        "student_count": len(students)
                    }
                    for project, students in projects_dict.items()
                ],
                "unassigned_students": unassigned_students_list,
                "unassigned_projects": unassigned_projects_list,
                "stats": {
                    "satisfaction_score": satisfaction_score,
                    "total_assignments": assignments.count(),
                    "total_projects": len(projects_dict),
                    "unassigned_students_count": len(unassigned_students_list),
                    "unassigned_projects_count": len(unassigned_projects_list)
                },
                
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )