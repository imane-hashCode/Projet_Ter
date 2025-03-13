
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)
from ges_project_app.views.user_view import UserViewSet
from ges_project_app.views.student_views import StudentViewSet
from ges_project_app.views.project_views import ProjectViewSet, TeamViewSet
from ges_project_app.views.voeux_views import VoeuxViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects',ProjectViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'voeux', VoeuxViewSet)
router.register(r'students', StudentViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Obtenir access et refresh token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Rafraîchir le token
    # path('create-user/', create_user, name='create_user'),
    path('api/', include(router.urls))
    
]
