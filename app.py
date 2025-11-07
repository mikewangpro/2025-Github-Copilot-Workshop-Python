
from flask import Flask, render_template, jsonify, request


app = Flask(__name__)

# In-memory storage for demo
progress_data = {
    'completed_sessions': 4,
    'total_focus_minutes': 100
}


@app.route('/')
def index():
    return render_template('index.html')


# API endpoint: Get today's progress
@app.route('/get_progress', methods=['GET'])
def get_progress():
    return jsonify(progress_data)

# API endpoint: Save a completed Pomodoro session
@app.route('/save_progress', methods=['POST'])
def save_progress():
    data = request.get_json()
    # Expecting: { 'work_session': bool, 'focus_minutes': int }
    if data and data.get('work_session'):
        progress_data['completed_sessions'] += 1
        progress_data['total_focus_minutes'] += data.get('focus_minutes', 25)
    return jsonify({'status': 'ok', 'progress': progress_data})

if __name__ == '__main__':
    app.run(debug=True)
