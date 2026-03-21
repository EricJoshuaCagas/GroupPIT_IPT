from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BorrowerViewSet, LoanViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'borrowers', BorrowerViewSet)
router.register(r'loans', LoanViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
