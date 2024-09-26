from flask import request, jsonify
from config.db import get_db_connection

import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


def get_user():
    data = request.get_json()
    name = data['username']
    if not isinstance(name, str) or not name.strip():
        return jsonify({'error': 'name must be a string'}), 400
    name = name.strip()
    name = name.lower()
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""SELECT 
                        id,
                        grade_level,
                        special_education
                    FROM users WHERE username = %s""", (name,))
        existing_user_info = cur.fetchone()

        logging.debug(f"existing_user_info: {existing_user_info}")

        if not existing_user_info:
            return jsonify({'error':'we dont recognize this user'}), 404

        user_id = existing_user_info[0]
        grade_level = existing_user_info[1]
        special_education = existing_user_info[2]

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({
            "name": name,
            "userId": user_id,
            "grade_level": grade_level,
            "special_education": special_education,
        }), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error"}), 500