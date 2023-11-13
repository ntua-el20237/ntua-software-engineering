import subprocess
import os

#install python dependencies
subprocess.check_call("pip install mysql-connector", shell=True)
subprocess.check_call('pip install -r requirements.txt', shell=True)

print("Dependencies downloaded successfully........")

import mysql.connector

#establishing the connection
conn = mysql.connector.connect(
   user='root', host='localhost', password='', port=3306)
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

conn.close()
