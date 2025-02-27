#!/usr/local/bin/python3

import sys
import requests
import json

# Base URL of the Falcon server
BASE_URL = "http://127.0.0.1:8000/data"

# Function to PUT (add) data
def put_data(data):
    try:
        response = requests.post(BASE_URL, json=data)
        response.raise_for_status()
        print(f"Response: {response.json()}")
    except requests.exceptions.JSONDecodeError:
        print(f"Non-JSON response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        
        
# Function to GET data
def get_data():
    response = requests.get(BASE_URL)
    print(f"Response: {json.dumps(response.json(), indent=2)}")

# Main logic
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: scriptname put/get [<data for put>]")
        sys.exit(1)

    command = sys.argv[1].lower()
    if command == "put":
        if len(sys.argv) < 3:
            print("Usage for put: scriptname put '<json_data>'")
            sys.exit(1)
        data = json.loads(sys.argv[2])
        put_data(data)
    elif command == "get":
        get_data()
    else:
        print("Invalid command. Use 'put' or 'get'.")

