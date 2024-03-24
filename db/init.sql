CREATE TYPE enum_yesno AS ENUM ('YES', 'NO');

-- CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float, units varchar)
-- RETURNS float AS $dist$
-- 	DECLARE
-- 		dist float = 0;
-- 		radlat1 float;
-- 		radlat2 float;
-- 		theta float;
-- 		radtheta float;
-- 	BEGIN
-- 		IF lat1 = lat2 OR lon1 = lon2
-- 			THEN RETURN dist;
-- 		ELSE
-- 			radlat1 = pi() * lat1 / 180;
-- 			radlat2 = pi() * lat2 / 180;
-- 			theta = lon1 - lon2;
-- 			radtheta = pi() * theta / 180;
-- 			dist = sin(radlat1) * sin(radlat2) + cos(radlat1) * cos(radlat2) * cos(radtheta);

-- 			IF dist > 1 THEN dist = 1; END IF;

-- 			dist = acos(dist);
-- 			dist = dist * 180 / pi();
-- 			dist = dist * 60 * 1.1515;

-- 			IF units = 'K' THEN dist = dist * 1.609344; END IF;
-- 			IF units = 'N' THEN dist = dist * 0.8684; END IF;

-- 			RETURN dist;
-- 		END IF;
-- 	END;
-- $dist$ LANGUAGE plpgsql;

--- WHEN MAKING TABLES LIMIT SCOPE AS MUCH AS POSSIBLE *note research 7 normal forms

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	verified enum_yesno DEFAULT 'NO',
	last_connection TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_verify (
	running_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	email VARCHAR(255) NOT NULL,
	verify_code INT NOT NULL,
	expire_time TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + interval '30 minutes'),
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset (
	running_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	reset_code VARCHAR(255) NOT NULL,
	expire_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_info (
	running_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	gender VARCHAR(255) NOT NULL,
	age INT NOT NULL,
	sexual_pref VARCHAR(255) NOT NULL,
	biography VARCHAR(65535) NOT NULL,
	fame_rating INT NOT NULL DEFAULT 0,
	user_location VARCHAR(255) NOT NULL,
	IP_location POINT NOT NULL DEFAULT '(0, 0)',
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS likes (
	running_id SERIAL NOT NULL PRIMARY KEY,
	liker_id INT NOT NULL,
	target_id INT NOT NULL,
	liketime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (liker_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS connections (
	connection_id SERIAL NOT NULL PRIMARY KEY,
	user1_id INT NOT NULL,
	user2_id INT NOT NULL,
	FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blocks (
	block_id SERIAL NOT NULL PRIMARY KEY,
	blocker_id INT NOT NULL,
	target_id INT NOT NULL,
	FOREIGN KEY (blocker_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS reports (
	report_id SERIAL NOT NULL PRIMARY KEY,
	sender_id INT NOT NULL,
	target_id INT NOT NULL,
	time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
	notification_id SERIAL NOT NULL PRIMARY KEY,
	user_id INT NOT NULL,
	sender_id INT NOT NULL,
	notification_text VARCHAR(255) NOT NULL,
	redirect_path VARCHAR(255),
	read enum_yesno DEFAULT 'NO',
	time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
