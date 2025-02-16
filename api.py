from flask import Flask, request, jsonify
import subprocess
import threading
import datetime

app = Flask(__name__)

USER_FILE_PATH = 'user.txt'

def read_user_file(file_path):
    user_data = {}
    try:
        with open(file_path, 'r') as file:
            for line in file:
                key, expiration_date = line.strip().split(':')
                user_data[key] = expiration_date
    except FileNotFoundError:
        print(f"Không tìm thấy file: {file_path}")
    return user_data

def validate_api_key(key):
    user_data = read_user_file(USER_FILE_PATH)
    
    if key in user_data:
        expiration_date = user_data[key]
        current_date = datetime.datetime.now().strftime('%Y-%m-%d')
        
        if current_date <= expiration_date:
            return True, expiration_date
        else:
            print(f"key het han: {key}")
    else:
        print(f"key khong hop le: {key}")

    return False, None

def authenticate_key(func):
    def wrapper(*args, **kwargs):
        key = request.args.get("key")
        is_valid, key_info = validate_api_key(key)
        if not is_valid:
            return jsonify({"error": "Invalid API key"}), 403
        return func(*args, key_info=key_info, **kwargs)
    return wrapper

@app.route('/api', methods=['GET'])
@authenticate_key
def execute_tool(key_info):
    try:
        methods = request.args.get('methods', 'Methods')
        url = request.args.get('url', '')
        time = request.args.get('time', '')      
        port = request.args.get('port', '')
        if not (methods and url and time and port):
            return jsonify({"Status": "error", "Noti": "vui long nhap du thong tin"}), 400

        valid_methods = [
           "https"
        ]
        if methods not in valid_methods:
            return jsonify({"Status": "error", "Noti": "Methods khong ton tai hoac thieu"}), 400
        def execute_command():
            if methods == "https":
                command = ['node', 'br.js', url, time, '8', '7', 'proxy.txt']
            else:
                print(f": {methods} not found")
                return

            try:
                result = subprocess.run(command, capture_output=True, text=True, timeout=180)
                print(result.stdout)
                print(result.stderr)
            except subprocess.TimeoutExpired:
                print("end.")
            except Exception as e:
                print(f"err: {e}")

        threading.Thread(target=execute_command).start()

        result = {
            'Status': 'Success',
            'time': time,
            'Url': url,
            'Methods': methods,
            'Port': port,
            'Owner': 'moon',
            'key': key_info
        }

        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({'error': 'local err'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
