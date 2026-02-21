import random
from datetime import datetime, timedelta
from twilio.rest import Client
from .models import OTP
from django.conf import settings

class OTPService:
    @staticmethod
    def generate_otp(phone_number):
        code = str(random.randint(100000, 999999))
        expires_at = datetime.now() + timedelta(minutes=10)
        
        otp = OTP.objects.create(
            phone_number=phone_number,
            code=code,
            expires_at=expires_at
        )
        
        # Send SMS via Twilio
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Hey here is your confirmation pin: {code}",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        
        return code
    
    @staticmethod
    def verify_otp(phone_number, code):
        try:
            otp = OTP.objects.filter(
                phone_number=phone_number,
                code=code,
                verified=False,
                expires_at__gt=datetime.now()
            ).latest('created_at')
            
            otp.verified = True
            otp.save()
            return True
        except OTP.DoesNotExist:
            return False

otp_service = OTPService()
