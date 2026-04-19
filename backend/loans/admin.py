from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Borrower, Loan, Payment, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'is_staff', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    list_filter = ['is_staff', 'is_active', 'date_joined']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('age', 'birthday', 'address')}),
    )


@admin.register(Borrower)
class BorrowerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'contact_number', 'created_at']
    search_fields = ['full_name', 'email', 'contact_number']
    list_filter = ['created_at']


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ['id', 'borrower', 'principal_amount', 'status', 'due_date', 'created_at']
    search_fields = ['borrower__full_name', 'id']
    list_filter = ['status', 'created_at', 'due_date']
    readonly_fields = ['total_payable', 'created_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'loan', 'amount', 'payment_date', 'payment_method', 'created_at']
    search_fields = ['loan__id', 'loan__borrower__full_name']
    list_filter = ['payment_method', 'payment_date', 'created_at']
    readonly_fields = ['created_at']
