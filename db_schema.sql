drop database if exists reciplay_db;
create database reciplay_db;

﻿CREATE TABLE `reviews` (
 `id` BIGINT	NOT NULL COMMENT 'auto_increment, unique',
 `user_id` BIGINT NOT NULL COMMENT 'auto_increment, unique',
 `course_id` BIGINT NOT NULL COMMENT 'auto_increase, unique',
 `stars` INT NOT NULL COMMENT '1 ~ 5 점 사이',
 `content` TEXT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `like_count` INT NOT NULL DEFAULT 0
);

CREATE TABLE `categories` (
	`id`	BIGINT	NOT NULL	COMMENT 'unique',
	`name`	VARCHAR(20)	NOT NULL	COMMENT 'unique'
);

CREATE TABLE `like` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`review_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique'
);

CREATE TABLE `lecture_histories` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`lecture_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique'
);

CREATE TABLE `levels` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`category_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`level`	INT	NOT NULL	DEFAULT 0	COMMENT '범위(미정)'
);

CREATE TABLE `course_images` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`course_id`	BIGINT	NOT NULL,
	`image_url`	VARCHAR(500)	NOT NULL,
	`sequence`	INT	NULL	COMMENT 'CONSTRAINT min_sequence CHECK(sequence >  0)'
);

CREATE TABLE `instructor_licenses` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`instructor_id`	BIGINT	NOT NULL,
	`license_id`	BIGINT	NOT NULL,
	`instituion`	VARCHAR(100)	NULL,
	`acquisition_date`	DATE	NULL,
	`grade`	VARCHAR(50)	NULL
);

CREATE TABLE `courses` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increase, unique',
	`instructor_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`categroy_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`title`	VARCHAR(500)	NOT NULL,
	`course_start_date`	DATE	NOT NULL	COMMENT '첫번쨰 강의 날짜와 같다.(자동 동기화)',
	`course_end_date`	DATE	NOT NULL	COMMENT '마지막 강의 날짜와 같다.(자동 동기화)',
	`description`	TEXT	NOT NULL,
	`summary`	VARCHAR(500)	NOT NULL,
	`level`	INT	NOT NULL	COMMENT '범위(미정)',
	`max_enrollments`	INT	NOT NULL,
	`is_approved`	TINYINT(1)	NOT NULL	DEFAULT 0	COMMENT '0(FALSE) or 1(TRUE)',
	`current_enrollments`	INT	NOT NULL	DEFAULT 0,
	`enrollment_start_date`	DATE	NOT NULL,
	`enrollment_end_date`	DATE	NOT NULL,
	`is_live`	TINYINT(1)	NOT NULL	DEFAULT 0	COMMENT '0 or 1',
	`is_deleted`	TINYINT(1)	NOT NULL	DEFAULT 0	COMMENT '0 or 1',
	`registerd_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`cover_image_url`	VARCHAR(500)	NULL,
	`announcement`	TEXT	NULL
);

CREATE TABLE `course_histories` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`course_id`	BIGINT	NOT NULL	COMMENT 'auto_increase, unique',
	`enrollmented_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`is_enrollmented`	TINYINT(1)	NOT NULL	DEFAULT 0	COMMENT 'ON or OFF'
);

CREATE TABLE `lectures` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`course_id`	BIGINT	NOT NULL	COMMENT 'auto_increase, unique',
	`sequence`	INT	NOT NULL	COMMENT 'CONSTRAINT min_sequence CHECK(sequence >  0)',
	`title`	VARCHAR(500)	NOT NULL,
	`summary`	VARCHAR(500)	NOT NULL,
	`materials`	TEXT	NOT NULL,
	`resource_url`	VARCHAR(500)	NULL,
	`started_at`	TIMESTAMP	NOT NULL,
	`ended_at`	TIMESTAMP	NOT NULL,
	`is_completed`	TINYINT(1)	NOT NULL	DEFAULT 0,
	`resource_name`	VARCHAR(500)	NULL,
	`is_skiped`	TINYINT(1)	NOT NULL	DEFAULT 0	COMMENT '0(false) or 1(true)'
);

CREATE TABLE `subscriptions` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`instructor_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`subscribed_date`	DATE	NOT NULL	DEFAULT CURRENT_DATE
);

CREATE TABLE `todos` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`chapter_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`sequence`	INT	NOT NULL	COMMENT 'CONSTRAINT min_sequence CHECK(sequence >  0)',
	`title`	VARCHAR(255)	NOT NULL,
	`type`	INT	NOT NULL	DEFAULT 0	COMMENT '0 = NORMAL
1 = TIMER'
);

CREATE TABLE `Questions` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`course_id`	BIGINT	NOT NULL	COMMENT 'auto_increase, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`title`	VARCHAR(500)	NOT NULL,
	`question_content`	TEXT	NOT NULL,
	`answer_content`	TEXT	NULL,
	`question_at`	TIMESTAMP	NOT NULL	DEFAULT CURRNET_TIMESTAMP,
	`answer_at`	TIMESTAMP	NULL,
	`question_updated_at`	TIMESTAMP	NULL,
	`answer_updated_at`	TIMESTAMP	NULL
);

CREATE TABLE `careers` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`instructor_id`	BIGINT	NOT NULL,
	`compay_name`	VARCHAR(100)	NOT NULL,
	`position`	VARCHAR(50)	NULL,
	`job_description`	TEXT	NULL,
	`start_date`	DATE	NULL,
	`end_date`	DATE	NULL
);

CREATE TABLE `users` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`email`	VARCHAR(100)	NOT NULL	COMMENT 'unique',
	`password`	VARCHAR(500)	NOT NULL,
	`name`	VARCHAR(100)	NULL,
	`nickname`	VARCHAR(100)	NULL	COMMENT 'unique',
	`birth_date`	DATE	NULL,
	`image_url`	VARCHAR(500)	NULL,
	`gender`	TINYINT(1)	NULL	COMMENT '여자 = 0
남자 = 1',
	`job`	VARCHAR(100)	NULL,
	`created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP,
	`role`	VARCHAR(20)	NOT NULL	DEFAULT STUDENT	COMMENT 'INSTRUCTOR, STUDENT, ADMIN',
	`is_activated`	TINYINT(1)	NOT NULL	DEFAULT 1	COMMENT '1(TRUE) or0(FALSE)',
	`deactivated_at`	TIMESTAMP	NULL
);

CREATE TABLE `chapters` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`lecture_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`sequence`	INT	NOT NULL	COMMENT 'CONSTRAINT min_sequence CHECK(sequence >  0)',
	`title`	VARCHAR(500)	NOT NULL
);

CREATE TABLE `live_rooms` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto increment, unique',
	`lecture_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`title`	VARCHAR(500)	NOT NULL
);

CREATE TABLE `zzims` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`course_id`	BIGINT	NOT NULL	COMMENT 'auto_increase, unique'
);

CREATE TABLE `blacklist` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`id2`	BIGINT	NOT NULL	COMMENT 'auto_increase, unique'
);

CREATE TABLE `special_courses` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`id2`	BIGINT	NOT NULL	COMMENT 'auto_increase, unique',
	`banner_image_url`	VARCHAR(500)	NOT NULL
);

CREATE TABLE `messages` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`sender_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`receiver_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`notified_at`	TIMESTAMP	NOT NULL	DEFAULT CURRNET TIMESTAMP,
	`message`	TEXT	NOT NULL,
	`priority`	INT	NOT NULL	DEFAULT 0	COMMENT '숫자가 높을수록 우선순위가 높다
범위(아직 미정)',
	`is_checked`	TINYINT(1)	NOT NULL	DEFAULT 0
);

CREATE TABLE `subscription_histories` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`instructor_id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`subscriber_count`	INT	NOT NULL	DEFAULT 0,
	`date`	DATE	NOT NULL	DEFAULT CURRNET_DATE
);

CREATE TABLE `instructors` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`user_id`	BIGINT	NOT NULL,
	`introduction`	TEXT	NOT NULL,
	`is_approved`	TINYINT(1)	NOT NULL	DEFAULT 0	COMMENT '0(FLASE) or 1(TRUE)',
	`registered_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT TIMESTAMP,
	`cover_image_url`	VARCHAR(500)	NULL,
	`address`	VARCHAR(500)	NOT NULL,
	`phone_number`	VARCHAR(100)	NOT NULL
);

CREATE TABLE `licenses` (
	`id`	BIGINT	NOT NULL	COMMENT 'auto_increment, unique',
	`name`	VARCHAR(100)	NOT NULL	COMMENT 'unique'
);

create table tokens(
	id bigint primary key auto_increment,
    plain varchar(500) not null,
    is_expired boolean default false,
    `type` varchar(10) not null,
    created_at timestamp,
    username varchar(100)
);

ALTER TABLE `reviews` ADD CONSTRAINT `PK_REVIEWS` PRIMARY KEY (
	`id`
);

ALTER TABLE `categories` ADD CONSTRAINT `PK_CATEGORIES` PRIMARY KEY (
	`id`
);

ALTER TABLE `like` ADD CONSTRAINT `PK_LIKE` PRIMARY KEY (
	`id`
);

ALTER TABLE `lecture_histories` ADD CONSTRAINT `PK_LECTURE_HISTORIES` PRIMARY KEY (
	`id`
);

ALTER TABLE `levels` ADD CONSTRAINT `PK_LEVELS` PRIMARY KEY (
	`id`
);

ALTER TABLE `course_images` ADD CONSTRAINT `PK_COURSE_IMAGES` PRIMARY KEY (
	`id`
);

ALTER TABLE `instructor_licenses` ADD CONSTRAINT `PK_INSTRUCTOR_LICENSES` PRIMARY KEY (
	`id`
);

ALTER TABLE `courses` ADD CONSTRAINT `PK_COURSES` PRIMARY KEY (
	`id`
);

ALTER TABLE `course_histories` ADD CONSTRAINT `PK_COURSE_HISTORIES` PRIMARY KEY (
	`id`
);

ALTER TABLE `lectures` ADD CONSTRAINT `PK_LECTURES` PRIMARY KEY (
	`id`
);

ALTER TABLE `subscriptions` ADD CONSTRAINT `PK_SUBSCRIPTIONS` PRIMARY KEY (
	`id`
);

ALTER TABLE `todos` ADD CONSTRAINT `PK_TODOS` PRIMARY KEY (
	`id`
);

ALTER TABLE `Questions` ADD CONSTRAINT `PK_QUESTIONS` PRIMARY KEY (
	`id`
);

ALTER TABLE `careers` ADD CONSTRAINT `PK_CAREERS` PRIMARY KEY (
	`id`
);

ALTER TABLE `users` ADD CONSTRAINT `PK_USERS` PRIMARY KEY (
	`id`
);

ALTER TABLE `chapters` ADD CONSTRAINT `PK_CHAPTERS` PRIMARY KEY (
	`id`
);

ALTER TABLE `live_rooms` ADD CONSTRAINT `PK_LIVE_ROOMS` PRIMARY KEY (
	`id`
);

ALTER TABLE `zzims` ADD CONSTRAINT `PK_ZZIMS` PRIMARY KEY (
	`id`
);

ALTER TABLE `blacklist` ADD CONSTRAINT `PK_BLACKLIST` PRIMARY KEY (
	`id`
);

ALTER TABLE `special_courses` ADD CONSTRAINT `PK_SPECIAL_COURSES` PRIMARY KEY (
	`id`
);

ALTER TABLE `messages` ADD CONSTRAINT `PK_MESSAGES` PRIMARY KEY (
	`id`
);

ALTER TABLE `subscription_histories` ADD CONSTRAINT `PK_SUBSCRIPTION_HISTORIES` PRIMARY KEY (
	`id`
);

ALTER TABLE `instructors` ADD CONSTRAINT `PK_INSTRUCTORS` PRIMARY KEY (
	`id`
);

ALTER TABLE `licenses` ADD CONSTRAINT `PK_LICENSES` PRIMARY KEY (
	`id`
);

