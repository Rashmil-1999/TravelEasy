CREATE DATABASE tours;
USE tours;

CREATE TABLE users(
	id INT NOT NULL,
    fname VARCHAR(30) NOT NULL,
    lname VARCHAR(30) NOT NULL,
    email_id VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY(id))ENGINE=INNODB;
    
CREATE TABLE tour_type(
	tt_id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(30),
    PRIMARY KEY (tt_id)
) ENGINE=INNODB;    
    
CREATE TABLE tour(
	t_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    description VARCHAR(500) NOT NULL,
    itenary MEDIUMTEXT NOT NULL,
    price MEDIUMINT NOT NULL,
    tt_id INT NOT NULL,
    FOREIGN KEY (tt_id)
        REFERENCES tour_type(tt_id)
        ON DELETE RESTRICT,
	PRIMARY KEY (t_id)
) ENGINE=INNODB;

CREATE TABLE places(
	pl_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(40),
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

CREATE TABLE images(
	i_id INT NOT NULL AUTO_INCREMENT,
	pl_id INT NOT NULL,
    image BLOB NOT NULL,
    FOREIGN KEY (pl_id)
		REFERENCES places(pl_id)
        ON DELETE CASCADE,
	PRIMARY KEY (i_id)
)ENGINE=INNODB;

CREATE TABLE dates(
	t_id INT NOT NULL,
    start_date DATE NOT NULL,
    FOREIGN KEY (t_id)
		REFERENCES tour(t_id)
		ON DELETE CASCADE
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


SELECT pl.name
FROM tour_places tp
JOIN places pl
	ON pl.pl_id = tp.pl_id
WHERE tp.t_id = 1