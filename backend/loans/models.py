from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from decimal import Decimal


class Borrower(models.Model):
    """Model representing a borrower in the system."""
    full_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'borrowers'

    def __str__(self):
        return self.full_name


class Loan(models.Model):
    """Model representing a loan."""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
    ]

    borrower = models.ForeignKey(Borrower, on_delete=models.CASCADE, related_name='loans')
    principal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)  # in percentage
    total_payable = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    term_months = models.IntegerField()
    start_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'loans'

    def __str__(self):
        return f"Loan for {self.borrower.full_name} - ${self.principal_amount}"

    def save(self, *args, **kwargs):
        """Calculate total_payable before saving."""
        if self.principal_amount <= 0:
            raise ValidationError("Principal amount must be greater than 0")
        if self.interest_rate < 0:
            raise ValidationError("Interest rate cannot be negative")
        if self.term_months <= 0:
            raise ValidationError("Term must be greater than 0")

        # Calculate interest
        interest_amount = self.principal_amount * (self.interest_rate / Decimal(100))
        self.total_payable = self.principal_amount + interest_amount
        super().save(*args, **kwargs)

    @property
    def total_paid(self):
        """Calculate total amount paid for this loan."""
        return self.payments.aggregate(
            total=models.Sum('amount')
        )['total'] or Decimal('0.00')

    @property
    def remaining_balance(self):
        """Calculate remaining balance for this loan."""
        return max(self.total_payable - self.total_paid, Decimal('0.00'))

    def update_status(self):
        """Auto-update loan status based on remaining balance."""
        if self.remaining_balance == 0:
            self.status = 'completed'
            self.save(update_fields=['status'])
        elif timezone.now().date() > self.due_date and self.status == 'active':
            self.status = 'overdue'
            self.save(update_fields=['status'])


class Payment(models.Model):
    """Model representing a payment for a loan."""
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('check', 'Check'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
    ]

    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-payment_date']
        db_table = 'payments'

    def __str__(self):
        return f"Payment of ${self.amount} for Loan ID {self.loan.id}"

    def clean(self):
        """Validate payment before saving."""
        if self.amount <= 0:
            raise ValidationError("Payment amount must be greater than 0")

        # Check if loan is already completed
        if self.loan.status == 'completed':
            raise ValidationError("Cannot add payment to a completed loan")

        # Check for overpayment
        remaining = self.loan.remaining_balance
        if self.amount > remaining:
            raise ValidationError(
                f"Payment amount (${self.amount}) exceeds remaining balance (${remaining})"
            )

    def save(self, *args, **kwargs):
        """Validate and save payment, then update loan status."""
        self.full_clean()
        super().save(*args, **kwargs)
        # Update loan status after payment
        self.loan.update_status()
