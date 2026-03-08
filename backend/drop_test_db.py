import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname='postgres',
    user='postgres',
    password='Ajangchol98',
    host='localhost',
    port='5432'
)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cursor = conn.cursor()

# Drop test database if exists
try:
    cursor.execute("DROP DATABASE IF EXISTS test_aidtrace_db;")
    print("Test database dropped successfully")
except Exception as e:
    print(f"Error: {e}")

cursor.close()
conn.close()
