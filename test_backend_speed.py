import requests
import time

print("Testing Backend Connection...")
print("=" * 60)

try:
    start = time.time()
    response = requests.get('http://localhost:8000/api/public-reports/list/', timeout=5)
    elapsed = time.time() - start
    
    print(f"✓ Backend is running")
    print(f"✓ Response time: {elapsed:.2f} seconds")
    print(f"✓ Status code: {response.status_code}")
    
    if elapsed > 2:
        print("\n⚠ WARNING: Response is slow (>2 seconds)")
        print("  Possible causes:")
        print("  - Database connection issues")
        print("  - Blockchain service timeout")
        print("  - Heavy queries without optimization")
    
except requests.exceptions.ConnectionError:
    print("✗ Backend is NOT running")
    print("\nTo start backend:")
    print("  cd backend")
    print("  python manage.py runserver")
    
except requests.exceptions.Timeout:
    print("✗ Backend is running but VERY SLOW (timeout)")
    print("\nCheck:")
    print("  - Database connection")
    print("  - Blockchain service")
    
except Exception as e:
    print(f"✗ Error: {e}")

print("=" * 60)
