CREATE TABLE IF NOT EXISTS actors (
	personal_id serial PRIMARY KEY,
	birthYear int,
	deathYear int,
    primaryProfession varchar (50),
    knownForTitles varchar (50),
    img_url_asset varchar (50)
);

CREATE TABLE IF NOT EXISTS movies_akas (
	title_id serial PRIMARY KEY,
    ordering int,
	title varchar (50),
	region varchar (50),
	language varchar (50),
	types varchar (50),
    attributes varchar (10),
    isOriginalTitle int
);

CREATE TABLE IF NOT EXISTS movies_basics (
	title_id serial PRIMARY KEY,
	primaryTitle varchar (50),
    originalTitle varchar (50),
	isAdult int,
	startYear int,
	endYear int,
    runtimeMinutes int,
    genres varchar (50),
    img_url_asset varchar (50)
);


CREATE TABLE IF NOT EXISTS crew (
	tile_id serial PRIMARY KEY,
	director_ids int,
	writer_ids int
);

CREATE TABLE IF NOT EXISTS series (
	episode_id serial PRIMARY KEY,
	title_id int,
	seasonNumber int,
	episodeNumber int
);

CREATE TABLE IF NOT EXISTS principals (
	title_id serial PRIMARY KEY,
    ordering int,
	personal_id int,
	category varchar (50),
	job_character varchar(50),
    img_url_asset varchar(50)
);

CREATE TABLE IF NOT EXISTS ratings (
	title_id serial PRIMARY KEY,
	averageRating float,
    numVotes float
);
