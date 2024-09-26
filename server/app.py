from flask import Flask, jsonify, request
from controllers.user_controller import get_user
from controllers.curriculum_controller import get_curriculum
from controllers.stats_controller import *

from flask_cors import CORS


import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://math.riskspace.net", "http://localhost:3000"]}})

@app.route('/api/users', methods=['POST'])
def user_route():
    logging.debug('getting user')
    return get_user()

@app.route('/api/curriculum/<string:grade_level>', methods=['GET'])
def curriculum_route(grade_level):
    logging.debug('getting curriculum')
    return get_curriculum(grade_level)

@app.route('/api/stats/<int:user_id>', methods=['GET'])
def get_user_stats(user_id):
    logging.debug(f'getting stats for user id: {user_id}')
    return get_stats(user_id)

@app.route('/api/stats/<int:user_id>', methods=['POST'])
def update_user_stats(user_id):
    logging.debug(f'updating stats for user id: {user_id}')
    data = request.json
    is_correct = data.get('is_correct', False)
    return update_stats(user_id, is_correct)

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Mindful Moments API"})

if __name__ == '__main__':
    app.run("0.0.0.0", debug=True)
