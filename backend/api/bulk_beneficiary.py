import csv
import zipfile
import base64
import io
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from .models import Beneficiary, Project
from .auth import require_auth


class BulkUploadService:
    def __init__(self, project, zip_file):
        self.project = project
        self.zip_file = zip_file
        self.created_count = 0
        self.errors = []
    
    def process(self):
        with zipfile.ZipFile(self.zip_file, 'r') as zip_ref:
            self._validate_zip(zip_ref)
            rows = self._parse_csv(zip_ref)
            self._create_beneficiaries(rows, zip_ref)
        return self.created_count, self.errors
    
    def _validate_zip(self, zip_ref):
        if 'beneficiaries.csv' not in zip_ref.namelist():
            raise ValueError('beneficiaries.csv not found')
    
    def _parse_csv(self, zip_ref):
        csv_content = zip_ref.read('beneficiaries.csv').decode('utf-8')
        return list(csv.DictReader(io.StringIO(csv_content)))
    
    def _create_beneficiaries(self, rows, zip_ref):
        with transaction.atomic():
            for row in rows:
                if not self._validate_row(row):
                    continue
                self._create_beneficiary(row, zip_ref)
    
    def _validate_row(self, row):
        name = row.get('name', '').strip()
        phone = row.get('phone_number', '').strip()
        
        if not name or not phone:
            self.errors.append(f"Missing name or phone: {row}")
            return False
        return True
    
    def _create_beneficiary(self, row, zip_ref):
        try:
            name = row['name'].strip()
            phone = row['phone_number'].strip()
            photo_filename = row.get('photo_filename', '').strip()
            
            face_photo_base64 = self._read_photo(zip_ref, photo_filename)
            
            Beneficiary.objects.create(
                name=name,
                phone_number=phone,
                project=self.project,
                face_photo=face_photo_base64,
                face_verified=bool(face_photo_base64)
            )
            self.created_count += 1
        except Exception as e:
            self.errors.append(f"Error processing {row.get('name')}: {str(e)}")
    
    def _read_photo(self, zip_ref, photo_filename):
        if not photo_filename:
            return ''
        try:
            photo_data = zip_ref.read(f'photos/{photo_filename}')
            return base64.b64encode(photo_data).decode('utf-8')
        except KeyError:
            self.errors.append(f"Photo not found: {photo_filename}")
            return ''


@csrf_exempt
@require_http_methods(["POST"])
@require_auth(['FIELD_OFFICER', 'NGO'])
def bulk_upload_beneficiaries(request):
    try:
        project_id = request.POST.get('project_id')
        if not project_id:
            return JsonResponse({'error': 'project_id required'}, status=400)
        
        project = Project.objects.get(id=project_id)
        
        zip_file = request.FILES.get('file')
        if not zip_file:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        
        service = BulkUploadService(project, zip_file)
        created_count, errors = service.process()
        
        return JsonResponse({
            'message': f'Successfully created {created_count} beneficiaries',
            'created': created_count,
            'errors': errors
        })
        
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
