CREATE  DATABASE IF NOT EXISTS site_unseen;

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
	status VARCHAR(55) NOT NULL,
	available BOOLEAN NOT NUll
);

CREATE TABLE IF NOT EXISTS pods (
	id SERIAL NOT NULL PRIMARY KEY,
	occupied BOOLEAN NOT NULL,
	occupant_id int,
	FOREIGN KEY (occupant_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS matches (
	id SERIAL NOT NULL PRIMARY KEY,
	user1_id INT NOT NULL,
    pod1_id INT NOT NULL,
	user2_id INT NOT NULL,
    pod2_id INT NOT NULL,
	status VARCHAR(255) NOT NULL,
	complete BOOLEAN NOT NULL,
	FOREIGN KEY (user1_id) REFERENCES users (id),
	FOREIGN KEY (user2_id) REFERENCES users (id),
	FOREIGN KEY (pod1_id) REFERENCES pods (id),
	FOREIGN KEY (pod2_id) REFERENCES pods (id)
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