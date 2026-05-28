from django.urls import path, include
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    BorrowerViewSet, 
    LoanViewSet, 
    PaymentViewSet,
    register_view,
    activate_view,
    CustomTokenObtainPairView,
    profile_view,
    update_profile_view,
    logout_view,
    chat_view,
)

router = SimpleRouter()
router.register(r'borrowers', BorrowerViewSet)
router.register(r'loans', LoanViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Djoser authentication endpoints (registration, activation, password reset)
    # NOTE: Using custom registration endpoint instead - see register_view below
    # path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    # Custom authentication endpoints
    path('auth/register/', register_view, name='register'),
    path('auth/activate/<int:uid>/<str:token>/', activate_view, name='activate'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', profile_view, name='profile'),
    path('auth/profile/update/', update_profile_view, name='update_profile'),
    path('auth/logout/', logout_view, name='logout'),
    path('v1/chat/', chat_view, name='chat'),
]
