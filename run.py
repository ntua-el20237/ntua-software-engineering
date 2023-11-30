import subprocess
import os
import requests #pip install requests
import mysql.connector
from flask import Flask, render_template,request

#install python dependencies
subprocess.check_call("pip install mysql-connector", shell=True)
subprocess.check_call('pip install -r requirements.txt', shell=True)

print("Dependencies downloaded successfully........")



#establishing the connection
conn = mysql.connector.connect(
   user='root', host='localhost', password='1234', port=3306)#change the password to your own password
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

#Closing the connection
conn.close()

app=Flask(__name__)


def search_movie(title):
    base_url = "http://www.omdbapi.com/"
    api_key = "35197b83"
    params = {'apikey': api_key, 't': title}

    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        movie_data = response.json()
        if movie_data['Response'] == 'True':
            return movie_data
        else:
            return "Movie not found."
    else:
        return "Error fetching data."

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search',methods=['POST'])
def search():
    if request.method == 'POST':
        movie_title=request.form['movie_title']
        result = search_movie(movie_title)
        if isinstance(result,dict):
            return render_template('result.html',result=result)
        else:
            return render_template('result.html',error=result)
        

# Usage example
#movie_title = input("Enter the movie title: ")
#result = search_movie(movie_title)
#if isinstance(result, dict):
  #  print("Title:", result['Title'])
  #  print("Year:", result['Year'])
   # print("IMDb Rating:", result['imdbRating'])
   # print("Plot:", result['Plot'])
#else:
 #   print(result)

    
if __name__ == '__main__':
    app.run(debug=True, port=9876)



