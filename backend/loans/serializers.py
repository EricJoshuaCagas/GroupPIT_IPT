from rest_framework import serializers
from .models import Borrower, Loan, Payment, User
from decimal import Decimal
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'age', 'birthday', 'address', 'profile_image', 'is_active']
        read_only_fields = ['id', 'is_active']


class CustomUserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user registration with auto-generated username."""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    re_password = serializers.CharField(write_only=True, required=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    birthday = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 're_password', 'age', 'birthday', 'address']
        read_only_fields = ['id']

    def validate(self, data):
        """Validate passwords match."""
        if data['password'] != data['re_password']:
            raise serializers.ValidationError({"re_password": "Passwords don't match."})
        return data

    def create(self, validated_data):
        """Create user with auto-generated username."""
        validated_data.pop('re_password')
        password = validated_data.pop('password')
        
        # Generate unique username from email
        email = validated_data['email']
        username = email.split('@')[0]
        base = username
        counter = 1
        
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1
        
        # Create user
        user = User.objects.create_user(
            username=username,
            password=password,
            **validated_data
        )
        return user


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, max_length=255)
    last_name = serializers.CharField(required=True, max_length=255)
    age = serializers.IntegerField(required=False, allow_null=True)
    birthday = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'age', 'birthday', 'address', 'password', 'password2']

    def validate(self, data):
        """Validate passwords match."""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': "Passwords do not match."})
        
        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': "This email is already in use."})
        
        return data

    def create(self, validated_data):
        """Create and return user with properly hashed password."""
        validated_data.pop('password2')
        
        # Generate username from email
        username = validated_data['email'].split('@')[0]
        # Ensure unique username
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            age=validated_data.get('age'),
            birthday=validated_data.get('birthday'),
            address=validated_data.get('address', ''),
            password=validated_data['password']
        )
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom serializer for token generation with user data."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token


class BorrowerSerializer(serializers.ModelSerializer):
    """Serializer for Borrower model."""
    class Meta:
        model = Borrower
        fields = ['id', 'full_name', 'contact_number', 'email', 'address', 'age', 'birthday', 'created_at']
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


class ChatRequestSerializer(serializers.Serializer):
    """Serializer for chat request payload."""
    message = serializers.CharField(max_length=2000)


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for chat response payload."""
    response = serializers.CharField()
