CREATE  DATABASE site_unseen;

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	gender VARCHAR(255) NOT NULL,
	age INT NOT NULL,
	interests VARCHAR(255)[] NOT NULL,
	sexual_pref VARCHAR(255) NOT NULL,
	biography VARCHAR(65535) NOT NULL,
);



CREATE TABLE IF NOT EXISTS matches (
	connection_id SERIAL NOT NULL PRIMARY KEY,
	user1_id INT NOT NULL,
    pod1_id INT NOT NULL,
	user2_id INT NOT NULL,
    pod1_id INT NOT NULL,
	FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS gender_options (
	gender_id SERIAL NOT NULL PRIMARY KEY,
	gender_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sexuality_options (
	sexual_pref_id SERIAL NOT NULL PRIMARY KEY,
	sexual_pref_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS soft_definer_options (
	soft_definer_id SERIAL NOT NULL PRIMARY KEY,
	soft_definer_name VARCHAR(255) NOT NULL,
	soft_definer_keywords VARCHAR(255)[]
);