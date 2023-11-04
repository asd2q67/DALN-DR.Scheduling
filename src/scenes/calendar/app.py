from flask import Flask
import subprocess

app = Flask(__name__)

@app.route('/init-calendar', methods=['POST'])
def init_calendar():
    # Chạy file main.py khi nhận yêu cầu từ frontend
    subprocess.run(['python', 'main.py'])
    return 'Lịch đã được khởi tạo thành công!', 200

if __name__ == '__main__':
    app.run(debug=True)