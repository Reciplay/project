drop database if exists reciplay_db;
create database reciplay_db;
use reciplay_db;

-- reciplay_schema.sql

-- Table for blacklists
CREATE TABLE blacklists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    lecture_id BIGINT
);

-- Table for careers
CREATE TABLE careers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    instructor_id BIGINT,
    company_name VARCHAR(500),
    position VARCHAR(500),
    job_description TEXT,
    start_date DATE,
    end_date DATE
);

-- Table for categories
CREATE TABLE categories (
    id BIGINT PRIMARY KEY,
    name VARCHAR(500)
);

-- Table for chapters
CREATE TABLE chapters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lecture_id BIGINT,
    sequence INT,
    title VARCHAR(500)
);

-- Table for courses
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    instructor_id BIGINT,
    category_id BIGINT,
    title VARCHAR(500),
    course_start_date DATE,
    course_end_date DATE,
    description TEXT,
    summary TEXT,
    level INT,
    max_enrollments INT,
    is_approved BOOLEAN,
    current_enrollments INT,
    enrollment_start_date DATETIME,
    enrollment_end_date DATETIME,
    is_live BOOLEAN,
    is_deleted BOOLEAN,
    registered_at DATETIME,
    cover_image_url VARCHAR(500),
    announcement VARCHAR(500)
);

-- Table for course_histories
CREATE TABLE course_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    course_id BIGINT,
    enrollmented_at DATETIME,
    is_enrollmented BOOLEAN
);

-- Table for course_images
CREATE TABLE course_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    image_url VARCHAR(500),
    sequence INT
);

-- Table for instructors
CREATE TABLE instructors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    introduction TEXT,
    is_approved BOOLEAN,
    cover_image_url VARCHAR(500),
    address VARCHAR(500),
    phone_number VARCHAR(500)
);

-- Table for instructor_licenses
CREATE TABLE instructor_licenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    instructor_id BIGINT,
    license_id BIGINT,
    institution VARCHAR(500),
    acquisition_date DATE,
    grade VARCHAR(500)
);

-- Table for lectures
CREATE TABLE lectures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    sequence INT,
    title VARCHAR(500),
    summary TEXT,
    materials VARCHAR(500),
    resource_url VARCHAR(500),
    started_at DATETIME,
    ended_at DATETIME,
    is_completed BOOLEAN,
    resource_name VARCHAR(500),
    is_skipped BOOLEAN
);

-- Table for lecture_histories
CREATE TABLE lecture_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    lecture_id BIGINT,
    attended_at DATETIME
);

-- Table for levels
CREATE TABLE levels (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    category_id BIGINT,
    level INT
);

-- Table for licenses
CREATE TABLE licenses (
    id BIGINT PRIMARY KEY,
    name VARCHAR(500)
);

-- Table for `like`
CREATE TABLE `like` (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    review_id BIGINT
);

-- Table for live_rooms
CREATE TABLE live_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lecture_id BIGINT,
    title VARCHAR(500)
);

-- Table for messages
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT,
    receiver_id BIGINT,
    notified_at DATETIME
);

-- Table for questions
CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    user_id BIGINT,
    title VARCHAR(500),
    question_content TEXT,
    question_at DATETIME,
    answer_at DATETIME,
    question_updated_at DATETIME,
    answer_updated_at DATETIME
);

-- Table for reviews
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    course_id BIGINT,
    stars INT,
    content TEXT,
    created_at DATETIME,
    like_count INT
);

-- Table for special_courses
CREATE TABLE special_courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT,
    banner_image_url VARCHAR(500)
);

-- Table for subscriptions
CREATE TABLE subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    instructor_id BIGINT,
    subscribed_date DATE
);

-- Table for subscription_histories
CREATE TABLE subscription_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    instructor_id BIGINT,
    subscriber_count INT,
    date DATE
);

-- Table for todos
CREATE TABLE todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chapter_id BIGINT,
    sequence INT,
    title VARCHAR(500),
    type INT,
    seconds INT
);

-- Table for zzims
CREATE TABLE zzims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    course_id BIGINT
);

-- Table for tokens
CREATE TABLE tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plain VARCHAR(500),
    is_expired BOOLEAN,
    type VARCHAR(500),
    created_at DATETIME,
    username VARCHAR(500)
);

-- Table for users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(500) UNIQUE,
    password VARCHAR(500),
    nickname VARCHAR(500),
    name VARCHAR(500),
    birth_date DATE,
    gender INT,
    job VARCHAR(500),
    created_at DATETIME,
    img_url VARCHAR(500),
    is_activated BOOLEAN,
    role VARCHAR(500)
);
