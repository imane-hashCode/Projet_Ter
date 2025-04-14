from rest_framework import permissions

class IsSupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Seuls les encadrants (supervisors) et les administrateurs peuvent créer des projets
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user.is_authenticated and request.user.role in ["admin", "supervisor"]