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
                        addition, subtraction, multiplication, division, geometry, algebra, algebra2, precalculus, calculus
                    FROM curriculum WHERE user_grade = %s""", (grade_level,))
        curriculum_tuple = cur.fetchone()

        curriculum = {
            "addition": curriculum_tuple[0],
            "subtraction": curriculum_tuple[1],
            "multiplication": curriculum_tuple[2],
            "division": curriculum_tuple[3],
            "geometry": curriculum_tuple[4],
            "algebra": curriculum_tuple[5],
            "algebra2": curriculum_tuple[6],
            "precalculus": curriculum_tuple[7],
            "calculus": curriculum_tuple[8]
        }

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