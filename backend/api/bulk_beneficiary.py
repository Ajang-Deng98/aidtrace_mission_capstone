import csv
import zipfile
import base64
import io
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Beneficiary, Project
from .auth import require_auth

@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['FIELD_OFFICER', 'NGO'])
def bulk_upload_beneficiaries(request):
    """
    Upload beneficiaries via ZIP file containing:
    - beneficiaries.csv (columns: name, phone_number, photo_filename)
    - photos/ folder with images
    """
    try:
        project_id = request.POST.get('project_id')
        project = Project.objects.get(id=project_id)
        
        zip_file = request.FILES.get('file')
        if not zip_file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        
        created_count = 0
        errors = []
        
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            # Read CSV
            csv_content = zip_ref.read('beneficiaries.csv').decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(csv_content))
            
            for row in csv_reader:
                try:
                    name = row.get('name', '').strip()
                    phone = row.get('phone_number', '').strip()
                    photo_filename = row.get('photo_filename', '').strip()
                    
                    if not name or not phone:
                        errors.append(f"Missing name or phone for row: {row}")
                        continue
                    
                    # Read photo if provided
                    face_photo_base64 = ''
                    if photo_filename:
                        try:
                            photo_path = f'photos/{photo_filename}'
                            photo_data = zip_ref.read(photo_path)
                            face_photo_base64 = base64.b64encode(photo_data).decode('utf-8')
                        except KeyError:
                            errors.append(f"Photo not found: {photo_filename}")
                    
                    Beneficiary.objects.create(
                        name=name,
                        phone_number=phone,
                        project=project,
                        face_photo=face_photo_base64,
                        face_verified=bool(face_photo_base64)
                    )
                    created_count += 1
                    
                except Exception as e:
                    errors.append(f"Error processing {name}: {str(e)}")
        
        return JsonResponse({
            'message': f'Successfully created {created_count} beneficiaries',
            'created': created_count,
            'errors': errors
        })
        
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
