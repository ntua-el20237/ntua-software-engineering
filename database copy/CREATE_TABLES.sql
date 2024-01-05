CREATE DATABASE IF NOT EXISTS ntuaflix;
USE ntuaflix;
CREATE TABLE IF NOT EXISTS ntuaflix.actors (
	personal_id VARCHAR(50) PRIMARY KEY,
	primaryName varchar (50),
	birthYear int,
	deathYear int,
    primaryProfession varchar (50),
    knownForTitles varchar (50),
    img_url_asset varchar (100)
);

CREATE TABLE IF NOT EXISTS ntuaflix.movies_akas (
	title_id VARCHAR(50) PRIMARY KEY,
    ordering int,
	title varchar (50),
	region varchar (50),
	language varchar (50),
	types varchar (50),
    attributes varchar (10),
    isOriginalTitle int
);

CREATE TABLE IF NOT EXISTS ntuaflix.movies_basics (
	title_id VARCHAR(50) PRIMARY KEY,
	titleType varchar (50),
	primaryTitle varchar (50),
    originalTitle varchar (50),
	isAdult int,
	startYear int,
	endYear int,
    runtimeMinutes int,
    genres varchar (50),
    img_url_asset varchar (100)
);

CREATE TABLE IF NOT EXISTS ntuaflix.crew (
	title_id VARCHAR(50) PRIMARY KEY,
	director_ids varchar (50),
	writer_ids varchar (50)
);

CREATE TABLE IF NOT EXISTS ntuaflix.series (
	episode_id VARCHAR(50) PRIMARY KEY,
	title_id varchar (50),
	seasonNumber varchar (50),
	episodeNumber varchar (50)
);

CREATE TABLE IF NOT EXISTS ntuaflix.principals (
	principal_id serial PRIMARY KEY,
	title_id VARCHAR(50),
    ordering int,
	personal_id varchar (50),
	category varchar (50),
	job varchar(50),
	characters varchar(50),
	img_url_asset varchar(100)
);

CREATE TABLE IF NOT EXISTS ntuaflix.ratings (
	rating_id serial PRIMARY KEY,
	title_id VARCHAR(50),
	averageRating float,
    numVotes int
);
