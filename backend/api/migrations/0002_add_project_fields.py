from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='budget_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name='project',
            name='duration_months',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='project',
            name='target_beneficiaries',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='project',
            name='start_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='project',
            name='end_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='project',
            name='category',
            field=models.CharField(default='General Aid', max_length=100),
        ),
    ]
