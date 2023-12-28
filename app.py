import subprocess
import os
import requests
import mysql.connector
from flask import Flask, session

conn = mysql.connector.connect(
   user='root', host='localhost', password='pass', port=3306, database='ntuaflix')
conn.autocommit = True

cursor = conn.cursor()

app=Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey' 

dir_path = os.path.dirname(os.path.realpath(__file__))

## CREATE THE TABLES
fd = open(os.path.join(dir_path, "database/CREATE_TABLES.sql"), 'r')
sqlFile = fd.read()
fd.close()

cursor.execute(sqlFile, multi=True)
conn.commit()
print("Tables created successfully........")

sql_directory = os.path.join(dir_path, "database/data/INSERT_DATA/")
for file_name in os.listdir(sql_directory):
    if file_name.endswith('.sql'):
        with open(os.path.join(sql_directory, file_name), 'r') as file:
            sqlFile = file.read()
            cursor.execute(sqlFile, multi=True)
            conn.commit()
            print(f"Data from {file_name} inserted successfully")