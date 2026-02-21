# Generated migration for adding face_photo field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_project_project_hash_user_blockchain_tx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='beneficiary',
            name='face_photo',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='beneficiary',
            name='face_verified',
            field=models.BooleanField(default=False),
        ),
    ]
