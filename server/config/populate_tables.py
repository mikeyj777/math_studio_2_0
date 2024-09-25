import os
import sys
import logging
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from config.db import get_db_connection

logging = logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

users = [
    ("emma", "kindergarten", False),
    ("ellie", "first", False),
    ("avery", "fourth", True),
    ("ezra", "sixth", False),
    ("noah", "seventh", False),
    ("cooper", "ninth", False),
]

# Curriculum data
curriculum_data = [
    {"user_grade": "k", "addition": 5, "subtraction": -1, "multiplication": -1, "division": -1, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "1", "addition": 10, "subtraction": 10, "multiplication": 3, "division": -1, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "2", "addition": 20, "subtraction": 20, "multiplication": 3, "division": -1, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "3", "addition": 50, "subtraction": 50, "multiplication": 10, "division": -1, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "4", "addition": 100, "subtraction": 50, "multiplication": 10, "division": 10, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "5", "addition": 300, "subtraction": 100, "multiplication": 30, "division": 30, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "6", "addition": 1000, "subtraction": 1000, "multiplication": 50, "division": 50, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "7", "addition": 1000, "subtraction": 1000, "multiplication": 100, "division": 100, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "8", "addition": 10000, "subtraction": 10000, "multiplication": 100, "division": 100, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1},
    {"user_grade": "9", "addition": 10000, "subtraction": 10000, "multiplication": 100, "division": 100, "geometry": -1, "algebra": 1, "algebra2": 1, "precalculus": -1, "calculus": -1},
    {"user_grade": "10", "addition": 10000, "subtraction": 10000, "multiplication": 100, "division": 100, "geometry": 1, "algebra": 1, "algebra2": 1, "precalculus": -1, "calculus": -1},
    {"user_grade": "11", "addition": 10000, "subtraction": 10000, "multiplication": 100, "division": 100, "geometry": 1, "algebra": 1, "algebra2": 1, "precalculus": 1, "calculus": -1},
    {"user_grade": "12", "addition": 10000, "subtraction": 10000, "multiplication": 100, "division": 100, "geometry": 1, "algebra": 1, "algebra2": 1, "precalculus": 1, "calculus": 1},
    {"user_grade": "special_education", "addition": 5, "subtraction": -1, "multiplication": -1, "division": -1, "geometry": -1, "algebra": -1, "algebra2": -1, "precalculus": -1, "calculus": -1}
]

def populate_table_users():
    conn = get_db_connection()
    cur = conn.cursor()

    for user in users:
        if user[0].strip():  # Skip empty emotions
            cur.execute(
                "INSERT INTO users (username, grade_level, special_education) VALUES (%s, %s, %s)",
                (user[0], user[1], user[2]),
            )

    conn.commit()
    cur.close()
    conn.close()

def standardize_grade(grade):
    grade = str(grade).lower().strip()
    if grade == 'kindergarten':
        return 'k'
    if grade == 'special education':
        return 'special_education'
    return grade

def validate_grade(grade):
    valid_grades = set(['k'] + [str(i) for i in range(1, 13)] + ['special_education'])
    if grade not in valid_grades:
        raise ValueError(f"Invalid grade: {grade}")

def populate_table_curriculum():
    conn = get_db_connection()
    cur = conn.cursor()

    for row in curriculum_data:
        try:
            grade = standardize_grade(row['user_grade'])
            validate_grade(grade)
            
            cur.execute("""
                INSERT INTO curriculum (user_grade, addition, subtraction, multiplication, division, geometry, algebra, algebra2, precalculus, calculus)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_grade) DO UPDATE
                SET addition = EXCLUDED.addition,
                    subtraction = EXCLUDED.subtraction,
                    multiplication = EXCLUDED.multiplication,
                    division = EXCLUDED.division,
                    geometry = EXCLUDED.geometry,
                    algebra = EXCLUDED.algebra,
                    algebra2 = EXCLUDED.algebra2,
                    precalculus = EXCLUDED.precalculus,
                    calculus = EXCLUDED.calculus
            """, (grade, row['addition'], row['subtraction'], row['multiplication'], row['division'], 
                  row['geometry'], row['algebra'], row['algebra2'], row['precalculus'], row['calculus']))
            
            logging.info(f"Successfully upserted curriculum for grade {grade}")
        except ValueError as e:
            logging.error(f"Validation error: {str(e)}")
        except psycopg2.Error as e:
            logging.error(f"Database error when upserting {grade}: {str(e)}")
            conn.rollback()  # rollback the transaction on error
        else:
            conn.commit()  # commit the transaction if successful
    
    cur.close()
    conn.close()

if __name__ == '__main__':
    populate_table_users()
    populate_table_curriculum()
