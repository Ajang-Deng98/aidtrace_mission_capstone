from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_add_face_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='distribution',
            name='face_scan_photo',
            field=models.TextField(blank=True),
        ),
    ]
