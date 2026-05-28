from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
from .models import Borrower, Loan, Payment, User, KnowledgeBase, ChatMessage
from .serializers import (
    BorrowerSerializer,
    CustomUserCreateSerializer,
    LoanDetailSerializer,
    LoanListSerializer,
    PaymentSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    ChatRequestSerializer,
    ChatResponseSerializer,
)


# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user and send activation email if enabled."""
    print(f"\n[REGISTER] POST request received")
    print(f"[REGISTER] SEND_ACTIVATION_EMAIL: {settings.DJOSER.get('SEND_ACTIVATION_EMAIL')}")
    
    serializer = CustomUserCreateSerializer(data=request.data)
    if serializer.is_valid():
        activation_enabled = settings.DJOSER.get('SEND_ACTIVATION_EMAIL')
        user = serializer.save(is_active=not activation_enabled)
        print(f"[REGISTER] User created: {user.email} (is_active: {user.is_active})")
        
        # Send activation email if enabled
        if activation_enabled:
            print(f"[REGISTER] Attempting to send activation email...")
            try:
                # Generate activation token
                token = default_token_generator.make_token(user)
                uid = user.pk
                
                # Build activation link - point to frontend activation page
                # The frontend will then call the API endpoint
                activation_link = f"http://localhost:3000/activate/{uid}/{token}/"
                print(f"[REGISTER] Activation link: {activation_link}")
                
                # Create HTML email template with LoanTracker theme
                html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 20px;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }}
        .header::before {{
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
        }}
        .header-content {{
            position: relative;
            z-index: 1;
        }}
        .logo {{
            font-size: 32px;
            margin-bottom: 10px;
            display: inline-block;
        }}
        .brand {{
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }}
        .content {{
            padding: 40px 30px;
        }}
        .greeting {{
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
        }}
        .message {{
            color: #475569;
            line-height: 1.7;
            font-size: 15px;
            margin-bottom: 30px;
        }}
        .highlight {{
            color: #0284c7;
            font-weight: 600;
        }}
        .cta-container {{
            text-align: center;
            margin: 40px 0;
        }}
        .cta-button {{
            display: inline-block;
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 25px rgba(2, 132, 199, 0.3);
            transition: transform 0.3s, box-shadow 0.3s;
            border: none;
            cursor: pointer;
        }}
        .cta-button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(2, 132, 199, 0.4);
        }}
        .link-text {{
            color: #64748b;
            font-size: 14px;
            margin-top: 15px;
            word-break: break-all;
        }}
        .link {{
            color: #0284c7;
            text-decoration: none;
            word-break: break-all;
        }}
        .divider {{
            height: 1px;
            background: #e2e8f0;
            margin: 30px 0;
        }}
        .footer {{
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }}
        .footer-text {{
            color: #64748b;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 10px;
        }}
        .footer-brand {{
            color: #0284c7;
            font-weight: 600;
            margin-top: 15px;
        }}
        .security-note {{
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #0369a1;
        }}
        .icon {{
            font-size: 48px;
            margin-bottom: 15px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="icon">📊</div>
                <div class="brand">LoanTracker</div>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Welcome, {user.first_name or user.email}! 👋
            </div>

            <div class="message">
                Thank you for joining <span class="highlight">LoanTracker</span>! We're excited to have you on board. 
                To get started and unlock all features, please verify your email address by clicking the button below.
            </div>

            <!-- CTA Button -->
            <div class="cta-container">
                <a href="{activation_link}" class="cta-button">Activate Your Account</a>
                <div class="link-text">
                    Or copy and paste this link:<br>
                    <a href="{activation_link}" class="link">{activation_link}</a>
                </div>
            </div>

            <!-- Security Note -->
            <div class="security-note">
                🔒 <strong>Security Notice:</strong> This link will expire in 24 hours for your account's safety. 
                If you didn't create this account, please ignore this email.
            </div>

            <div class="message">
                Once activated, you'll be able to:
                <ul style="margin: 15px 0 0 20px; color: #475569;">
                    <li style="margin: 8px 0;">Manage loans and track payments</li>
                    <li style="margin: 8px 0;">Monitor borrower information</li>
                    <li style="margin: 8px 0;">Generate detailed financial reports</li>
                    <li style="margin: 8px 0;">Access your dashboard anytime</li>
                </ul>
            </div>

            <div class="divider"></div>

            <div class="message">
                Questions? Our support team is here to help. Just reply to this email!
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                © 2026 LoanTracker. All rights reserved.<br>
                Secure Loan and Installment Tracking System
            </div>
            <div class="footer-brand">
                LoanTracker
            </div>
        </div>
    </div>
</body>
</html>
                """
                
                # Send email with HTML template
                subject = 'Activate Your LoanTracker Account'
                plain_message = f"""
Hello {user.first_name or user.email},

Thank you for registering with LoanTracker!

Please click the link below to activate your account:
{activation_link}

If you did not create this account, you can safely ignore this email.

Best regards,
LoanTracker Team
                """
                
                result = send_mail(
                    subject=subject,
                    message=plain_message,
                    html_message=html_template,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
                print(f"[REGISTER] ✓ Activation email sent to {user.email}! Result: {result}")
            except Exception as e:
                print(f"[REGISTER] ✗ Error sending activation email: {type(e).__name__}: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"[REGISTER] Email activation disabled")
        
        return Response({
            'message': 'User registered successfully. Please check your email to activate your account.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    print(f"[REGISTER] Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def activate_view(request, uid, token):
    """Activate a user account via email link."""
    print(f"\n[ACTIVATE] Request received for uid: {uid}, token: {token[:20]}...")
    
    try:
        # Get the user
        user = User.objects.get(pk=uid)
        print(f"[ACTIVATE] User found: {user.email}")
        
        # Verify the token FIRST before checking active status
        if default_token_generator.check_token(user, token):
            print(f"[ACTIVATE] Token verified successfully")
            
            # Check if already active
            if user.is_active:
                print(f"[ACTIVATE] User already active")
                return Response({
                    'message': 'Account is already active. You can log in now.',
                    'success': True
                }, status=status.HTTP_200_OK)
            
            # Activate the user
            user.is_active = True
            user.save()
            print(f"[ACTIVATE] ✓ User {user.email} activated successfully")
            
            return Response({
                'message': 'Account activated successfully! You can now log in.',
                'success': True,
            }, status=status.HTTP_200_OK)
        else:
            print(f"[ACTIVATE] ✗ Invalid or expired token")
            return Response({
                'message': 'Invalid or expired activation link. Please register again.',
                'success': False,
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except User.DoesNotExist:
        print(f"[ACTIVATE] ✗ User not found with uid: {uid}")
        return Response({
            'message': 'Invalid activation link. User not found.',
            'success': False,
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"[ACTIVATE] ✗ Error: {type(e).__name__}: {e}")
        return Response({
            'message': 'An error occurred during activation.',
            'success': False,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


OLLAMA_URL = 'http://localhost:11434/api/generate'
OLLAMA_MODEL = 'qwen2.5:0.5b'
MAX_CONTEXT_CHARS = 8000


def _extract_pdf_text(pdf_file) -> str:
    if not pdf_file:
        return ''
    try:
        pdf_file.open('rb')
        reader = PdfReader(pdf_file)
        pages_text = []
        for page in reader.pages:
            text = page.extract_text() or ''
            if text.strip():
                pages_text.append(text)
        return '\n'.join(pages_text).strip()
    except Exception:
        return ''
    finally:
        try:
            pdf_file.close()
        except Exception:
            pass


def _fetch_url_text(url: str) -> str:
    if not url:
        return ''
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        for tag in soup(['script', 'style', 'noscript']):
            tag.extract()
        text = soup.get_text(separator=' ', strip=True)
        return text
    except Exception:
        return ''


def _build_knowledge_context() -> str:
    entries = KnowledgeBase.objects.all()
    parts = []
    for entry in entries:
        if entry.title:
            parts.append(f"Title: {entry.title}")
        if entry.content_text:
            parts.append(entry.content_text)
        if entry.source_url:
            url_text = _fetch_url_text(entry.source_url)
            if url_text:
                parts.append(f"Source ({entry.source_url}): {url_text}")
        if entry.pdf_file:
            pdf_text = _extract_pdf_text(entry.pdf_file)
            if pdf_text:
                parts.append(pdf_text)

    context = '\n\n'.join(parts).strip()
    if not context:
        return 'No additional knowledge base content available.'
    return context[:MAX_CONTEXT_CHARS]


@api_view(['POST'])
@permission_classes([AllowAny])
def chat_view(request):
    """Chatbot endpoint using knowledge base context and Ollama."""
    serializer = ChatRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    message = serializer.validated_data['message'].strip()
    if not message:
        return Response({'detail': 'Message cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user if request.user.is_authenticated else None
    ChatMessage.objects.create(user=user, role='user', message=message)

    knowledge_context = _build_knowledge_context()
    prompt = (
        "You are LoanTracker AI Assistant.\n\n"
        f"Knowledge:\n{knowledge_context}\n\n"
        f"User:\n{message}\n\n"
        "Assistant:"
    )

    try:
        ollama_response = requests.post(
            OLLAMA_URL,
            json={
                'model': OLLAMA_MODEL,
                'prompt': prompt,
                'stream': False,
            },
            timeout=60,
        )
        ollama_response.raise_for_status()
        data = ollama_response.json()
        ai_text = (data.get('response') or '').strip()
    except requests.RequestException:
        return Response({'detail': 'AI service is unavailable.'}, status=status.HTTP_502_BAD_GATEWAY)

    if not ai_text:
        ai_text = "I'm sorry, I couldn't generate a response right now."

    ChatMessage.objects.create(user=user, role='assistant', message=ai_text)
    return Response(ChatResponseSerializer({'response': ai_text}).data, status=status.HTTP_200_OK)


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
