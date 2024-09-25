from flask import Flask, request, jsonify
from flask_cors import CORS
from psycopg2 import sql
from config.db import get_db_connection

app = Flask(__name__)
CORS(app)

@app.route('/api/user/<username>', methods=['GET'])
def get_user(username):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT username, grade_level, special_education FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user:
        return jsonify({
            'username': user[0],
            'grade_level': user[1],
            'special_education': user[2]
        })
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/curriculum/<grade>', methods=['GET'])
def get_curriculum(grade):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM curriculum WHERE user_grade = %s", (grade,))
    curriculum = cur.fetchone()
    cur.close()
    conn.close()

    if curriculum:
        return jsonify({
            'addition': curriculum[2],
            'subtraction': curriculum[3],
            'multiplication': curriculum[4],
            'division': curriculum[5],
            'geometry': curriculum[6],
            'algebra': curriculum[7],
            'algebra2': curriculum[8],
            'precalculus': curriculum[9],
            'calculus': curriculum[10]
        })
    return jsonify({'error': 'Curriculum not found'}), 404

@app.route('/api/stats/<username>', methods=['GET'])
def get_stats(username):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT current_streak, total_problems, total_correct, longest_streak
        FROM user_stats
        JOIN users ON user_stats.user_id = users.id
        WHERE users.username = %s
    """, (username,))
    stats = cur.fetchone()
    cur.close()
    conn.close()

    if stats:
        return jsonify({
            'currentStreak': stats[0],
            'allTimeTotal': stats[1],
            'allTimeCorrect': stats[2],
            'longestStreak': stats[3]
        })
    return jsonify({'error': 'Stats not found'}), 404

@app.route('/api/stats/<username>', methods=['POST'])
def update_stats(username):
    data = request.json
    is_correct = data.get('is_correct', False)

    conn = get_db_connection()
    cur = conn.cursor()

    # First, get the user's ID
    cur.execute("SELECT id FROM users WHERE username = %s", (username,))
    user_id = cur.fetchone()

    if not user_id:
        cur.close()
        conn.close()
        return jsonify({'error': 'User not found'}), 404

    user_id = user_id[0]

    cur.execute("""
        SELECT current_streak, total_problems, total_correct, longest_streak
        FROM user_stats WHERE user_id = %s
    """, (user_id,))
    current_stats = cur.fetchone()

    if not current_stats:
        # If no stats exist, create a new record
        cur.execute("""
            INSERT INTO user_stats (user_id, current_streak, total_problems, total_correct, longest_streak)
            VALUES (%s, %s, 1, %s, %s)
        """, (user_id, 1 if is_correct else 0, 1 if is_correct else 0, 1 if is_correct else 0))
    else:
        # Update existing stats
        current_streak, total_problems, total_correct, longest_streak = current_stats
        new_streak = current_streak + 1 if is_correct else 0
        new_longest_streak = max(longest_streak, new_streak)

        cur.execute("""
            UPDATE user_stats
            SET current_streak = %s, total_problems = %s, total_correct = %s, longest_streak = %s
            WHERE user_id = %s
        """, (new_streak, total_problems + 1, total_correct + (1 if is_correct else 0), new_longest_streak, user_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Stats updated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)