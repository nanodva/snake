mySql init:

host: localhost
user: snake
password: password
database: snakeDB

score table:
mysql> create table `score` (\
	       `name` VARCHAR(255) NOT NULL,\
	       `score` INT(9) NOT NULL\
	   )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

