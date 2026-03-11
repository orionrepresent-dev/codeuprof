from fastapi.testclient import TestClient
from main import app
import json
import logging

logging.basicConfig(level=logging.INFO)

client = TestClient(app)

def test_endpoints():
    # 1. Generate hash
    print("Generating hash...")
    response_hash = client.post("/api/v1/generate-hash", json={"name": "Hermes Trismegistus", "dob": "1990-01-01"})
    print("Hash Response Status:", response_hash.status_code)
    try:
        hash_data = response_hash.json()
        print("Hash Data:", json.dumps(hash_data, indent=2, ensure_ascii=False))
    except Exception as e:
        print("Error parsing hash response:", e)
        return

    if response_hash.status_code != 200:
        return

    # 2. Deep analysis
    print("\nRunning Deep Analysis (Agentic Orchestration)...")
    try:
        response_analysis = client.post("/api/v1/deep-analysis", json={"hash_data": hash_data})
        print("Analysis Response Status:", response_analysis.status_code)
        print("Analysis Output:", json.dumps(response_analysis.json(), indent=2, ensure_ascii=False))
    except Exception as e:
        print("Error calling deep analysis:", e)
        
if __name__ == "__main__":
    test_endpoints()
