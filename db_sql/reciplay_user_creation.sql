drop database if exists reciplay;

create database reciplay;

create user 'reciplay'@'%' identified by 'ssafy';

grant all privileges on reciplay.* to 'reciplay'@'%';