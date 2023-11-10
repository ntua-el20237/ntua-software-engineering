import subprocess
import os

# Path of project folder
dir_path = os.path.dirname(os.path.realpath(__file__))

#install python dependencies
subprocess.check_call("pip install mysql-connector", shell=True)
subprocess.check_call('pip install -r requirements.txt', shell=True)

# node_modules for cli
cli_path = os.path.join(dir_path, "cli")
os.chdir(cli_path)
#subprocess.check_call('npm install', shell=True)
# subprocess.check_call('npm install -g', shell=True)

# node_modules for backend server
backend_path = os.path.join(dir_path, "backend")
os.chdir(backend_path)
#subprocess.check_call('npm install', shell=True)

os.chdir(dir_path)

print("Dependencies downloaded successfully........")

import mysql.connector

#establishing the connection
conn = mysql.connector.connect(
   user='root', host='localhost', password='', port=3306)
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

fd = open(os.path.join(dir_path, "database/CREATE_DATABASE.sql"), 'r')
sqlFile = fd.read()
fd.close()

#Creating a database
cursor.execute(sqlFile)
print("Database created successfully........")

#Closing the connection
conn.close()

##############################################
###   CREATE THE TABLES & VIEWS
##


##############################################
###   IMPORT THE DATA (providers)
##


conn.close()
