import subprocess
import os
import requests
import mysql.connector

#install python dependencies
subprocess.check_call("pip install mysql-connector", shell=True)
subprocess.check_call('pip install -r requirements.txt', shell=True)

print("Dependencies downloaded successfully........")



#establishing the connection
conn = mysql.connector.connect(
   user='root', host='localhost', password='1234', port=3306)
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

#Closing the connection
conn.close()




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

# Usage example
movie_title = input("Enter the movie title: ")
result = search_movie(movie_title)
if isinstance(result, dict):
    print("Title:", result['Title'])
    print("Year:", result['Year'])
    print("IMDb Rating:", result['imdbRating'])
    print("Plot:", result['Plot'])
else:
    print(result)
