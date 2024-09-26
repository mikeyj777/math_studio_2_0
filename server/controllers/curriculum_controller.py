from flask import request, jsonify
from config.db import get_db_connection

import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


def get_curriculum(grade_level):
    grade_level = grade_level.strip()
    grade_level = grade_level.lower()
    
    if not isinstance(grade_level, str) or not grade_level.strip():
        return jsonify({'error': f'grade level {grade_level} has badly formed data'}), 404
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""SELECT 
                        *
                    FROM curriculum WHERE user_grade = %s""", (grade_level,))
        curriculum = cur.fetchone()

        logging.debug(f"curriculum: {curriculum}")

        if not curriculum:
            return jsonify({'error':f'curriculum not found for grade level {grade_level}'}), 404

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({
            "curriculum": curriculum
        }), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error"}), 500