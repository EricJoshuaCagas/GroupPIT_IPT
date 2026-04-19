from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Borrower, Loan, Payment, User
from .serializers import (
    BorrowerSerializer,
    LoanDetailSerializer,
    LoanListSerializer,
    PaymentSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
)


# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user."""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token obtain pair view."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get current user's profile."""
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """Update current user's profile."""
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user (client should delete token)."""
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class BorrowerViewSet(viewsets.ModelViewSet):
    """ViewSet for managing borrowers."""
    queryset = Borrower.objects.all()
    serializer_class = BorrowerSerializer

    def destroy(self, request, *args, **kwargs):
        """Delete a borrower and associated loans."""
        borrower = self.get_object()
        borrower.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoanViewSet(viewsets.ModelViewSet):
    """ViewSet for managing loans."""
    queryset = Loan.objects.all()

    def get_serializer_class(self):
        """Return different serializers based on action."""
        if self.action == 'retrieve':
            return LoanDetailSerializer
        return LoanListSerializer

    @action(detail=True, methods=['get'])
    def remaining_balance(self, request, pk=None):
        """Get remaining balance for a specific loan."""
        loan = self.get_object()
        return Response({
            'loan_id': loan.id,
            'remaining_balance': loan.remaining_balance,
            'total_paid': loan.total_paid,
            'total_payable': loan.total_payable,
        })

    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        """Get all payments for a specific loan."""
        loan = self.get_object()
        payments = loan.payments.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing payments."""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        """Create a new payment with validation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        """Save the payment."""
        serializer.save()
