from rest_framework import serializers
from .models import Borrower, Loan, Payment
from decimal import Decimal


class BorrowerSerializer(serializers.ModelSerializer):
    """Serializer for Borrower model."""
    class Meta:
        model = Borrower
        fields = ['id', 'full_name', 'contact_number', 'email', 'address', 'created_at']
        read_only_fields = ['id', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    class Meta:
        model = Payment
        fields = ['id', 'loan', 'amount', 'payment_date', 'payment_method', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_amount(self, value):
        """Validate payment amount is greater than 0."""
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be greater than 0")
        return value


class LoanDetailSerializer(serializers.ModelSerializer):
    """Serializer for Loan model with computed fields."""
    borrower_name = serializers.CharField(source='borrower.full_name', read_only=True)
    total_paid = serializers.SerializerMethodField()
    remaining_balance = serializers.SerializerMethodField()
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Loan
        fields = [
            'id', 'borrower', 'borrower_name', 'principal_amount', 'interest_rate',
            'total_payable', 'term_months', 'start_date', 'due_date', 'status',
            'total_paid', 'remaining_balance', 'payments', 'created_at'
        ]
        read_only_fields = ['id', 'total_payable', 'total_paid', 'remaining_balance', 'created_at', 'payments']

    def get_total_paid(self, obj):
        """Return total amount paid for the loan."""
        return obj.total_paid

    def get_remaining_balance(self, obj):
        """Return remaining balance for the loan."""
        return obj.remaining_balance


class LoanListSerializer(serializers.ModelSerializer):
    """Serializer for Loan model (list view)."""
    borrower_name = serializers.CharField(source='borrower.full_name', read_only=True)
    total_paid = serializers.SerializerMethodField()
    remaining_balance = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = [
            'id', 'borrower', 'borrower_name', 'principal_amount', 'interest_rate',
            'total_payable', 'term_months', 'start_date', 'due_date', 'status',
            'total_paid', 'remaining_balance', 'created_at'
        ]
        read_only_fields = ['id', 'total_payable', 'total_paid', 'remaining_balance', 'created_at']

    def get_total_paid(self, obj):
        """Return total amount paid for the loan."""
        return obj.total_paid

    def get_remaining_balance(self, obj):
        """Return remaining balance for the loan."""
        return obj.remaining_balance
