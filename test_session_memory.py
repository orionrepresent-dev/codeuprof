import requests
import time

BASE_URL = "http://localhost:8000/codeuprof/api/v1"

def test_session_memory():
    # 1. Generate hash
    print("Generating hash...")
    hash_resp = requests.post(f"{BASE_URL}/generate-hash", json={
        "name": "Turing Test",
        "dob": "1950-05-15"
    })
    
    if hash_resp.status_code != 200:
        print("Failed to generate hash.", hash_resp.text)
        return
        
    hash_data = hash_resp.json()
    print("Hash Natal Arcana:", hash_data.get("layer_2_natal_arcana"))

    # 2. Deep Analysis
    print("\nRunning Deep Analysis...")
    thread_id = hash_data.get("symbolic_hash", "test_thread")
    deep_resp = requests.post(f"{BASE_URL}/deep-analysis", json={
        "hash_data": hash_data,
        "thread_id": thread_id
    })
    
    if deep_resp.status_code != 200:
        print("Failed on deep analysis.", deep_resp.text)
        return
        
    maestro_json = deep_resp.json()
    print("Deep Analysis Archetype:", maestro_json.get("archetype"))
    
    time.sleep(1)

    # 3. Chat Followup
    print("\nStarting Follow-up Chat...")
    question = "Lembre-se da análise que acabou de fazer. Qual é o meu arcano natal e como ele se relaciona com a minha sombra?"
    print(f"User: {question}")
    chat_resp = requests.post(f"{BASE_URL}/chat-followup", json={
        "thread_id": thread_id,
        "message": question
    })
    
    if chat_resp.status_code == 200:
        print(f"Maestro: {chat_resp.json().get('response')}")
    else:
        print(f"Error: {chat_resp.text}")

if __name__ == "__main__":
    test_session_memory()
