from django.test import TestCase
from django.core.exceptions import ValidationError
from decimal import Decimal
from datetime import date, timedelta
from loans.models import Borrower, Loan, Payment


class BorrowerModelTest(TestCase):
    def setUp(self):
        self.borrower = Borrower.objects.create(
            full_name="John Doe",
            contact_number="555-1234",
            email="john@example.com",
            address="123 Main St"
        )

    def test_borrower_creation(self):
        self.assertEqual(self.borrower.full_name, "John Doe")
        self.assertEqual(self.borrower.email, "john@example.com")

    def test_borrower_str(self):
        self.assertEqual(str(self.borrower), "John Doe")


class LoanModelTest(TestCase):
    def setUp(self):
        self.borrower = Borrower.objects.create(
            full_name="Jane Doe",
            contact_number="555-5678",
            email="jane@example.com",
            address="456 Oak St"
        )

    def test_loan_creation(self):
        start_date = date.today()
        due_date = start_date + timedelta(days=365)
        
        loan = Loan.objects.create(
            borrower=self.borrower,
            principal_amount=Decimal("10000.00"),
            interest_rate=Decimal("5.00"),
            term_months=12,
            start_date=start_date,
            due_date=due_date
        )

        self.assertEqual(loan.principal_amount, Decimal("10000.00"))
        self.assertEqual(loan.total_payable, Decimal("10500.00"))
        self.assertEqual(loan.status, "active")

    def test_loan_total_paid(self):
        start_date = date.today()
        due_date = start_date + timedelta(days=365)
        
        loan = Loan.objects.create(
            borrower=self.borrower,
            principal_amount=Decimal("10000.00"),
            interest_rate=Decimal("5.00"),
            term_months=12,
            start_date=start_date,
            due_date=due_date
        )

        Payment.objects.create(
            loan=loan,
            amount=Decimal("5000.00"),
            payment_date=date.today(),
            payment_method="cash"
        )

        self.assertEqual(loan.total_paid, Decimal("5000.00"))
        self.assertEqual(loan.remaining_balance, Decimal("5500.00"))

    def test_payment_overpayment_prevention(self):
        start_date = date.today()
        due_date = start_date + timedelta(days=365)
        
        loan = Loan.objects.create(
            borrower=self.borrower,
            principal_amount=Decimal("10000.00"),
            interest_rate=Decimal("5.00"),
            term_months=12,
            start_date=start_date,
            due_date=due_date
        )

        payment = Payment(
            loan=loan,
            amount=Decimal("11000.00"),  # More than total_payable
            payment_date=date.today(),
            payment_method="cash"
        )

        with self.assertRaises(ValidationError):
            payment.full_clean()

    def test_loan_completion(self):
        start_date = date.today()
        due_date = start_date + timedelta(days=365)
        
        loan = Loan.objects.create(
            borrower=self.borrower,
            principal_amount=Decimal("10000.00"),
            interest_rate=Decimal("5.00"),
            term_months=12,
            start_date=start_date,
            due_date=due_date
        )

        # Pay the full amount
        Payment.objects.create(
            loan=loan,
            amount=Decimal("10500.00"),
            payment_date=date.today(),
            payment_method="cash"
        )

        # Refresh from DB and check status
        loan.refresh_from_db()
        self.assertEqual(loan.status, "completed")
