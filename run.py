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

@app.route('/ntuaflix')
def register():
    return render_template('register.html')

@app.route('/ntuaflix/home')
def home():
    return render_template('home.html')

@app.route('/ntuaflix/search', methods=['POST'])
def search():
    if request.method == 'POST':
        movie_id = request.form['movie_id']
        movie_title = request.form['movie_title']
        movie_genre = request.form['movie_genre']
        return redirect(url_for('results', movie_title=movie_title))

@app.route('/ntuaflix/<movie_title>')
def results(movie_title):
    result = search_movie(movie_title)
    if isinstance(result, dict):
        return render_template('result.html', result=result)
    else:
        flash(result, 'danger')
        return redirect(url_for('home'))
        
@app.route('/ntuaflix/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        user_name = request.form.get("user_name")
        submitted_user_password = request.form.get("submitted_user_password")
        return render_template('home.html')
    
@app.route('/ntuaflix/chat')
def chat():
    return render_template('chat.html')

@app.route('/ntuaflix/profile')
def profile():
    return render_template('profile.html')

@app.route('/ntuaflix/toppicks', methods=['GET', 'POST'])
def toppicks():
    if request.method == 'GET':
        return render_template('toppicks.html')
    else:
        return redirect(url_for('toppicks'))

    
if __name__ == '__main__':
    app.run(debug=True, port=9876)



