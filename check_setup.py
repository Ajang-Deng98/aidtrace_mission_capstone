#!/usr/bin/env python3
import subprocess
import os

def check_ganache():
    try:
        result = subprocess.run(['curl', '-s', 'http://127.0.0.1:7545'], capture_output=True)
        return result.returncode == 0
    except:
        return False

def check_contract_deployed():
    return os.path.exists('blockchain/build/contracts/AidTrace.json')

def check_env_configured():
    from dotenv import load_dotenv
    load_dotenv()
    return os.getenv('LOCAL_CONTRACT_ADDRESS') is not None

print("🔍 Checking blockchain setup...")
print(f"Ganache running: {'✅' if check_ganache() else '❌'}")
print(f"Contract compiled: {'✅' if check_contract_deployed() else '❌'}")
print(f"Environment configured: {'✅' if check_env_configured() else '❌'}")

if all([check_ganache(), check_contract_deployed(), check_env_configured()]):
    print("🎉 Ready for blockchain connection!")
else:
    print("⚠️  Complete missing steps first")