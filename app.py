from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# ข้อมูลกระดาน
boardSize = 8
board = [[None]*boardSize for _ in range(boardSize)]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/get_board', methods=['GET'])
def get_board():
    return jsonify(board)

@app.route('/api/update_board', methods=['POST'])
def update_board():
    data = request.json
    # อัปเดตข้อมูลกระดานตามข้อมูลที่ส่งมา
    board[data['x']][data['y']] = data['piece']
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
