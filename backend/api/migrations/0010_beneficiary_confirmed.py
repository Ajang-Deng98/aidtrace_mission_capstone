from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_merge_20260221_1747'),
    ]

    operations = [
        migrations.AddField(
            model_name='beneficiary',
            name='confirmed',
            field=models.BooleanField(default=False),
        ),
    ]
