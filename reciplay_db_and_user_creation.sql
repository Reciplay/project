drop database if exists reciplay_db;
create database reciplay_db;
use reciplay_db;
create user 'e104'@'localhost' identified by 'e104';
grant all privileges on reciplay_db.* to 'e104'@'localhost';