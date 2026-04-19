from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    BorrowerViewSet, 
    LoanViewSet, 
    PaymentViewSet,
    register_view,
    CustomTokenObtainPairView,
    profile_view,
    update_profile_view,
    logout_view,
)

router = DefaultRouter()
router.register(r'borrowers', BorrowerViewSet)
router.register(r'loans', LoanViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('register/', register_view, name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', profile_view, name='profile'),
    path('auth/profile/update/', update_profile_view, name='update_profile'),
    path('auth/logout/', logout_view, name='logout'),
]
