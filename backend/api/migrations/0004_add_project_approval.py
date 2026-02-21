from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_add_user_approval'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
