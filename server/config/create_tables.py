import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.db import get_db_connection

def create_tables():
    conn = get_db_connection()

    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            grade_level VARCHAR(20) NOT NULL,
            special_education BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS curriculum (
            id SERIAL PRIMARY KEY,
            user_grade VARCHAR(20) NOT NULL UNIQUE,
            addition INTEGER NOT NULL,
            subtraction INTEGER NOT NULL,
            multiplication INTEGER NOT NULL,
            division INTEGER NOT NULL,
            geometry INTEGER NOT NULL,
            algebra INTEGER NOT NULL,
            algebra2 INTEGER NOT NULL,
            precalculus INTEGER NOT NULL,
            calculus INTEGER NOT NULL
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS user_stats (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            total_problems INTEGER NOT NULL DEFAULT 0,
            total_correct INTEGER NOT NULL DEFAULT 0,
            current_streak INTEGER NOT NULL DEFAULT 0,
            longest_streak INTEGER NOT NULL DEFAULT 0,
            last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    cur.close()
    conn.close()

if __name__ == '__main__':
    create_tables()