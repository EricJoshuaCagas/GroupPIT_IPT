from djoser.email import ActivationEmail as DjoserActivationEmail
from django.contrib.auth import get_user_model


User = get_user_model()


class CustomActivationEmail(DjoserActivationEmail):
    """Custom activation email with styled HTML template."""
    
    template_name = 'activation_email.html'
    
    def get_context_data(self):
        context = super().get_context_data()
        user = self.user
        
        # Add custom context
        context.update({
            'user_name': user.first_name or user.email,
            'user_email': user.email,
            'activation_link': f"{context['domain']}/activate/{context['uid']}/{context['token']}/",
        })
        
        return context
