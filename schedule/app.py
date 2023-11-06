from flask import Flask
import subprocess
from flask_cors import CORS

app = Flask(__name__)

@app.route('/init-calendar', methods=['POST'])
def init_calendar():
    # Chạy file main.py khi nhận yêu cầu từ frontend
    subprocess.run(['python', 'D:\Workspace\Doanliennganh\DALN-DR.Scheduling\schedule\main.py'])
    return 'Lịch đã được khởi tạo thành công!', 200

# Thiết lập CORS cho ứng dụng Flask
CORS(app, resources={r"/init-calendar": {"origins": "http://localhost:3000"}})

CORS(app)

if __name__ == '__main__':
    app.run(debug=True, port=5000)