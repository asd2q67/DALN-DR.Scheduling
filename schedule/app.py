from flask import Flask, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/init-calendar', methods=['POST'])
def init_calendar():
    # Chạy file main.py khi nhận yêu cầu từ frontend
    subprocess.run(['python', 'D:\Workspace\Doanliennganh\DALN-DR.Scheduling\schedule\main.py'])
    return jsonify(message='Lịch đã được khởi tạo thành công!'), 200

@app.route('/calendar-checker', methods=['POST'])
def calendar_checker():
    # Chạy file main.py khi nhận yêu cầu từ frontend
    subprocess.run(['python', 'D:\Workspace\Doanliennganh\DALN-DR.Scheduling\cheker\main.py'])
    return jsonify(message='Lịch đã được kiểm tra thành công!'), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
