import subprocess
import os
import requests
import mysql.connector
from flask import Flask, session, render_template, request, redirect, url_for, flash

#install python dependencies
#subprocess.check_call("pip install mysql-connector", shell=True)
#subprocess.check_call('pip install -r requirements.txt', shell=True)

print("Dependencies downloaded successfully........")

#establishing the connection
conn = mysql.connector.connect(
   user='root', host='localhost', password='pass', port=3306, database='ntuaflix')#change the password to your own password
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

app=Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'  # Set the secret key for Flask app

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
            return "Movie not found"
    else:
        return "Error fetching data"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    if request.method == 'POST':
        movie_id = request.form['movie_id']
        movie_title = request.form['movie_title']
        movie_genre = request.form['movie_genre']
        return redirect(url_for('results', movie_title=movie_title))

@app.route('/<movie_title>')
def results(movie_title):
    result = search_movie(movie_title)
    if isinstance(result, dict):
        return render_template('result.html', result=result)
    else:
        flash(result, 'danger')
        return redirect(url_for('index'))
        
@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        user_name = request.form.get("user_name")
        submitted_user_password = request.form.get("submitted_user_password")
        return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    else:
        return redirect(url_for('index'))
    
@app.route('/chat')
def chat():
    return render_template('chat.html')

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



