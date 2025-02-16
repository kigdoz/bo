import subprocess
import time

def run_proxy():
    try:
        subprocess.run(["node", "px.js"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running proxy.py: {e}")

if __name__ == "__main__":
    while True:
        run_proxy()
        print("Waiting for 10 minutes...")
        time.sleep(600)  
