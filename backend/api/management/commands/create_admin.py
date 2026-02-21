from django.core.management.base import BaseCommand
from api.models import User

class Command(BaseCommand):
    help = 'Create admin user'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            admin = User(
                username='admin',
                email='admin@aidtrace.com',
                role='ADMIN',
                name='System Admin',
                contact='',
                is_approved=True
            )
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Admin user created successfully'))
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists'))
