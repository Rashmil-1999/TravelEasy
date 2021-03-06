CREATE DATABASE tours;
USE tours;

CREATE TABLE users(
	id INT NOT NULL AUTO_INCREMENT,
    fname VARCHAR(30) NOT NULL,
    lname VARCHAR(30) NOT NULL,
    email_id VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    is_admin INT NOT NULL,
    PRIMARY KEY(id)
)ENGINE=INNODB;
    
CREATE TABLE tour_type(
	tt_id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(30),
    PRIMARY KEY (tt_id)
) ENGINE=INNODB;    
    
CREATE TABLE tour(
	t_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    region VARCHAR(50) NOT NULL,
    duration MEDIUMTEXT NOT NULL,
    description MEDIUMTEXT NOT NULL,
    itenary MEDIUMTEXT NOT NULL,
    price MEDIUMTEXT NOT NULL,
    tt_id INT NOT NULL,
    FOREIGN KEY (tt_id)
        REFERENCES tour_type(tt_id)
        ON DELETE RESTRICT,
	PRIMARY KEY (t_id)
) ENGINE=INNODB;

CREATE TABLE places(
	pl_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    image_path VARCHAR(50) NOT NULL,
    PRIMARY KEY (pl_id)
)ENGINE=INNODB;

CREATE TABLE tour_places(
	t_id INT NOT NULL,
    pl_id INT NOT NULL,
    FOREIGN KEY (t_id)
		REFERENCES tour(t_id)
        ON DELETE CASCADE,
    FOREIGN KEY (pl_id)
		REFERENCES places(pl_id)
		ON DELETE CASCADE
)ENGINE=INNODB;


CREATE TABLE dates(
	dt_id INT NOT NULL AUTO_INCREMENT,
	t_id INT NOT NULL,
    start_date DATE NOT NULL,
    FOREIGN KEY (t_id)
		REFERENCES tour(t_id)
		ON DELETE CASCADE,
	PRIMARY KEY (dt_id)
)ENGINE=INNODB;

CREATE TABLE transactions(
	tr_id INT NOT NULL AUTO_INCREMENT,
    u_id INT NOT NULL,
    t_id INT NOT NULL,
    cost MEDIUMINT NOT NULL,
    transaction_date DATE NOT NULL,
    FOREIGN KEY (u_id)
		REFERENCES users(id)
        ON DELETE CASCADE,
		FOREIGN KEY (t_id)
		REFERENCES tour(t_id)
        ON DELETE RESTRICT,
    PRIMARY KEY (tr_id)
)ENGINE=INNODB;


CREATE TABLE itinerary(
	it_id INT NOT NULL AUTO_INCREMENT,
    t_id INT NOT NULL,
    file_path VARCHAR(100) NOT NULL,
    PRIMARY KEY (it_id),
    FOREIGN KEY (t_id)
		REFERENCES tour(t_id)
        ON DELETE CASCADE
);

