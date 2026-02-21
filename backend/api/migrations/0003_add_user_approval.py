from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_add_project_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
    ]
