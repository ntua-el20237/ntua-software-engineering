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
   user='root', host='localhost', password='1234', port=3306, database='ntuaflix')#change the password to your own password
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
        
from werkzeug.security import check_password_hash, generate_password_hash

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_name = request.form.get("user_name")
        submitted_user_password = request.form.get("submitted_user_password")

        # Check the username and password against the database
        cursor.execute("SELECT username, password FROM users WHERE username = %s", (user_name,))
        user_data = cursor.fetchone()

        if user_data and check_password_hash(user_data[1], submitted_user_password):
            # Valid login, store the username in the session
            session['username'] = user_data[0]
            flash('Login successful!', 'success')
            return redirect(url_for('profile'))
        else:
            flash('Invalid username or password', 'danger')

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

@app.route('/profile')
def profile():
    if 'username' in session:
        username = session['username']
        return render_template('profile.html', username=username)
    else:
        flash('You need to log in first', 'warning')
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))


@app.route('/toppicks', methods=['GET', 'POST'])
def toppicks():
    if request.method == 'GET':
        return render_template('toppicks.html')
    else:
        return redirect(url_for('toppicks'))
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


