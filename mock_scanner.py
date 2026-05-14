import requests
import time

# Configuration
SERVER_URL = "http://localhost:5000/api/hardware/verify"
CURRENT_BUS_ID = "REPLACE_WITH_THE_REAL_BUS_ID_FROM_DB" 

def simulate_fingerprint_scan():
    print(f"\n--- Simulating Bus Access Control System (Bus: {CURRENT_BUS_ID}) ---")
    
    while True:
        # Simulate waiting for a finger
        choice = input("\n[Hardware] Press 'Enter' to simulate scanning a finger (or 'q' to quit): ")
        if choice.lower() == 'q':
            break
            
        # In a real scenario, the fingerprint sensor would give us an ID
        fingerprint_id = input("Enter Simulated Fingerprint ID (e.g., 'fp_123'): ")
        
        payload = {
            "fingerprintId": fingerprint_id,
            "busId": CURRENT_BUS_ID
        }
        
        try:
            print(f"Sending data to server: {payload}")
            response = requests.post(SERVER_URL, json=payload)
            data = response.json()
            
            if response.status_code == 200 and data.get("status") == "allowed":
                print("\n✅ ACCESS GRANTED")
                print(f"Welcome, {data.get('studentName')}!")
                print(f"Seat Number: {data.get('seat')}")
                # Hardware Action: GPIO.output(RELAY_PIN, High) -> Open Door
            else:
                print("\n❌ ACCESS DENIED")
                print(f"Reason: {data.get('message')}")
                # Hardware Action: Beep Buzzer
                
        except Exception as e:
            print(f"Error connecting to server: {e}")

if __name__ == "__main__":
    if CURRENT_BUS_ID == "REPLACE_WITH_THE_REAL_BUS_ID_FROM_DB":
        print("⚠ ERROR: You must update CURRENT_BUS_ID in the script with a valid Bus ID from your database first!")
    else:
        simulate_fingerprint_scan()
