from flask import jsonify
from config.db import get_db_connection

import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def get_stats(user_id):
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                current_streak,
                longest_streak,
                total_problems,
                total_correct
            FROM user_stats 
            WHERE user_id = %s
        """, (user_id,))
        stats = cur.fetchone()

        logging.debug(f"Stats for user {user_id}: {stats}")

        if not stats:
            # If no stats exist, return default values
            return jsonify({
                "currentStreak": 0,
                "longestStreak": 0,
                "allTimeTotal": 0,
                "allTimeCorrect": 0
            }), 200

        current_streak, longest_streak, total_problems, total_correct = stats

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "currentStreak": current_streak,
            "longestStreak": longest_streak,
            "allTimeTotal": total_problems,
            "allTimeCorrect": total_correct
        }), 200
    except Exception as e:
        logging.error(f"Error fetching stats for user {user_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

def update_stats(user_id, is_correct):
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # First, get current stats
        cur.execute("""
            SELECT 
                current_streak,
                longest_streak,
                total_problems,
                total_correct
            FROM user_stats 
            WHERE user_id = %s
        """, (user_id,))
        current_stats = cur.fetchone()

        if not current_stats:
            # If no stats exist, create a new record
            if is_correct:
                cur.execute("""
                    INSERT INTO user_stats (user_id, current_streak, longest_streak, total_problems, total_correct)
                    VALUES (%s, 1, 1, 1, 1)
                """, (user_id,))
            else:
                cur.execute("""
                    INSERT INTO user_stats (user_id, current_streak, longest_streak, total_problems, total_correct)
                    VALUES (%s, 0, 0, 1, 0)
                """, (user_id,))
        else:
            current_streak, longest_streak, total_problems, total_correct = current_stats
            new_streak = current_streak + 1 if is_correct else 0
            new_longest_streak = max(longest_streak, new_streak)
            new_total_correct = total_correct + (1 if is_correct else 0)

            cur.execute("""
                UPDATE user_stats
                SET current_streak = %s, 
                    longest_streak = %s, 
                    total_problems = total_problems + 1,
                    total_correct = %s
                WHERE user_id = %s
            """, (new_streak, new_longest_streak, new_total_correct, user_id))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Stats updated successfully"}), 200
    except Exception as e:
        logging.error(f"Error updating stats for user {user_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500