-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: reciplay_db
-- ------------------------------------------------------
-- Server version       8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blacklists`
--

DROP TABLE IF EXISTS `blacklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklists` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklists`
--

LOCK TABLES `blacklists` WRITE;
/*!40000 ALTER TABLE `blacklists` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `can_learn`
--

DROP TABLE IF EXISTS `can_learn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `can_learn` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `can_learn`
--

LOCK TABLES `can_learn` WRITE;
/*!40000 ALTER TABLE `can_learn` DISABLE KEYS */;
INSERT INTO `can_learn` VALUES (1,'와사비',6),(2,'7',7),(3,'123',8),(4,'21',9),(5,'21',10),(6,'21',11),(7,'321',12),(8,'321',13),(9,'213',14),(10,'231',15),(11,'2',16),(12,'2',17),(13,'2',18),(14,'2',19),(15,'32',20),(16,'32',21),(17,'312',22),(18,'312',23),(19,'312',24),(20,'2',25),(21,'2',26),(22,'2',27),(23,'2',28),(24,'2',29),(25,'면 반죽',30),(26,'기본 소스',30),(27,'플레이팅',30),(28,'면 반죽',31),(29,'기본 소스',31),(30,'플레이팅',31),(31,'면 반죽',36),(32,'기본 소스',36),(33,'플레이팅',36),(34,'면 반죽',38),(35,'기본 소스',38),(36,'플레이팅',38),(37,'면 반죽',41),(38,'기본 소스',41),(39,'플레이팅',41),(40,'면 반죽',42),(41,'기본 소스',42),(42,'플레이팅',42),(43,'면 반죽',43),(44,'기본 소스',43),(45,'플레이팅',43),(46,'면 반죽',44),(47,'기본 소스',44),(48,'플레이팅',44),(49,'213',45),(50,'123412',46),(51,'123412',47),(52,'123',48),(53,'123',49),(54,'123',50),(55,'123',51),(56,'123',52),(57,'123',53),(58,'1213',54),(59,'22',55),(60,'22',56),(61,'22',57),(62,'22',58),(63,'22',59),(64,'22',60),(65,'22',61),(66,'22',62),(67,'22',63),(68,'22',64),(69,'22',65),(70,'22',66),(71,'22',67),(72,'피자',68),(73,'피자',69),(74,'2',70),(75,'444',71),(76,'124',72),(77,'124',73),(78,'5555',74),(79,'123321',75),(80,'ㅂㅈㄷ',76),(81,'312',77),(82,'312',78),(83,'333',79),(84,'123',80),(85,'44',81),(86,'asd',82),(92,'김치',85),(93,'볶음밥',85),(94,'김치볶음밥',85),(99,'피자',83),(100,'반죽',83),(101,'도우',83),(102,'숙성',83),(109,'햄부기',84),(110,'짜장면',87),(111,'짬뽕',87),(112,'중식',87),(113,'보쌈',88),(114,'보쌈',89),(116,'3',91),(117,'실전',91),(118,'타입',91),(119,'계란프라이',91),(120,'3',92),(121,'실전',92),(122,'타입',92),(123,'계란프라이',92),(124,'짜장면',93),(125,'짬뽕',93),(126,'탕수육',93),(127,'유린기',93),(128,'5',94),(129,'4',95),(130,'빵',96),(131,'디저트',96),(132,'케잌',96),(133,'제빵',97);
/*!40000 ALTER TABLE `can_learn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `careers`
--

DROP TABLE IF EXISTS `careers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `instructor_id` bigint DEFAULT NULL,
  `job_description` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careers`
--

LOCK TABLES `careers` WRITE;
/*!40000 ALTER TABLE `careers` DISABLE KEYS */;
INSERT INTO `careers` VALUES (1,'싸피','2025-02-12',2,'ㅋㅋ','노예','2025-01-12'),(2,'어어','2025-05-12',3,'ㅁㄴㅇ','니니','2025-02-12'),(3,'싸피','2025-09-12',4,'싸피에서 코딩 노예였어요','노예','2025-01-12'),(4,'싸피','2025-09-12',5,'싸피에서 코딩 노예였어요','노예','2025-01-12'),(5,'일이삼','2025-09-12',6,'123','사오율','2025-04-12'),(6,'일이삼','2025-09-12',7,'123','사오율','2025-04-12'),(7,'일이삼','2025-09-12',8,'123','사오율','2025-04-12'),(8,'이이이','2025-11-12',9,'ㅋㅌㅊ','삼삼삼','2025-05-12'),(9,'이이이','2025-11-12',10,'ㅋㅌㅊ','삼삼삼','2025-05-12'),(10,'213','2025-08-13',11,'132','213','2025-04-13'),(11,'ABC 레스토랑','2025-08-13',12,'키친 총괄','Head Chef','2023-01-01'),(12,'피자월드','2025-08-12',13,'최고급 피자 제작','수석 피자쉐프','2020-01-01'),(13,'진짜','2025-07-14',14,'ㅎㅎ','가짜','2025-01-14'),(14,'한식주식회사','2023-03-17',16,'청소담당','사원','2022-01-17'),(15,'싸피','2025-12-17',17,'싸피 담당','중대장','2025-01-17');
/*!40000 ALTER TABLE `careers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'한식'),(2,'중식'),(3,'일식'),(4,'양식'),(5,'제과/제빵'),(6,'기타');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (1,1,1,'준비하기'),(2,1,2,'도우 만들기'),(3,1,3,'소스 준비'),(4,1,4,'토핑 준비'),(5,1,5,'피자 조립하기'),(6,1,6,'굽기 & 마무리'),(7,28,1,'재료 준비'),(8,28,2,'돼지고기 삶기'),(9,28,3,'보쌈 김치 준비'),(10,28,4,'쌈 채소 준비'),(11,28,5,'보쌈 세팅 & 마무리'),(12,28,1,'재료 준비'),(13,28,2,'돼지고기 삶기'),(14,28,3,'보쌈 김치 준비'),(15,28,4,'쌈 채소 준비'),(16,28,5,'보쌈 세팅 & 마무리'),(17,28,1,'재료 준비'),(18,28,2,'돼지고기 삶기'),(19,28,3,'보쌈 김치 준비'),(20,28,4,'쌈 채소 준비'),(21,28,5,'보쌈 세팅 & 마무리'),(22,2,1,'재료 준비'),(23,2,2,'돼지고기 삶기'),(24,2,3,'보쌈 김치 준비'),(25,2,4,'쌈 채소 준비'),(26,2,5,'보쌈 세팅 & 마무리'),(28,4,1,'재료 준비'),(29,4,2,'디트로이트 도우 만들기'),(30,4,3,'소스 준비'),(31,4,4,'팬에 도우 펴기'),(32,4,5,'치즈·토핑 올리기'),(33,4,6,'굽기 & 마무리'),(34,6,0,'기본 챕터'),(35,7,0,'기본 챕터'),(36,8,0,'기본 챕터');
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_histories`
--

DROP TABLE IF EXISTS `course_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_histories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint DEFAULT NULL,
  `enrollmented_at` datetime(6) DEFAULT NULL,
  `is_enrollmented` bit(1) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `enrolled_at` datetime(6) DEFAULT NULL,
  `is_enrolled` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_histories`
--

LOCK TABLES `course_histories` WRITE;
/*!40000 ALTER TABLE `course_histories` DISABLE KEYS */;
INSERT INTO `course_histories` VALUES (2,3,NULL,NULL,117,'2025-08-14 16:03:20.963622',_binary ''),(3,3,NULL,NULL,10,'2025-08-14 16:03:43.361915',_binary ''),(6,3,NULL,NULL,8,'2025-08-14 17:37:11.423298',_binary ''),(7,70,NULL,NULL,26,'2025-08-15 05:09:58.367414',_binary ''),(8,4,NULL,NULL,26,'2025-08-15 05:35:47.801068',_binary ''),(9,29,NULL,NULL,26,'2025-08-15 05:36:02.739625',_binary ''),(13,75,NULL,NULL,160,'2025-08-16 06:07:00.341119',_binary ''),(14,70,NULL,NULL,160,'2025-08-16 06:09:25.068919',_binary ''),(15,4,NULL,NULL,117,'2025-08-17 00:21:27.043693',_binary ''),(16,83,NULL,NULL,9,'2025-08-16 06:09:25.068919',_binary ''),(17,83,NULL,NULL,179,'2025-08-16 06:09:25.068919',_binary ''),(19,83,NULL,NULL,181,'2025-08-17 17:59:55.000523',_binary ''),(20,83,NULL,NULL,158,'2025-08-17 18:11:36.359373',_binary ''),(21,83,NULL,NULL,26,'2025-08-17 18:13:50.281718',_binary ''),(22,83,NULL,NULL,182,'2025-08-17 18:27:37.144141',_binary ''),(23,83,NULL,NULL,180,'2025-08-17 18:28:04.875360',_binary ''),(28,83,NULL,NULL,178,'2025-08-17 19:59:23.664444',_binary ''),(29,89,NULL,NULL,89,'2025-08-18 01:40:45.173278',_binary ''),(32,89,NULL,NULL,26,'2025-08-18 04:55:14.178015',_binary ''),(40,89,NULL,NULL,180,'2025-08-18 09:10:36.786886',_binary ''),(41,93,NULL,NULL,180,'2025-08-18 09:10:41.197948',_binary ''),(47,89,NULL,NULL,184,'2025-08-18 10:33:37.679868',_binary ''),(49,93,NULL,NULL,184,'2025-08-18 10:36:48.393574',_binary '');
/*!40000 ALTER TABLE `course_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_images`
--

DROP TABLE IF EXISTS `course_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_images`
--

LOCK TABLES `course_images` WRITE;
/*!40000 ALTER TABLE `course_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `announcement` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `course_end_date` date DEFAULT NULL,
  `course_start_date` date DEFAULT NULL,
  `current_enrollments` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `enrollment_end_date` datetime(6) DEFAULT NULL,
  `enrollment_start_date` datetime(6) DEFAULT NULL,
  `instructor_id` bigint DEFAULT NULL,
  `is_approved` bit(1) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `is_live` bit(1) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `max_enrollments` int DEFAULT NULL,
  `registered_at` datetime(6) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `cover_image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (83,'피자 강좌 공지입니다.',1,'2025-12-31','2025-08-01',0,'피자 만들기 전체 과정을 실습합니다.','2025-08-10 23:59:59.000000','2025-08-01 00:00:00.000000',13,_binary '',_binary '\0',_binary '',1,8,'2025-08-17 08:12:33.000000','도우부터 소스·토핑·굽기까지 배우는 강좌','피자 만들기',NULL),(89,'보쌈 강좌 공지입니다.',2,'2025-12-31','2025-08-01',0,'보쌈 만들기 전체 과정을 실습합니다.','2025-12-31 23:59:59.000000','2025-08-01 00:00:00.000000',17,_binary '',_binary '\0',_binary '',1,4,'2025-08-17 08:12:33.000000','돼지고기 삶기부터 보쌈김치·쌈채소까지 배우는 강좌','보쌈 만들기',NULL),(91,'실전 타입 계란프라이',2,NULL,NULL,0,'실전 타입 계란프라이',NULL,NULL,14,_binary '\0',_binary '\0',_binary '\0',2,2,'2025-08-17 18:23:27.423926','실전 타입 계란프라이','실전 타입 계란프라이',NULL),(92,'실전 타입 계란프라이',2,'2025-08-18','2025-08-17',0,'실전 타입 계란프라이','2025-08-17 09:00:00.000000','2025-08-10 09:00:00.000000',14,_binary '',_binary '\0',_binary '\0',2,2,'2025-08-17 18:23:55.965842','실전 타입 계란프라이','실전 타입 계란프라이',NULL),(93,'짬뽕 강의 때 해산물은 요리 재료는 필수가 아닌 선택입니다.',2,'2025-08-25','2025-08-20',0,'짜장면, 짬뽕, 탕수육 등 기본적인 중식 요리법을 배울 수 있다.','2025-08-19 00:00:00.000000','2025-08-12 00:00:00.000000',16,_binary '',_binary '\0',_binary '\0',2,5,'2025-08-18 01:39:18.798775','중식 요리 클래스','지욱이네 중식당',NULL),(96,'오븐이 필요한 수업입니다. 확인해 주세요!',5,NULL,NULL,0,'제과제빵을 누구나 손쉽게 배울 수 있습니다.\n',NULL,NULL,16,_binary '\0',_binary '\0',_binary '\0',3,10,'2025-08-18 07:12:58.613775','누구나 쉽게 배우는 제과/제빵','너도 제과제빵 할 수 있어',NULL),(97,'제빵',3,NULL,NULL,0,'제빵',NULL,NULL,16,_binary '',_binary '\0',_binary '\0',3,5,'2025-08-18 09:58:09.222170','제빵','제과제빵',NULL);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_metadata`
--

DROP TABLE IF EXISTS `file_metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_metadata` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` enum('IMAGES','MATERIALS','VIDEOS') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `related_id` bigint DEFAULT NULL,
  `related_type` enum('COURSE_COVER','INSTRUCTOR_BANNER','LECTURE','REPLAY','SPECIAL_BANNER','THUMBNAIL','USER_PROFILE') DEFAULT NULL,
  `resource_type` varchar(255) DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=396 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_metadata`
--

LOCK TABLES `file_metadata` WRITE;
/*!40000 ALTER TABLE `file_metadata` DISABLE KEYS */;
INSERT INTO `file_metadata` VALUES (4,'IMAGES','11.jpeg',26,'USER_PROFILE','jpeg',1,'2025-08-08 04:49:09.250805'),(53,'IMAGES','model.png',2,'INSTRUCTOR_BANNER','png',1,'2025-08-12 15:49:11.569625'),(54,'IMAGES','model.png',3,'INSTRUCTOR_BANNER','png',1,'2025-08-12 15:53:18.114577'),(55,'IMAGES','model.png',4,'INSTRUCTOR_BANNER','png',1,'2025-08-12 16:09:33.538156'),(56,'IMAGES','model.png',5,'INSTRUCTOR_BANNER','png',1,'2025-08-12 16:10:52.136302'),(57,'IMAGES','model.png',6,'INSTRUCTOR_BANNER','png',1,'2025-08-12 16:14:35.673854'),(58,'IMAGES','model.png',7,'INSTRUCTOR_BANNER','png',1,'2025-08-12 16:14:49.151795'),(59,'IMAGES','model.png',8,'INSTRUCTOR_BANNER','png',1,'2025-08-12 16:22:43.580991'),(60,'IMAGES','model.png',9,'INSTRUCTOR_BANNER','png',1,'2025-08-12 16:28:01.421833'),(61,'IMAGES','model.png',10,'INSTRUCTOR_BANNER','png',1,'2025-08-12 16:36:04.399556'),(62,'IMAGES','or-hakim-S2Eql9vHN3o-unsplash.jpg',11,'INSTRUCTOR_BANNER','jpg',1,'2025-08-13 11:34:39.170175'),(63,'IMAGES','피카추.jpg',12,'INSTRUCTOR_BANNER','jpg',1,'2025-08-13 11:39:14.819074'),(67,'IMAGES','다운로드.jpg',13,'INSTRUCTOR_BANNER','jpg',1,'2025-08-13 11:46:03.999857'),(133,'MATERIALS','13기_공통PJT_중간발표_E104_레시플레이.pdf',2,'LECTURE','pdf',1,'2025-08-13 17:03:06.590834'),(139,'MATERIALS','250807_출결확인서_배준재[부울경_1반].pdf',4,'LECTURE','pdf',1,'2025-08-13 17:53:06.296730'),(142,'MATERIALS','정보처리기사 실기_마무리 특강(1-6과목)_0417.pdf',5,'LECTURE','pdf',1,'2025-08-14 02:04:34.431570'),(145,'IMAGES','제목 없음.png',14,'INSTRUCTOR_BANNER','png',1,'2025-08-14 14:12:50.314526'),(152,'MATERIALS','제목 없음.pdf',9,'LECTURE','pdf',1,'2025-08-14 17:23:10.335135'),(155,'MATERIALS','제목 없음 (1).pdf',10,'LECTURE','pdf',1,'2025-08-14 17:46:54.620361'),(156,'MATERIALS','소갈비찜 레시피.pdf',-3704980705625953099,'LECTURE','pdf',1,'2025-08-15 16:31:58.785775'),(157,'MATERIALS','소갈비찜 레시피.pdf',-7235932414988914803,'LECTURE','pdf',1,'2025-08-15 16:32:47.908802'),(158,'MATERIALS','소갈비찜 레시피.pdf',-4866703849188233017,'LECTURE','pdf',1,'2025-08-15 16:35:58.088966'),(162,'MATERIALS','증빙서류.pdf',11,'LECTURE','pdf',1,'2025-08-16 05:50:31.311158'),(163,'IMAGES','dummy_100mb.jpg',15,'INSTRUCTOR_BANNER','jpg',1,'2025-08-16 06:02:09.313333'),(168,'MATERIALS','증빙서류.pdf',15,'LECTURE','pdf',2,'2025-08-16 06:23:01.506180'),(173,'MATERIALS','12기_공통PJT_베스트팀워크_예시_양식.pptx',17,'LECTURE','pptx',1,'2025-08-16 17:40:19.951402'),(177,'MATERIALS','정보처리기사 실기_마무리 특강(1-6과목)_0417.pdf',18,'LECTURE','pdf',1,'2025-08-16 23:56:10.226919'),(180,'MATERIALS','정보처리기사 실기_마무리 특강(1-6과목)_0417.pdf',19,'LECTURE','pdf',1,'2025-08-17 00:49:55.466351'),(182,'IMAGES','다운로드.jpg',83,'THUMBNAIL','jpg',1,'2025-08-17 02:10:16.413769'),(185,'IMAGES','지우개.jpg',16,'INSTRUCTOR_BANNER','jpg',1,'2025-08-17 11:08:13.977145'),(188,'MATERIALS','강사 수정API.txt',24,'LECTURE','txt',1,'2025-08-17 11:27:39.653285'),(194,'IMAGES','181.png',83,'COURSE_COVER','png',1,'2025-08-17 11:59:07.297812'),(195,'IMAGES','182.jpg',83,'THUMBNAIL','jpg',2,'2025-08-17 11:59:07.338235'),(363,'MATERIALS','jjajangmyeon_recipe.pdf',26,'LECTURE','pdf',1,'2025-08-17 13:11:58.447366'),(364,'IMAGES','tjaud.png',17,'INSTRUCTOR_BANNER','png',1,'2025-08-17 15:57:35.033459'),(367,'IMAGES','보쌈 배너.jpg',89,'COURSE_COVER','jpg',1,'2025-08-17 16:09:09.274495'),(368,'IMAGES','보쌈.jpg',89,'THUMBNAIL','jpg',1,'2025-08-17 16:09:09.348525'),(369,'IMAGES','tjaud.png',90,'COURSE_COVER','png',1,'2025-08-17 17:34:45.702369'),(370,'IMAGES','다운로드.jpg',90,'THUMBNAIL','jpg',1,'2025-08-17 17:34:46.007243'),(371,'IMAGES','보쌈.jpg',90,'THUMBNAIL','jpg',2,'2025-08-17 17:34:46.066397'),(372,'IMAGES','보쌈 배너.jpg',90,'THUMBNAIL','jpg',3,'2025-08-17 17:34:46.101221'),(373,'IMAGES','model.png',91,'COURSE_COVER','png',1,'2025-08-17 18:23:27.425715'),(374,'IMAGES','prix-signature.png',91,'THUMBNAIL','png',1,'2025-08-17 18:23:27.564908'),(375,'IMAGES','model.png',92,'COURSE_COVER','png',1,'2025-08-17 18:23:55.967878'),(376,'IMAGES','prix-signature.png',92,'THUMBNAIL','png',1,'2025-08-17 18:23:56.094232'),(377,'MATERIALS','증빙서류.pdf',6,'LECTURE','pdf',1,'2025-08-17 18:23:56.216541'),(378,'IMAGES','지우개.jpg',180,'USER_PROFILE','jpg',1,'2025-08-17 19:13:32.187016'),(382,'IMAGES','강좌 썸네일.jpg',93,'COURSE_COVER','jpg',1,'2025-08-18 01:39:18.801170'),(383,'IMAGES','자장면.jpg',93,'THUMBNAIL','jpg',1,'2025-08-18 01:39:18.880215'),(384,'IMAGES','짬뽕.jpg',93,'THUMBNAIL','jpg',2,'2025-08-18 01:39:18.918565'),(385,'MATERIALS','jajangmyeon_recipe (1).txt',7,'LECTURE','txt',1,'2025-08-18 01:39:19.200157'),(386,'MATERIALS','jjamppong_recipe (1).txt',8,'LECTURE','txt',2,'2025-08-18 01:39:19.247939'),(387,'IMAGES','제과제빵 커버.png',94,'COURSE_COVER','png',1,'2025-08-18 02:05:39.981715'),(388,'IMAGES','제과제빵.jpg',94,'THUMBNAIL','jpg',1,'2025-08-18 02:05:40.356288'),(389,'IMAGES','제과제빵 커버.png',95,'COURSE_COVER','png',1,'2025-08-18 02:22:32.112066'),(390,'IMAGES','제과제빵.jpg',95,'THUMBNAIL','jpg',1,'2025-08-18 02:22:32.409365'),(391,'IMAGES','제과제빵 커버.png',96,'COURSE_COVER','png',1,'2025-08-18 07:12:58.615392'),(392,'IMAGES','제과제빵.jpg',96,'THUMBNAIL','jpg',1,'2025-08-18 07:12:58.822462'),(393,'IMAGES','제과제빵케잌.jpg',97,'COURSE_COVER','jpg',1,'2025-08-18 09:58:09.223798'),(394,'IMAGES','제과제빵.jpg',97,'THUMBNAIL','jpg',1,'2025-08-18 09:58:14.294305'),(395,'IMAGES','20250702_234743.jpg',19,'INSTRUCTOR_BANNER','jpg',1,'2025-08-18 10:35:45.323145');
/*!40000 ALTER TABLE `file_metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor_licenses`
--

DROP TABLE IF EXISTS `instructor_licenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor_licenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `acquisition_date` date DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `instructor_id` bigint DEFAULT NULL,
  `license_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor_licenses`
--

LOCK TABLES `instructor_licenses` WRITE;
/*!40000 ALTER TABLE `instructor_licenses` DISABLE KEYS */;
INSERT INTO `instructor_licenses` VALUES (1,'2025-05-01','0','ㅇㅇㅇ',10,3),(2,'2025-04-01','0','213',11,1),(3,'2025-08-13','A','한국산업인력공단',12,1),(4,'2025-08-12','마스터','세계 피자 협회',13,1),(5,'2025-04-01','0','333',14,1),(6,'2024-01-01','0','대한 한식 자격증 기관',16,1),(7,'2025-02-01','0','국가',17,2);
/*!40000 ALTER TABLE `instructor_licenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructors`
--

DROP TABLE IF EXISTS `instructors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `introduction` varchar(255) DEFAULT NULL,
  `is_approved` bit(1) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `registered_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `cover_image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructors`
--

LOCK TABLES `instructors` WRITE;
/*!40000 ALTER TABLE `instructors` DISABLE KEYS */;
INSERT INTO `instructors` VALUES (1,'   123','Java & Spring  10    ',_binary '','010-1234-5678','2025-08-10 18:10:29.000000',8,'https://example.com/instructor8.jpg'),(13,'서울시 강남구 피자로드 123','15년 경력의 피자마스터입니다.',_binary '','010-1234-5678','2025-08-13 11:46:03.997706',117,NULL),(14,'부산 강서구 녹산산단335로 7 송정동','ㅇㅎ',_binary '','010-8882-3650','2025-08-14 14:12:50.254124',26,NULL),(15,'서울 성북구 안암로 17 안암동4가','asdsadd',_binary '\0','','2025-08-16 06:02:09.311022',160,NULL),(16,'부산 강서구 신호동 230-3','제 2의 안성재 세프가 될 인재',_binary '','01048065170','2025-08-17 11:08:13.974253',89,NULL),(17,'서울 동작구 흑석로 97 흑석동','강사 준재입니다.',_binary '','010-1234-4559','2025-08-17 15:57:35.027191',181,NULL),(19,'','',_binary '\0','','2025-08-18 10:35:45.321833',184,NULL);
/*!40000 ALTER TABLE `instructors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecture_histories`
--

DROP TABLE IF EXISTS `lecture_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lecture_histories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attended_at` datetime(6) DEFAULT NULL,
  `lecture_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecture_histories`
--

LOCK TABLES `lecture_histories` WRITE;
/*!40000 ALTER TABLE `lecture_histories` DISABLE KEYS */;
INSERT INTO `lecture_histories` VALUES (1,'2025-08-15 05:35:47.801068',1,117);
/*!40000 ALTER TABLE `lecture_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lectures`
--

DROP TABLE IF EXISTS `lectures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lectures` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint DEFAULT NULL,
  `ended_at` datetime(6) DEFAULT NULL,
  `is_completed` bit(1) DEFAULT NULL,
  `is_skipped` bit(1) DEFAULT NULL,
  `materials` varchar(255) DEFAULT NULL,
  `resource_name` varchar(255) DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `resource_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lectures`
--

LOCK TABLES `lectures` WRITE;
/*!40000 ALTER TABLE `lectures` DISABLE KEYS */;
INSERT INTO `lectures` VALUES (1,83,'2025-08-16 17:02:13.000000',_binary '\0',_binary '\0','밀가루, 이스트, 소금, 물, 토마토 소스, 치즈, 채소, 페퍼로니',NULL,0,'2025-08-18 11:00:00.000000','피자 도우부터 소스, 토핑, 굽기까지 전체 과정을 배우는 강의','피자 만들기 강의',NULL),(2,89,'2025-08-17 17:02:13.000000',_binary '\0',_binary '\0','돼지고기(앞다리/삼겹), 마늘, 생강, 된장, 간장, 설탕, 파, 후추, 배추, 고춧가루, 새우젓, 쌈채소, 마늘, 고추, 쌈장',NULL,0,'2025-08-17 20:02:13.000000','돼지고기 삶기부터 보쌈김치와 쌈 채소 준비, 플레이팅까지 보쌈 요리 전 과정을 학습합니다.','보쌈 만들기',NULL),(4,83,'2025-08-18 12:00:00.000000',_binary '\0',_binary '\0','강력분 밀가루, 이스트, 소금, 물, 올리브오일, 체다치즈, 모짜렐라치즈, 페퍼로니, 토마토소스',NULL,1,'2025-08-18 10:00:00.000000','두꺼운 도우와 치즈 크러스트가 특징인 디트로이트 스타일 피자를 배우는 강의','디트로이트 피자 만들기',NULL),(6,92,'2025-08-18 21:00:00.000000',_binary '\0',_binary '\0','증빙서류.pdf',NULL,0,'2025-08-17 21:07:00.000000','ㅂㅈㄷㅂ','ㅂㅈㄷㅂㅈㅈㅂㄷ',NULL),(7,93,'2025-08-20 15:00:00.000000',_binary '\0',_binary '\0','jajangmyeon_recipe (1).txt',NULL,0,'2025-08-20 12:00:00.000000','중식의 기본인 짜장면 만드는 법븡ㄹ 배울 수 있다.','짜증날때 짜장면 만들기',NULL),(8,93,'2025-08-25 15:00:00.000000',_binary '\0',_binary '\0','jjamppong_recipe (1).txt',NULL,1,'2025-08-25 12:00:00.000000','기본적인 짬뽕을 만드는 법을 배울 수 있다.','짬뽕 만들기',NULL);
/*!40000 ALTER TABLE `lectures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint DEFAULT NULL,
  `level` int DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,1,0,171),(2,2,0,171),(3,3,0,171),(4,4,0,171),(5,5,0,171),(6,6,0,171),(7,1,0,172),(8,2,0,172),(9,3,0,172),(10,4,0,172),(11,5,0,172),(12,6,0,172),(13,1,0,176),(14,2,0,176),(15,3,0,176),(16,4,0,176),(17,5,0,176),(18,6,0,176),(19,1,0,179),(20,2,0,179),(21,3,0,179),(22,4,0,179),(23,5,0,179),(24,6,0,179),(25,1,0,180),(26,2,0,180),(27,3,0,180),(28,4,0,180),(29,5,0,180),(30,6,0,180),(31,1,0,181),(32,2,0,181),(33,3,0,181),(34,4,0,181),(35,5,0,181),(36,6,0,181),(37,1,0,182),(38,2,0,182),(39,3,0,182),(40,4,0,182),(41,5,0,182),(42,6,0,182),(43,1,0,178),(44,2,0,178),(45,3,0,178),(46,4,0,178),(47,5,0,178),(48,6,0,178),(49,1,0,183),(50,2,0,183),(51,3,0,183),(52,4,0,183),(53,5,0,183),(54,6,0,183),(55,1,0,184),(56,2,0,184),(57,3,0,184),(58,4,0,184),(59,5,0,184),(60,6,0,184);
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licenses`
--

DROP TABLE IF EXISTS `licenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licenses` (
  `id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licenses`
--

LOCK TABLES `licenses` WRITE;
/*!40000 ALTER TABLE `licenses` DISABLE KEYS */;
INSERT INTO `licenses` VALUES (1,'한식조리기능사'),(2,'양식조리기능사'),(3,'중식조리기능사'),(4,'일식조리기능사'),(5,'복어조리기능사'),(6,'조리산업기사'),(7,'조리기능장'),(8,'제과기능사'),(9,'제빵기능사'),(10,'떡제조기능사'),(11,'식품가공기능사'),(12,'식품산업기사'),(13,'식품기술사'),(14,'단체급식관리사'),(15,'식품위생관리사'),(16,'영양사'),(17,'관리영양사'),(18,'식품분석기사'),(19,'식품품질관리사'),(20,'식음료관리사'),(21,'음료서비스관리사'),(22,'식품향료조향사'),(23,'위생점검평가사'),(24,'음식점 위생등급제 평가사'),(25,'식품생산관리사'),(26,'식품안전관리자');
/*!40000 ALTER TABLE `licenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `review_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `live_participation`
--

DROP TABLE IF EXISTS `live_participation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `live_participation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `live_room_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `live_participation`
--

LOCK TABLES `live_participation` WRITE;
/*!40000 ALTER TABLE `live_participation` DISABLE KEYS */;
INSERT INTO `live_participation` VALUES (30,'bae90114518@gmail.com',9),(31,'molee@mail.com',9),(32,'high.kick.jake@gmail.com',9),(33,'evenil0206@gmail.com',9),(34,'leejiun0102@naver.com',9),(35,'ji202ji@naver.com',9),(36,'bjj3141592@naver.com',9);
/*!40000 ALTER TABLE `live_participation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `live_rooms`
--

DROP TABLE IF EXISTS `live_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `live_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lecture_id` bigint DEFAULT NULL,
  `roomname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `live_rooms`
--

LOCK TABLES `live_rooms` WRITE;
/*!40000 ALTER TABLE `live_rooms` DISABLE KEYS */;
INSERT INTO `live_rooms` VALUES (8,27,'fb26f3c1-d0cf-420a-9e3f-76912c69d2ce'),(9,1,'89bd66b7-cbd5-4f10-8c17-4ff950e2fab6');
/*!40000 ALTER TABLE `live_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notified_at` datetime(6) DEFAULT NULL,
  `receiver_id` bigint DEFAULT NULL,
  `sender_id` bigint DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'2025-08-12 15:02:49.922840',8,10,'강태욱이라고라고 강좌 등록이 승인되었습니다.'),(2,'2025-08-12 16:07:48.771351',26,10,'강사 등록이 거절되었습니다.\n거절 사유 :강사 등록 반려'),(3,'2025-08-12 16:40:39.901217',26,10,'강사 등록 승인되었습니다.'),(4,'2025-08-13 11:36:49.523849',117,10,'강사 등록이 거절되었습니다.\n거절 사유 :강사 등록 반려'),(5,'2025-08-13 15:10:41.352614',117,10,'강사 등록 승인되었습니다.'),(6,'2025-08-14 03:12:28.130292',26,10,'강사 등록이 거절되었습니다.\n거절 사유 :강사 등록 반려'),(7,'2025-08-14 03:12:32.296892',89,10,'강사 등록이 거절되었습니다.\n거절 사유 :강사 등록 반려'),(8,'2025-08-14 03:14:32.078088',8,10,'213 강좌 등록이 승인되었습니다.'),(9,'2025-08-14 09:13:11.345970',8,10,'444 강좌 등록이 승인되었습니다.'),(10,'2025-08-14 15:58:05.479544',26,10,'강사 등록 승인되었습니다.'),(11,'2025-08-14 16:53:22.737591',8,10,'실전 강좌 등록이 승인되었습니다.'),(12,'2025-08-14 17:10:58.255324',8,10,'강좌 등록이 거절되었습니다.\n거절 사유 : 강좌 등록 반려'),(13,'2025-08-14 17:24:13.252272',26,10,'555 강좌 등록이 승인되었습니다.'),(14,'2025-08-14 17:47:41.050377',26,10,'4444 강좌 등록이 승인되었습니다.'),(15,'2025-08-16 05:51:20.236570',8,10,'테스트 강좌 강좌 등록이 승인되었습니다.'),(16,'2025-08-16 15:20:17.722148',26,10,'333 강좌 등록이 승인되었습니다.'),(17,'2025-08-16 23:56:45.314261',26,10,'444 강좌 등록이 승인되었습니다.'),(18,'2025-08-17 00:57:37.857351',26,10,'asd 강좌 등록이 승인되었습니다.'),(19,'2025-08-17 02:11:25.252357',117,10,'피자마스터의 피자 만들기 강좌 등록이 승인되었습니다.'),(20,'2025-08-17 02:12:31.258772',117,10,'피자마스터의 피자 만들기 강좌 등록이 승인되었습니다.'),(21,'2025-08-17 11:00:03.609524',117,10,'강좌명 햄부기 강좌 등록이 승인되었습니다.'),(22,'2025-08-17 11:11:14.196060',89,10,'강사 등록 승인되었습니다.'),(23,'2025-08-17 11:28:12.201241',89,10,'강좌 등록이 거절되었습니다.\n거절 사유 : 강좌 등록 반려'),(24,'2025-08-17 11:28:15.024927',89,10,'김치볶음밥 마스터 강좌 등록이 승인되었습니다.'),(25,'2025-08-17 13:12:41.788874',89,10,'진행중인 중식 강좌 등록이 승인되었습니다.'),(26,'2025-08-17 16:05:26.668564',181,10,'강사 등록 승인되었습니다.'),(27,'2025-08-17 16:09:15.047047',181,10,'강좌명 보쌈  강좌 등록이 승인되었습니다.'),(28,'2025-08-17 17:36:21.062586',117,10,'더미 강좌 등록이 승인되었습니다.'),(29,'2025-08-17 18:24:31.765797',26,10,'실전 타입 계란프라이 강좌 등록이 승인되었습니다.'),(30,'2025-08-18 01:39:48.557147',89,10,'지욱이네 중식당 강좌 등록이 승인되었습니다.'),(31,'2025-08-18 06:55:22.426919',117,10,'강좌 등록이 거절되었습니다.\n거절 사유 : 강좌 등록 반려');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answer_at` datetime(6) DEFAULT NULL,
  `answer_updated_at` datetime(6) DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  `question_at` datetime(6) DEFAULT NULL,
  `question_content` varchar(255) DEFAULT NULL,
  `question_updated_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `answer_content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,NULL,NULL,75,'2025-08-16 06:08:05.716964','ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ','2025-08-16 06:08:05.716757','ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ',160,NULL),(2,NULL,NULL,75,'2025-08-16 06:08:10.642434','ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ','2025-08-16 06:08:10.642248','ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ',160,NULL),(3,NULL,NULL,75,'2025-08-16 06:08:35.151786','ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ','2025-08-16 06:08:35.151286','ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ',160,NULL),(4,NULL,NULL,75,'2025-08-16 06:09:45.920888','ㅁ','2025-08-16 06:09:45.920653','ㅁ',160,NULL),(5,NULL,NULL,75,'2025-08-16 06:11:29.559388','오류: Request failed with status code 403','2025-08-16 06:11:29.559184','오류: Request failed with status code 403',160,NULL),(6,NULL,NULL,83,'2025-08-17 19:10:06.192036','혹시 강의의 재료에 설탕이 있는데 흑설탕과 백설탕 둘 다 상관 없는 건가요?','2025-08-17 19:10:06.190654','실시간 강의 관련 질문입니다!',180,NULL),(7,NULL,NULL,83,'2025-08-17 19:15:42.541619','','2025-08-17 19:15:42.541402','',180,NULL),(8,NULL,NULL,83,'2025-08-18 03:09:30.512463','123','2025-08-18 03:09:30.509320','123',26,NULL),(9,NULL,NULL,83,'2025-08-18 07:07:36.002085','치즈가 체다치즈 밖에 없는데 괜찮나요?','2025-08-18 07:07:36.001896','재료 관련 질문입니다.',180,NULL),(10,NULL,NULL,83,'2025-08-18 08:39:15.429724','피자 종류가 많은데 어떤 피자 종류를 만들 수 있나요?','2025-08-18 08:39:15.429195','어떤 피자를 만들 수 있나요?',178,NULL),(11,NULL,NULL,89,'2025-08-18 10:43:07.329774','테스트 해볼게요','2025-08-18 10:43:07.329514','테스트 해볼게요',184,NULL);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `course_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `like_count` int DEFAULT NULL,
  `stars` int DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'피자 마스터가 된거 같아요',83,NULL,0,5,117);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `special_courses`
--

DROP TABLE IF EXISTS `special_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `special_courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint DEFAULT NULL,
  `banner_image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `special_courses`
--

LOCK TABLES `special_courses` WRITE;
/*!40000 ALTER TABLE `special_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `special_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_histories`
--

DROP TABLE IF EXISTS `subscription_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_histories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `instructor_id` bigint DEFAULT NULL,
  `subscriber_count` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_histories`
--

LOCK TABLES `subscription_histories` WRITE;
/*!40000 ALTER TABLE `subscription_histories` DISABLE KEYS */;
INSERT INTO `subscription_histories` VALUES (1,'2025-08-01',13,1),(2,'2025-08-03',13,2),(3,'2025-08-17',13,3),(4,'2025-08-04',1,1),(5,'2025-08-04',14,1),(6,'2025-08-17',14,2),(7,'2025-08-03',16,1);
/*!40000 ALTER TABLE `subscription_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `instructor_id` bigint DEFAULT NULL,
  `subscribed_date` date DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (2,14,'2025-08-17',8),(3,13,'2025-08-01',9),(9,1,'2025-08-04',89),(10,13,'2025-08-17',180),(11,14,'2025-08-04',180),(14,16,'2025-08-03',117),(18,13,'2025-08-03',26),(20,16,'2025-08-03',180),(21,17,'2025-08-06',180),(23,17,NULL,89),(31,13,NULL,178);
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todos`
--

DROP TABLE IF EXISTS `todos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `todos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `chapter_id` bigint DEFAULT NULL,
  `seconds` int DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `todos_chk_1` CHECK ((`type` between 0 and 1))
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todos`
--

LOCK TABLES `todos` WRITE;
/*!40000 ALTER TABLE `todos` DISABLE KEYS */;
INSERT INTO `todos` VALUES (1,1,3,1,'오븐 예열하기',1),(2,1,0,2,'도마와 칼 준비하기',0),(3,1,0,3,'밀대와 볼 꺼내기',0),(4,2,0,1,'밀가루, 물, 소금, 이스트 섞기',0),(5,2,5,2,'반죽 치대기',1),(6,2,3,3,'반죽 휴지시키기(테스트)',1),(7,3,0,1,'토마토 소스 팬에 붓기',0),(8,3,0,2,'소금·후추·허브 넣기',0),(9,3,5,3,'소스 저어주기',1),(10,4,0,1,'모짜렐라 치즈 썰기',0),(11,4,0,2,'양파·피망·버섯 썰기',0),(12,4,0,3,'페퍼로니·올리브 준비',0),(13,5,0,1,'도우 밀대로 펼치기',0),(14,5,0,2,'도우 위에 소스 바르기',0),(15,5,5,3,'치즈와 토핑 올리기',1),(16,6,3,1,'피자 오븐에 넣기',1),(17,6,5,2,'구워지는 동안 체크',1),(18,6,0,3,'완성된 피자 꺼내고 썰기',0),(19,7,0,1,'돼지고기 씻기',0),(20,7,0,2,'마늘, 생강 준비하기',0),(21,7,0,3,'된장, 간장 계량하기',0),(22,8,0,1,'냄비에 물 붓고 재료 넣기',0),(23,8,5,2,'돼지고기 넣고 끓이기',1),(24,8,0,3,'중간에 거품 걷어내기',0),(25,9,3,1,'배추 씻고 절이기',1),(26,9,0,2,'고춧가루, 젓갈, 마늘 넣어 양념 만들기',0),(27,9,4,3,'절인 배추에 양념 바르기',1),(28,10,0,1,'상추, 깻잎 씻기',0),(29,10,0,2,'고추, 마늘 썰기',0),(30,10,0,3,'쌈장 준비하기',0),(31,11,3,1,'삶은 돼지고기 썰기',1),(32,11,0,2,'채소와 김치 접시에 담기',0),(33,11,0,3,'보쌈 완성',0),(34,12,0,1,'돼지고기 씻기',0),(35,12,0,2,'마늘, 생강 준비하기',0),(36,12,0,3,'된장, 간장 계량하기',0),(37,13,0,1,'냄비에 물 붓고 재료 넣기',0),(38,13,5,2,'돼지고기 넣고 끓이기',1),(39,13,0,3,'중간에 거품 걷어내기',0),(40,14,3,1,'배추 씻고 절이기',1),(41,14,0,2,'고춧가루, 젓갈, 마늘 넣어 양념 만들기',0),(42,14,4,3,'절인 배추에 양념 바르기',1),(43,15,0,1,'상추, 깻잎 씻기',0),(44,15,0,2,'고추, 마늘 썰기',0),(45,15,0,3,'쌈장 준비하기',0),(46,16,3,1,'삶은 돼지고기 썰기',1),(47,16,0,2,'채소와 김치 접시에 담기',0),(48,16,0,3,'보쌈 완성',0),(49,17,0,1,'돼지고기 씻기',0),(50,17,0,2,'마늘, 생강 준비하기',0),(51,17,0,3,'된장, 간장 계량하기',0),(52,18,0,1,'냄비에 물 붓고 재료 넣기',0),(53,18,5,2,'돼지고기 넣고 끓이기',1),(54,18,0,3,'중간에 거품 걷어내기',0),(55,19,3,1,'배추 씻고 절이기',1),(56,19,0,2,'고춧가루, 젓갈, 마늘 넣어 양념 만들기',0),(57,19,4,3,'절인 배추에 양념 바르기',1),(58,20,0,1,'상추, 깻잎 씻기',0),(59,20,0,2,'고추, 마늘 썰기',0),(60,20,0,3,'쌈장 준비하기',0),(61,21,3,1,'삶은 돼지고기 썰기',1),(62,21,0,2,'채소와 김치 접시에 담기',0),(63,21,0,3,'보쌈 완성',0),(64,22,0,1,'돼지고기 손질/헹구기',0),(65,22,0,2,'마늘·생강·파 준비하기',0),(66,22,0,3,'된장·간장·설탕 계량하기',0),(67,23,0,1,'냄비에 물 붓고 향신채와 양념 넣기',0),(68,23,5,2,'돼지고기 넣고 끓이기(테스트 타이머)',1),(69,23,0,3,'중간중간 거품 걷어내기',0),(70,24,3,1,'배추 씻고 절이기(테스트 타이머)',1),(71,24,0,2,'양념 만들기(고춧가루·젓갈·마늘 등)',0),(72,24,4,3,'절인 배추에 양념 버무리기',1),(73,25,0,1,'상추·깻잎 세척 및 물기 제거',0),(74,25,0,2,'고추·마늘 썰기',0),(75,25,0,3,'쌈장·새우젓 준비',0),(76,26,3,1,'삶은 돼지고기 먹기 좋게 썰기',1),(77,26,0,2,'채소·김치·고기 플레이팅',0),(78,26,0,3,'완성 점검 및 서빙',0),(80,28,0,1,'강력분, 이스트, 소금 계량하기',0),(81,28,0,2,'체다치즈·모짜렐라치즈 준비',0),(82,28,0,3,'페퍼로니 슬라이스 꺼내기',0),(83,29,0,1,'밀가루+이스트+물 섞기',0),(84,29,5,2,'반죽 치대기',1),(85,29,3,3,'팬에 기름 바르고 도우 숙성',1),(86,30,0,1,'토마토소스 팬에 붓기',0),(87,30,3,2,'허브·소금·후추 넣어 끓이기',1),(88,31,0,1,'팬에 숙성된 도우 펼치기',0),(89,31,0,2,'팬 모서리까지 도우 맞추기',0),(90,32,0,1,'체다치즈를 팬 가장자리에 올리기',0),(91,32,0,2,'모짜렐라치즈와 페퍼로니 올리기',0),(92,32,0,3,'소스를 위에 줄무늬처럼 올리기',0),(93,33,5,1,'오븐에 넣어 굽기',1),(94,33,0,2,'치즈 크러스트 확인하기',0),(95,33,0,3,'완성된 피자 꺼내서 자르기',0),(96,34,0,0,'ㅂㅈㄷ',0),(97,36,0,0,'1. 돼지고기 또는 해산물은 먹기 좋은 크기로 손질합니다.',0),(98,36,0,1,'2. 양파, 배추, 애호박, 당근, 청경채 등 채소는 모두 채썰어 준비합니다.',0),(99,36,0,2,'3. 냄비에 식용유와 고추기름을 두른 후, 대파와 다진 마늘을 볶아 향을 냅니다.',0),(100,36,0,3,'4. 돼지고기(또는 해산물)를 넣고 센 불에서 볶습니다.',0),(101,36,0,4,'5. 고춧가루와 간장을 넣어 볶아 풍미와 색을 냅니다.',0),(102,36,0,5,'6. 준비한 채소를 넣고 2~3분간 센 불에서 볶습니다.',0),(103,36,0,6,'7. 닭육수(또는 물)를 붓고 끓입니다. (국물이 우러나도록 5분 정도 끓임)',0),(104,36,0,7,'8. 소금, 후추로 간을 맞춥니다.',0),(105,36,0,8,'9. 삶아둔 중화면 위에 국물과 건더기를 올려 완성합니다.',0);
/*!40000 ALTER TABLE `todos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_expired` bit(1) DEFAULT b'0',
  `plain` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=323 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (1,'2025-08-05 19:47:58.836216',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQzOTA4NzgsImV4cCI6MTc1NDk5MDg3OH0.1N1-C_gJbVB6Y6CniWaFj5ym-IRJSAFZQiCSG2i2s40','ACCESS','wonjun@mail.com'),(2,'2025-08-05 19:47:58.849253',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQzOTA4NzgsImV4cCI6MTc1NDk5NTY3OH0.oiOfQe3Aw1laM6WddK5Ym_2LhETzXzHXwWAcRfMGnbQ','REFRESH','wonjun@mail.com'),(3,'2025-08-05 20:16:59.115967',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQzOTI2MTksImV4cCI6MTc1NDk5MjYxOX0.OZaqG0y4Y_ClfiFNshUC3OQUXR2PrjyCKFu2x3LwXRo','ACCESS','wonjun@mail.com'),(4,'2025-08-05 20:16:59.152735',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQzOTI2MTksImV4cCI6MTc1NDk5NzQxOX0.6IQzicA6zKoEu5uc9-73pta14Ot6qYxDXJm6r2eiZK0','REFRESH','wonjun@mail.com'),(5,'2025-08-05 20:17:31.046278',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQzOTI2NTEsImV4cCI6MTc1NDk5MjY1MX0.gHclnaaHYyBvLJ1_rdBMhRxQJPnB7PPwqGXiZNSDSGI','ACCESS','admin@mail.com'),(6,'2025-08-05 20:17:31.056570',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5MjY1MSwiZXhwIjoxNzU0OTk3NDUxfQ.D_PVl1J3MqqLVmNZMQXzw9DhizgSlr9hPFxI5pceEjA','REFRESH','admin@mail.com'),(7,'2025-08-05 20:28:24.924968',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDM5MzMwNCwiZXhwIjoxNzU0OTkzMzA0fQ.3B6wBh5e1HcI2lfSnT3IPdAdG819Kde_4T3GBUT3PXc','ACCESS','molee@mail.com'),(8,'2025-08-05 20:28:24.933941',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5MzMwNCwiZXhwIjoxNzU0OTk4MTA0fQ.tIJTFCzb-2sn5ky32EDJkdpKTB9EZpW41jygAmjSQOM','REFRESH','molee@mail.com'),(9,'2025-08-05 20:31:36.607491',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDM5MzQ5NiwiZXhwIjoxNzU0OTkzNDk2fQ.QWzqWeuXXJSGC-_jep8MaE4FsDI4QzKhMIVU0RhT_SM','ACCESS','molee@mail.com'),(10,'2025-08-05 20:31:36.618128',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5MzQ5NiwiZXhwIjoxNzU0OTk4Mjk2fQ.n2MN4o-cPIaKDNMRVTAEqzS0yQH67geTcfwwchy2VNw','REFRESH','molee@mail.com'),(11,'2025-08-05 20:36:45.977003',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDM5MzgwNSwiZXhwIjoxNzU0OTkzODA1fQ.WWE5St91-ocH-WZp1_BpOWzEsflIbFUIDQ8fKuxQKAA','ACCESS','molee@mail.com'),(12,'2025-08-05 20:36:45.988587',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5MzgwNSwiZXhwIjoxNzU0OTk4NjA1fQ.7XkrT-jA_z1myciY4lfc1916VBKNQnncf1FMMQpeO-o','REFRESH','molee@mail.com'),(13,'2025-08-05 20:37:52.533767',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQzOTM4NzIsImV4cCI6MTc1NDk5Mzg3Mn0.S3KVxRDQ3dydbCahvc_oWj2yj6RjIMP5-UOQydfkoJY','ACCESS','admin@mail.com'),(14,'2025-08-05 20:37:52.543025',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5Mzg3MiwiZXhwIjoxNzU0OTk4NjcyfQ.6Zc3SxzeRurpolKBLTLiqz8obCOZAJqe67-6GEPc6ok','REFRESH','admin@mail.com'),(15,'2025-08-05 20:38:14.070420',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQzOTM4OTQsImV4cCI6MTc1NDk5Mzg5NH0.I6-ZYLD1DdPAsEDr3M6p5xaouKCXWBGo_Rv5Z88fP-0','ACCESS','admin@mail.com'),(16,'2025-08-05 20:38:14.079024',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5Mzg5NCwiZXhwIjoxNzU0OTk4Njk0fQ.rwUjRGDWaW9EkFjYRJHNHlpNdIoo4Wb1MxaS23PqUQ8','REFRESH','admin@mail.com'),(17,'2025-08-05 20:39:46.594899',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDM5Mzk4NiwiZXhwIjoxNzU0OTkzOTg2fQ.klvt51ZoUwn9XasqKzs7wYKzBAP8WrX59-ASWD7dLXo','ACCESS','molee@mail.com'),(18,'2025-08-05 20:39:46.607242',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5Mzk4NiwiZXhwIjoxNzU0OTk4Nzg2fQ.3kH0iP35EtAjs4JkxoVqlLMtw74oXTJg0b8BapSrb_o','REFRESH','molee@mail.com'),(19,'2025-08-05 20:45:44.144391',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQzOTQzNDQsImV4cCI6MTc1NDk5NDM0NH0.Q9OtXyrvLax7ZOq8lYNNO2icTmX1JgHcahTgGiduwpQ','ACCESS','admin@mail.com'),(20,'2025-08-05 20:45:44.154184',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDM5NDM0NCwiZXhwIjoxNzU0OTk5MTQ0fQ.Cu9E5gdbgk7AxdSgEP9TrOSgrAKbzwHbxoJJP376dGk','REFRESH','admin@mail.com'),(21,'2025-08-06 09:17:23.353767',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0Mzk0NDMsImV4cCI6MTc1NTAzOTQ0M30._ACJUpGkxVYPa-Vt1B4SrH-0MsBvlHmsDs1xDKZOuZ0','ACCESS','admin@mail.com'),(22,'2025-08-06 09:17:23.387940',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQzOTQ0MywiZXhwIjoxNzU1MDQ0MjQzfQ.LXfZ4IF-QObz039heBFc85YwIUmI6mWXS8N8oqO1RZM','REFRESH','admin@mail.com'),(23,'2025-08-06 09:24:47.126450',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ0Mzk4ODcsImV4cCI6MTc1NTAzOTg4N30.AzHf_lYGNNH3sTgR0V1X4pHLAQWwdclIy29vh9lc_pY','ACCESS','wonjun@mail.com'),(24,'2025-08-06 09:24:47.138107',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ0Mzk4ODcsImV4cCI6MTc1NTA0NDY4N30.6Pb_9OXfpHG6orYaEwFAIIbr_Uiag_tBxCmR0PabzyE','REFRESH','wonjun@mail.com'),(25,'2025-08-06 09:27:01.028127',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NDAwMjEsImV4cCI6MTc1NTA0MDAyMX0.HfoK-O1C0MreuXx6WJ6CyGnERSc3qkA0nxkeaEGZH0M','ACCESS','admin@mail.com'),(26,'2025-08-06 09:27:01.038139',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ0MDAyMSwiZXhwIjoxNzU1MDQ0ODIxfQ.-1YDgcpoT8baJksz_BwSJmUFcFLEzqQAz0E_wMBiFOo','REFRESH','admin@mail.com'),(27,'2025-08-06 09:40:04.566466',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDQ0MDgwNCwiZXhwIjoxNzU1MDQwODA0fQ.a3v9CZ9j4rzdbyb0-7cEjRqDGTHffjfamL2TDxrrY-M','ACCESS','molee@mail.com'),(28,'2025-08-06 09:40:04.575673',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ0MDgwNCwiZXhwIjoxNzU1MDQ1NjA0fQ.76MxXWHrinexCeLevxYixNK-SkrbgFJtdHFfE3eNXRI','REFRESH','molee@mail.com'),(29,'2025-08-06 11:04:35.171127',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDQ0NTg3NSwiZXhwIjoxNzU1MDQ1ODc1fQ.Dyii3RJDP6Gb1Iet8i0S1nn5ULtJlH871PlFV5OD-j4','ACCESS','molee@mail.com'),(30,'2025-08-06 11:04:35.180946',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ0NTg3NSwiZXhwIjoxNzU1MDUwNjc1fQ.fykBHvxaBuYiPKD80XOW913bVPaiROut-CEplII7FAo','REFRESH','molee@mail.com'),(31,'2025-08-06 11:46:46.986745',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDQ0ODQwNiwiZXhwIjoxNzU1MDQ4NDA2fQ.5xVgv6VkNfAnSNkuxTko43N4-8dN30KaBGnQxbBwr4A','ACCESS','molee@mail.com'),(32,'2025-08-06 11:46:46.996488',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ0ODQwNiwiZXhwIjoxNzU1MDUzMjA2fQ.if1D8jqPgHQY807VhEUTJhYGAoiw23rwe4S3R4VGR48','REFRESH','molee@mail.com'),(33,'2025-08-06 11:46:50.406679',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDQ0ODQxMCwiZXhwIjoxNzU1MDQ4NDEwfQ._icgpgKkSgOBb4to9oByd1efi8EFu_FNglaVjplRHSM','ACCESS','molee@mail.com'),(34,'2025-08-06 11:46:50.417003',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ0ODQxMCwiZXhwIjoxNzU1MDUzMjEwfQ.R8jiWX8dV2Ccml0BVnDIz1zIiWH7IQp-glF-025Brds','REFRESH','molee@mail.com'),(35,'2025-08-06 11:49:37.518568',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDQ0ODU3NywiZXhwIjoxNzU1MDQ4NTc3fQ.Z9LU1TS3v-SjvZ0rky09SyLLXux_DfCzefo-OZlayYU','ACCESS','molee@mail.com'),(36,'2025-08-06 11:49:37.529952',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ0ODU3NywiZXhwIjoxNzU1MDUzMzc3fQ.4wcHOVXLBf5OFgrMGiDZAW6dDS0ZBXACktGhetxFsNU','REFRESH','molee@mail.com'),(37,'2025-08-06 12:30:19.300628',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ0NTEwMTksImV4cCI6MTc1NTA1MTAxOX0.rxdfFN1zR77s2tOZ-WG4ZL9As93YJepzGa-tO-C_Uvc','ACCESS','wonjun@mail.com'),(38,'2025-08-06 12:30:19.310191',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ0NTEwMTksImV4cCI6MTc1NTA1NTgxOX0.5TtaacF_X6uTQ4MxXWIgUobfWMmIGiKearL6FV4mYx0','REFRESH','wonjun@mail.com'),(39,'2025-08-06 14:55:09.811234',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NTk3MDksImV4cCI6MTc1NTA1OTcwOX0.WmkVi7lX5YPo0nO_gO2Y2A3X26PYOQRDQSeWtSDXa8M','ACCESS','admin@mail.com'),(40,'2025-08-06 14:55:09.827301',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ1OTcwOSwiZXhwIjoxNzU1MDY0NTA5fQ.uWCTWINZ2ipTV2mqjuQETDqjr4CaGKh5gWZzOBuPoUE','REFRESH','admin@mail.com'),(41,'2025-08-06 15:48:02.918485',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NjI4ODIsImV4cCI6MTc1NTA2Mjg4Mn0.-tSZRtue-ayTXSJep7T7AGr4U-MKEzJ2ZOj1Lwak0PE','ACCESS','admin@mail.com'),(42,'2025-08-06 15:48:02.928762',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ2Mjg4MiwiZXhwIjoxNzU1MDY3NjgyfQ.oj1QHv8o_aEsavKVktKCtv2FzZb9mIZP3Kio7FDILZQ','REFRESH','admin@mail.com'),(43,'2025-08-06 15:54:44.079121',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NjMyODQsImV4cCI6MTc1NTA2MzI4NH0.AJ3aw6a2Vp5PwPpVEF-Udz8xZDSbzT2HoAaO33UsLa8','ACCESS','admin@mail.com'),(44,'2025-08-06 15:54:44.088674',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ2MzI4NCwiZXhwIjoxNzU1MDY4MDg0fQ.ttNxmA5Mp8ge_30V9o5XV9SDhiihgnqom3oRU3-Go-M','REFRESH','admin@mail.com'),(45,'2025-08-06 15:56:56.503253',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NjM0MTYsImV4cCI6MTc1NTA2MzQxNn0.6i3HxTu8g0vNoNfowbRp2S3suq0dsnD47urAC-X5k8s','ACCESS','admin@mail.com'),(46,'2025-08-06 15:56:56.513683',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ2MzQxNiwiZXhwIjoxNzU1MDY4MjE2fQ._haumpSak_Ow_u5RR4r5wOeshKZUqGNFZpvri7qeWCI','REFRESH','admin@mail.com'),(47,'2025-08-06 15:58:36.933325',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NjM1MTYsImV4cCI6MTc1NTA2MzUxNn0.kwmg8t3s63FJlguTpGVhl_M9lkC5Cj-Ib-zkeAfwv9M','ACCESS','admin@mail.com'),(48,'2025-08-06 15:58:36.942405',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ2MzUxNiwiZXhwIjoxNzU1MDY4MzE2fQ.6tRPlAztRnQWrdabmvZkY8pMhLan8pmv7kNr1a5LqZU','REFRESH','admin@mail.com'),(49,'2025-08-06 16:45:00.213407',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NjYzMDAsImV4cCI6MTc1NTA2NjMwMH0.Pd9Uuqp0tHZD_YQwlOT8JCwU301dk48H9tGHvIaP9rI','ACCESS','admin@mail.com'),(50,'2025-08-06 16:45:00.251327',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ2NjMwMCwiZXhwIjoxNzU1MDcxMTAwfQ.rSvV65BhOC8lWckQKSVdU-DEXxuVPHXeiKeS7dhgPmE','REFRESH','admin@mail.com'),(51,'2025-08-06 18:49:57.334366',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ0NzM3OTcsImV4cCI6MTc1NTA3Mzc5N30._EIT-vA3ZSDtIxXMhlAMFqV7xaZztKhdpWXmtr7Y31c','ACCESS','admin@mail.com'),(52,'2025-08-06 18:49:57.372385',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDQ3Mzc5NywiZXhwIjoxNzU1MDc4NTk3fQ.H0KGJQTboeDdNFDW3FSSStulLEDcbPLYsprTjVfyXLQ','REFRESH','admin@mail.com'),(53,'2025-08-07 00:21:55.617699',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ0OTM3MTUsImV4cCI6MTc1NTA5MzcxNX0.GEjKjCAnF50gQF_non41IcftUJrYlhB7eZiBSrgtl-s','ACCESS','tw_k7@naver.com'),(54,'2025-08-07 00:21:55.626020',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ0OTM3MTUsImV4cCI6MTc1NTA5ODUxNX0.xVQUu33FtwrcY9TtOLz9HWSIL7bO5rOHFa5YI8oHKIY','REFRESH','tw_k7@naver.com'),(55,'2025-08-07 00:57:37.120750',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ0OTU4NTcsImV4cCI6MTc1NTA5NTg1N30.-QoO5ViOTXx7AO89bGeV65q2ms5o5O57LQB2seQeM8s','ACCESS','tw_k7@naver.com'),(56,'2025-08-07 00:57:37.130430',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ0OTU4NTcsImV4cCI6MTc1NTEwMDY1N30.NdUsdk1DJMZHHgRgfwye3BhR0K7pPKikpe37LgpE7Gg','REFRESH','tw_k7@naver.com'),(57,'2025-08-07 01:00:02.169204',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ0OTYwMDIsImV4cCI6MTc1NTA5NjAwMn0.YnO9OYmKSa8HBZA5eeRrGIvA7-4oAlAzo9U-TPE0W2s','ACCESS','tw_k7@naver.com'),(58,'2025-08-07 01:00:02.180209',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ0OTYwMDIsImV4cCI6MTc1NTEwMDgwMn0.L_go-6FulWIHTWazwu7HfKhzhHcsTK8S-Aa9vXtXvC8','REFRESH','tw_k7@naver.com'),(59,'2025-08-07 01:02:29.262179',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ0OTYxNDksImV4cCI6MTc1NTA5NjE0OX0.Zc09yfwbCwuyt2zxXCWZGUWQnBKQAIJvXYsIA3HEy9Q','ACCESS','tw_k7@naver.com'),(60,'2025-08-07 01:02:29.270266',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ0OTYxNDksImV4cCI6MTc1NTEwMDk0OX0.aRVqGG9tII-lHKoi-eW65a9pnU2z5pMymHbObDpKr2g','REFRESH','tw_k7@naver.com'),(61,'2025-08-07 01:03:31.956441',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ0OTYyMTEsImV4cCI6MTc1NTA5NjIxMX0.I2yZjuCuM3Su3ehrCIS92LjuPUJonfwuA8BuC1Gfw34','ACCESS','tw_k7@naver.com'),(62,'2025-08-07 01:03:31.964491',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ0OTYyMTEsImV4cCI6MTc1NTEwMTAxMX0.dVjebtS6X5dLb2c-lTWuGRzzLF4wdZIBNZHV9bCkLpA','REFRESH','tw_k7@naver.com'),(63,'2025-08-07 02:45:21.741654',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MDIzMjEsImV4cCI6MTc1NTEwMjMyMX0.wPnYV7_klZ5cirsq0hz8gxjXyxSjygV3aeMZkuuA6mU','ACCESS','tw_k7@naver.com'),(64,'2025-08-07 02:45:21.750130',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MDIzMjEsImV4cCI6MTc1NTEwNzEyMX0.JBptc2tZDZWrHrpd6Ym6xdmCaUVyjBm22b83NN2U8RY','REFRESH','tw_k7@naver.com'),(65,'2025-08-07 02:51:12.228021',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MDI2NzIsImV4cCI6MTc1NTEwMjY3Mn0.gqiRqKV3HjnC8GwD2Yo_pyxqt4XMnh6k7PdSI0xm37o','ACCESS','tw_k7@naver.com'),(66,'2025-08-07 02:51:12.238594',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MDI2NzIsImV4cCI6MTc1NTEwNzQ3Mn0.aWKXz8xWix24peQMavb3qyJySBF44J5I0MUYvpUwmBA','REFRESH','tw_k7@naver.com'),(67,'2025-08-07 04:27:19.909489',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MDg0MzksImV4cCI6MTc1NTEwODQzOX0.wm1AQr0PMu612j01mSNCMdGVRZdjivg1TdC4b6esk04','ACCESS','tw_k7@naver.com'),(68,'2025-08-07 04:27:19.919332',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MDg0MzksImV4cCI6MTc1NTExMzIzOX0.oaZEU8968yaHVora4YgXV3ruyMie9lBnwNQcKtsaUO8','REFRESH','tw_k7@naver.com'),(69,'2025-08-07 09:02:51.838796',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MjQ5NzEsImV4cCI6MTc1NTEyNDk3MX0.np86GsFDTxAAglhVyUqSgPw2FA865TsH_cJSanxhFyg','ACCESS','leejiun0102@naver.com'),(70,'2025-08-07 09:02:51.847568',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MjQ5NzEsImV4cCI6MTc1NTEyOTc3MX0.Bf9Xo_Hmn4rhQumhPl-2WUs6QwmxQl8NIe_dhkYxdfQ','REFRESH','leejiun0102@naver.com'),(71,'2025-08-07 09:03:46.921171',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MjUwMjYsImV4cCI6MTc1NTEyNTAyNn0.__QV2NguU-z85l8Zsu3BOdZjfWkI_z9GFXM_1fcrT90','ACCESS','leejiun0102@naver.com'),(72,'2025-08-07 09:03:46.929547',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MjUwMjYsImV4cCI6MTc1NTEyOTgyNn0.jTgRMx8tMR_eorDHT6c2N2fIL2XjXieL_0yBFs8Cq1E','REFRESH','leejiun0102@naver.com'),(73,'2025-08-07 09:59:47.563756',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MjgzODcsImV4cCI6MTc1NTEyODM4N30.YCjI4XWjmpgT_Sw7k5xBuAofmEkIXzbFnWpW6xmso8o','ACCESS','leejiun0102@naver.com'),(74,'2025-08-07 09:59:47.572551',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MjgzODcsImV4cCI6MTc1NTEzMzE4N30.iOARiShyiM2hhtnw_xQ0IyPZchg8cuHGcTc70ESih1g','REFRESH','leejiun0102@naver.com'),(75,'2025-08-07 10:37:56.198665',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MzA2NzYsImV4cCI6MTc1NTEzMDY3Nn0.TGKQfjILCSYAbOdRYNpDtyPoydH3hKF6ynXkVEOq9Ow','ACCESS','tw_k7@naver.com'),(76,'2025-08-07 10:37:56.207849',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MzA2NzYsImV4cCI6MTc1NTEzNTQ3Nn0.e_YyCUj_DXOnG9BzbjPZy5IR2QBtqM4xzxUgfFE2044','REFRESH','tw_k7@naver.com'),(77,'2025-08-07 10:38:20.824325',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MzA3MDAsImV4cCI6MTc1NTEzMDcwMH0.j3akIj2VTN1KeswEjVV7FNsTwzuKghn01fnF6aN9p-A','ACCESS','tw_k7@naver.com'),(78,'2025-08-07 10:38:20.833647',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MzA3MDAsImV4cCI6MTc1NTEzNTUwMH0.CVV5L2z9jbWmDn5EpLpS5Dz8VAkH5ul2jo1poagaotI','REFRESH','tw_k7@naver.com'),(79,'2025-08-07 11:30:34.015948',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1MzM4MzQsImV4cCI6MTc1NTEzMzgzNH0.4DEAbpN0NQswJcAt3fSUsJDwCOw88j5RHQdojM_CZ8g','ACCESS','wonjun@mail.com'),(80,'2025-08-07 11:30:34.023847',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MzM4MzQsImV4cCI6MTc1NTEzODYzNH0.8qh3OFwEKyiHn3eah3o2lhbFwB2QaqUt4GI3JLhyJHQ','REFRESH','wonjun@mail.com'),(81,'2025-08-07 11:30:41.188575',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1MzM4NDEsImV4cCI6MTc1NTEzMzg0MX0.Lss_c0XkYyrLaaOvGUnnPfVXNoN14pDGZmpFR4wdAWQ','ACCESS','wonjun@mail.com'),(82,'2025-08-07 11:30:41.196860',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MzM4NDEsImV4cCI6MTc1NTEzODY0MX0.3QYIMV3DwBsJYk0dnprKF74078ZiFP6RuFbVgtF3M9M','REFRESH','wonjun@mail.com'),(83,'2025-08-07 11:47:53.414046',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MzQ4NzMsImV4cCI6MTc1NTEzNDg3M30.D21RVuwjtp9Kz417EYi1YhzpjToqBEkZU5g6iAejGxU','ACCESS','tw_k7@naver.com'),(84,'2025-08-07 11:47:53.422343',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MzQ4NzMsImV4cCI6MTc1NTEzOTY3M30.XdeA56YvHGZCYYFQ7YaChh1fWHKW6j6-AMJEHDQdPkQ','REFRESH','tw_k7@naver.com'),(85,'2025-08-07 12:09:58.523475',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1MzYxOTgsImV4cCI6MTc1NTEzNjE5OH0.eUznvtFIHv1i6dacpbh9-jwHf96CoNYlDBues1F0yAc','ACCESS','tw_k7@naver.com'),(86,'2025-08-07 12:09:58.532549',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1MzYxOTgsImV4cCI6MTc1NTE0MDk5OH0.f2VZdalQqqXRYdPJk-GxdH-S5i5Q1NHjVFAKBlVbA-s','REFRESH','tw_k7@naver.com'),(87,'2025-08-07 12:19:26.964803',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDUzNjc2NiwiZXhwIjoxNzU1MTM2NzY2fQ.dOXMLYC-MdUtHvftej-MIMygkfmK1q3SPeX4MJW2YIE','ACCESS','molee@mail.com'),(88,'2025-08-07 12:19:26.973365',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDUzNjc2NiwiZXhwIjoxNzU1MTQxNTY2fQ.zLfvJBnmZONDNZJWMy9-Hp7bXCA68zedbISIDGQR43Q','REFRESH','molee@mail.com'),(89,'2025-08-07 15:06:36.916777',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDY3OTYsImV4cCI6MTc1NTE0Njc5Nn0.HP8PMkzt93O7PPCMhuihRbU5mwHgIc_1wUcv6pJoylA','ACCESS','wonjun@mail.com'),(90,'2025-08-07 15:06:36.918838',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDY3OTYsImV4cCI6MTc1NTE0Njc5Nn0.HP8PMkzt93O7PPCMhuihRbU5mwHgIc_1wUcv6pJoylA','ACCESS','wonjun@mail.com'),(91,'2025-08-07 15:06:36.965567',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDY3OTYsImV4cCI6MTc1NTE1MTU5Nn0._UFBzlVSHvduoLA-GVVGwb9GXDohZEVixTi_9O0D_dU','REFRESH','wonjun@mail.com'),(92,'2025-08-07 15:06:36.967761',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDY3OTYsImV4cCI6MTc1NTE1MTU5Nn0._UFBzlVSHvduoLA-GVVGwb9GXDohZEVixTi_9O0D_dU','REFRESH','wonjun@mail.com'),(93,'2025-08-07 15:25:52.171031',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDc5NTIsImV4cCI6MTc1NTE0Nzk1Mn0.mwfFp3CCq-qJZQ213Y70o3KwjsRKO2akgKRTlxpNv4U','ACCESS','wonjun@mail.com'),(94,'2025-08-07 15:25:52.180873',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDc5NTIsImV4cCI6MTc1NTE1Mjc1Mn0.GRmSE85HhQWYJ-mBwkwme1AJJkNSW5K3aeN5KexjHvU','REFRESH','wonjun@mail.com'),(95,'2025-08-07 15:25:54.406020',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDc5NTQsImV4cCI6MTc1NTE0Nzk1NH0._xvygJxL4wPCa67EtURVKz5KK4r2Jjs3d-duFH92ROg','ACCESS','wonjun@mail.com'),(96,'2025-08-07 15:25:54.415627',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDc5NTQsImV4cCI6MTc1NTE1Mjc1NH0.pYsl6XBSFid7KGS7zvoCxpVCcN0_ZkEHkQsuY0L0HXo','REFRESH','wonjun@mail.com'),(97,'2025-08-07 15:40:40.783374',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDg4NDAsImV4cCI6MTc1NTE0ODg0MH0.Ln8BIY70R_b-ciJ4Z4-5yVhgcnlsgqEoVPSIeF3pudo','ACCESS','wonjun@mail.com'),(98,'2025-08-07 15:40:40.823028',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDg4NDAsImV4cCI6MTc1NTE1MzY0MH0._ofHoKVO9pqOvpzRWxh78vq_8dB84MhQKqPyZTjvTxI','REFRESH','wonjun@mail.com'),(99,'2025-08-07 15:40:47.546971',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDg4NDcsImV4cCI6MTc1NTE0ODg0N30.VR4bPFDaGB8OqMjmj407cTmSQ-fWhVcJvOqvdvi2ZaU','ACCESS','wonjun@mail.com'),(100,'2025-08-07 15:40:47.557388',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDg4NDcsImV4cCI6MTc1NTE1MzY0N30.1eDJy6hstcgIMHeWBqNs72Hiekh7lU3yKFX8SRsEvrE','REFRESH','wonjun@mail.com'),(101,'2025-08-07 15:40:51.807894',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDg4NTEsImV4cCI6MTc1NTE0ODg1MX0.8AcLMINNc1UO9V-vxQAHtdFZUOi0pOG-UpDt5OW80YI','ACCESS','wonjun@mail.com'),(102,'2025-08-07 15:40:51.818260',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDg4NTEsImV4cCI6MTc1NTE1MzY1MX0.oOdzh58yhhVwExVEqa1NBSzuHyEmyzUpOBTQBIls1HI','REFRESH','wonjun@mail.com'),(103,'2025-08-07 15:40:53.578775',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDg4NTMsImV4cCI6MTc1NTE0ODg1M30.hTqKewD4tsRs3irg_PXQn5O40OpYrZPPFQGlznQa2GU','ACCESS','wonjun@mail.com'),(104,'2025-08-07 15:40:53.588295',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDg4NTMsImV4cCI6MTc1NTE1MzY1M30.y2PWWX_fF6fu-6VIvIRage6NTQacCcZUPWjKgDKV4kI','REFRESH','wonjun@mail.com'),(105,'2025-08-07 15:40:55.698066',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDg4NTUsImV4cCI6MTc1NTE0ODg1NX0.aBV3Qf1QUqSWIMsBLApw6B92FgeSGFX70zB664xNSeA','ACCESS','wonjun@mail.com'),(106,'2025-08-07 15:40:55.707210',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDg4NTUsImV4cCI6MTc1NTE1MzY1NX0.yAx2pyE0TNz6XG9LFfeQaD8NxbvUIlbF6vb-UjG74GY','REFRESH','wonjun@mail.com'),(107,'2025-08-07 15:40:56.994001',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDg4NTYsImV4cCI6MTc1NTE0ODg1Nn0.khXiz8o-hVKluwXfjrA7iI2Ba6DsaIZ7ScyrZaWY1E8','ACCESS','wonjun@mail.com'),(108,'2025-08-07 15:40:57.015594',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDg4NTYsImV4cCI6MTc1NTE1MzY1Nn0.JuOnc2HzLsteBd7XGpZKurOUfdbya-H7uczozpOWRgA','REFRESH','wonjun@mail.com'),(109,'2025-08-07 15:41:54.384670',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NDg5MTQsImV4cCI6MTc1NTE0ODkxNH0.9NlmGTHUNTzk8a0DK--fWX1I5zeb2lHsSjbag7oCpXE','ACCESS','wonjun@mail.com'),(110,'2025-08-07 15:41:54.393428',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NDg5MTQsImV4cCI6MTc1NTE1MzcxNH0.Qk-3FxvHzAaeLEAgDX4xju1tSTz5KbeQm54ZXk_ZDBQ','REFRESH','wonjun@mail.com'),(111,'2025-08-07 17:09:46.843462',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ1NTQxODYsImV4cCI6MTc1NTE1NDE4Nn0.Tyu7EmF4WlF38ytP8E8zxuSKk-hlwFdX1V6mRNAsSFc','ACCESS','wonjun@mail.com'),(112,'2025-08-07 17:09:46.887933',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NTQxODYsImV4cCI6MTc1NTE1ODk4Nn0.kGV-AlTnwq8mBvuHPBErPSxtpoEu0LwX992VW6gQNnw','REFRESH','wonjun@mail.com'),(113,'2025-08-07 17:26:11.734815',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ1NTUxNzEsImV4cCI6MTc1NTE1NTE3MX0.O89ZTeWeEnDenCeiHoaru2gMeg7QzVW5NTlksc2OMHg','ACCESS','tw_k7@naver.com'),(114,'2025-08-07 17:26:11.743272',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ1NTUxNzEsImV4cCI6MTc1NTE1OTk3MX0.JtO-NX29_PEGyd421QZY0Z0tFf9y6e8pRtJF6lqcV0o','REFRESH','tw_k7@naver.com'),(115,'2025-08-08 09:20:10.817348',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MTI0MTAsImV4cCI6MTc1NTIxMjQxMH0.3hxJsFuU3yaRW13Py10bD41qlzumLcYPWB3pUix2DPE','ACCESS','wonjun@mail.com'),(116,'2025-08-08 09:20:10.830122',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MTI0MTAsImV4cCI6MTc1NTIxNzIxMH0._YVv714QkSTaDYHDhQPXOVVbudjxrCfHhOCJgJLWyco','REFRESH','wonjun@mail.com'),(117,'2025-08-08 09:20:11.880375',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MTI0MTEsImV4cCI6MTc1NTIxMjQxMX0.aDA-bxA07lwfpBM8Sx3NGUjZhR7L67Fn1gIgJBiePZM','ACCESS','wonjun@mail.com'),(118,'2025-08-08 09:20:11.889821',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MTI0MTEsImV4cCI6MTc1NTIxNzIxMX0.GGJd5b37AdkkhuQ6zH8JIGk-7-yGgL8XxD7MBoOREto','REFRESH','wonjun@mail.com'),(119,'2025-08-08 10:49:19.077026',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ2MTc3NTksImV4cCI6MTc1NTIxNzc1OX0.jbmmTOpd4dKCMg5_tDcYFcQE2ofejnTRJV8nnzYADMs','ACCESS','leejiun0102@naver.com'),(120,'2025-08-08 10:49:19.111723',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MTc3NTksImV4cCI6MTc1NTIyMjU1OX0.f_pjWwuxEIj48136-TBcJd1V0khX7UHL4cdQ2h570OI','REFRESH','leejiun0102@naver.com'),(121,'2025-08-08 10:49:20.395769',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ2MTc3NjAsImV4cCI6MTc1NTIxNzc2MH0.ITWjQyfn_tV8lw3HRzkH-tBOSbC3T6pdSYWEdHTn96c','ACCESS','leejiun0102@naver.com'),(122,'2025-08-08 10:49:20.404579',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MTc3NjAsImV4cCI6MTc1NTIyMjU2MH0.uK2s1USglJqf31LG_CPtD5KC4hhtBGMSHAcA0DRvwG0','REFRESH','leejiun0102@naver.com'),(123,'2025-08-08 11:34:03.631654',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MjA0NDMsImV4cCI6MTc1NTIyMDQ0M30.4PCFc5eazqS5xobgbNHOms8w2loMjPLmXiZ-URqAolY','ACCESS','wonjun@mail.com'),(124,'2025-08-08 11:34:03.640665',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjA0NDMsImV4cCI6MTc1NTIyNTI0M30.DkmsRz7q5Qih4rRIT4R-vMuwjheCBQ4vuuX9kpfEKUQ','REFRESH','wonjun@mail.com'),(125,'2025-08-08 11:42:36.369791',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ2MjA5NTYsImV4cCI6MTc1NTIyMDk1Nn0.1yGCqhCdmvxCB_raglF6la5q_hDBC7BtI91Hsu5K7yM','ACCESS','tw_k7@naver.com'),(126,'2025-08-08 11:42:36.379396',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjA5NTYsImV4cCI6MTc1NTIyNTc1Nn0.OV-zCdWDwkhjQt5p2RlguwDk7xnPlXtfy8f0DKD6Koc','REFRESH','tw_k7@naver.com'),(127,'2025-08-08 11:52:31.500099',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDYyMTU1MSwiZXhwIjoxNzU1MjIxNTUxfQ.2wf7LUAWXPhB9NOUQ-uKK7duZuJhp_KDTXnQTjMLOPM','ACCESS','molee@mail.com'),(128,'2025-08-08 11:52:31.508863',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDYyMTU1MSwiZXhwIjoxNzU1MjI2MzUxfQ.-fLFYpcgg-qs3Eq6LhuBSWgrShGpFKqYcG_BfDmovIA','REFRESH','molee@mail.com'),(129,'2025-08-08 11:53:25.346062',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MjE2MDUsImV4cCI6MTc1NTIyMTYwNX0.R6YxCQ7VyN3r2H6gPKJe35pBc_-9EsBQnZSSlcl879Y','ACCESS','wonjun@mail.com'),(130,'2025-08-08 11:53:25.354833',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjE2MDUsImV4cCI6MTc1NTIyNjQwNX0.qJQtlJxTh763D4gbagwDFsXo9vN-wfTKwg74vtiC6IE','REFRESH','wonjun@mail.com'),(131,'2025-08-08 12:11:51.935094',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ2MjI3MTEsImV4cCI6MTc1NTIyMjcxMX0.sAaA3upsrZy_qfmRoCKbGAYFVylKkXccGVzOYs_pfGU','ACCESS','tw_k7@naver.com'),(132,'2025-08-08 12:11:51.971775',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjI3MTEsImV4cCI6MTc1NTIyNzUxMX0.rnEVRE6qlDCNAyN46r45_RdODlcpumeUg-iinCGgvu0','REFRESH','tw_k7@naver.com'),(133,'2025-08-08 12:13:04.211696',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MjI3ODQsImV4cCI6MTc1NTIyMjc4NH0.uZosWIUTl06wDM0TqbFFSvSWadu69-8IiSuS_M5wQ8E','ACCESS','wonjun@mail.com'),(134,'2025-08-08 12:13:04.221691',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjI3ODQsImV4cCI6MTc1NTIyNzU4NH0.ke9Nbr_ISjdckAjRtuUHsJPgsAnv5j-sGH-ijSI2Qms','REFRESH','wonjun@mail.com'),(135,'2025-08-08 12:31:01.786247',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MjM4NjEsImV4cCI6MTc1NTIyMzg2MX0.45OCIYUqcHF1yEHFj8szB6Ds-R-lpwrEcItDI1xDpic','ACCESS','wonjun@mail.com'),(136,'2025-08-08 12:31:01.795349',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjM4NjEsImV4cCI6MTc1NTIyODY2MX0.o3841OEIjZNdmj9KngjjrapP0tgN0Et1CspSF8jeo0g','REFRESH','wonjun@mail.com'),(137,'2025-08-08 12:34:32.557621',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MjQwNzIsImV4cCI6MTc1NTIyNDA3Mn0.s03VQXa5iZIGrSftlTS6oyu6OPOiw13NFXv-Wrbemgg','ACCESS','wonjun@mail.com'),(138,'2025-08-08 12:34:32.567034',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjQwNzIsImV4cCI6MTc1NTIyODg3Mn0.zp-FyIHQ8IWxG9jK69OUf-V4MpzDpYcouBAdKVLv_lM','REFRESH','wonjun@mail.com'),(139,'2025-08-08 12:37:22.693520',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MjQyNDIsImV4cCI6MTc1NTIyNDI0Mn0.SEG8cllUYNQIJWg0EikCq1R3JawzZJZdaQUT3XNCh4o','ACCESS','wonjun@mail.com'),(140,'2025-08-08 12:37:22.701692',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MjQyNDIsImV4cCI6MTc1NTIyOTA0Mn0.Ttf3NTXWbUC0qGaAuQkMG3SV4fZdv3Km05TKGj6kcdQ','REFRESH','wonjun@mail.com'),(141,'2025-08-08 14:16:51.912557',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDYzMDIxMSwiZXhwIjoxNzU1MjMwMjExfQ.n9RXEzCDX1MCmICHzM9nVaEV91fnG-WY69R9ZjlTmdg','ACCESS','molee@mail.com'),(142,'2025-08-08 14:16:51.954260',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDYzMDIxMSwiZXhwIjoxNzU1MjM1MDExfQ.9xococ0G7bJwIpnudcq9M-gY4IqZ39N6QuhV8L0nMac','REFRESH','molee@mail.com'),(143,'2025-08-08 14:20:01.437682',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IlJPTEVfU1RVREVOVCIsImlhdCI6MTc1NDYzMDQwMSwiZXhwIjoxNzU1MjMwNDAxfQ.mKuC6Wo6eGEzy6x_3sMRtyZ_278vnkdf9pfzrbb7_wQ','ACCESS','molee@mail.com'),(144,'2025-08-08 14:20:01.476866',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im1vbGVlQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDYzMDQwMSwiZXhwIjoxNzU1MjM1MjAxfQ.AARZpSCAwQ8rBue9PDF0PZp1k7yeVtcVAEZaozuREEA','REFRESH','molee@mail.com'),(145,'2025-08-08 15:05:46.755088',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MzMxNDYsImV4cCI6MTc1NTIzMzE0Nn0.86Lkw9H5PzleefrgPH9He3ceZHKBhPAhwuaP3Meg_Z0','ACCESS','wonjun@mail.com'),(146,'2025-08-08 15:05:46.764404',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MzMxNDYsImV4cCI6MTc1NTIzNzk0Nn0.LPKfKHhAAVd40IvvYlfLl7aTbL6cMvplU-1Kg97WwbY','REFRESH','wonjun@mail.com'),(147,'2025-08-08 15:05:48.003767',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MzMxNDgsImV4cCI6MTc1NTIzMzE0OH0.T_FOqXt6WvmsceMT3NPwnycJm3T27Fr3ecesrZABPH4','ACCESS','wonjun@mail.com'),(148,'2025-08-08 15:05:48.014106',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MzMxNDgsImV4cCI6MTc1NTIzNzk0OH0.Ci152eKDzkVrrLBIkHM_swj8HW5Vo1yyHnYDFFzgQ3s','REFRESH','wonjun@mail.com'),(149,'2025-08-08 15:21:08.461452',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MzQwNjgsImV4cCI6MTc1NTIzNDA2OH0.Z8qc_0Y78UL3yNXK-dj7X960OjDu5f5IYJjhmEJkVi0','ACCESS','wonjun@mail.com'),(150,'2025-08-08 15:21:08.472691',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MzQwNjgsImV4cCI6MTc1NTIzODg2OH0.sFMGD0gpnHe502NkavSM-ZtH90i0ctinE0mdjPI5DIQ','REFRESH','wonjun@mail.com'),(151,'2025-08-08 15:26:07.649530',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2MzQzNjcsImV4cCI6MTc1NTIzNDM2N30.pe2RNQxe8MjV4szLnwe5I9aRZzLF3TA3NvJHUDv_wVQ','ACCESS','wonjun@mail.com'),(152,'2025-08-08 15:26:07.684926',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MzQzNjcsImV4cCI6MTc1NTIzOTE2N30.loT9yW4NbmN60DYsPKz7d5wbW5J6pjEVMkAvhDP3U7E','REFRESH','wonjun@mail.com'),(153,'2025-08-08 15:27:00.426957',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ2MzQ0MjAsImV4cCI6MTc1NTIzNDQyMH0.xaAu1aPX11GtPMQ3e4YW3jnszYw5fvr6fN1dwzz__sM','ACCESS','leejiun0102@naver.com'),(154,'2025-08-08 15:27:00.436803',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZWppdW4wMTAyQG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2MzQ0MjAsImV4cCI6MTc1NTIzOTIyMH0.4TdSIqMsc3C5xZT2S4aq0rb5zlE3lo65kaHW87Rx62Y','REFRESH','leejiun0102@naver.com'),(155,'2025-08-08 17:26:59.507206',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ2NDE2MTksImV4cCI6MTc1NTI0MTYxOX0.rchhjtPVTx2uUttIpm0OYdq55kw20ohlJqJQm43Q_7s','ACCESS','tw_k7@naver.com'),(156,'2025-08-08 17:26:59.542268',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2NDE2MTksImV4cCI6MTc1NTI0NjQxOX0.X6dwcMSpBiwOuUrf9o7coVj4QY5Rq2ZeBAUK-er2ldU','REFRESH','tw_k7@naver.com'),(157,'2025-08-08 17:27:28.571032',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2NDE2NDgsImV4cCI6MTc1NTI0MTY0OH0.3xLuQZmbONGm7p4kzGCvoDIK69k_ElY006lJfke6KxU','ACCESS','wonjun@mail.com'),(158,'2025-08-08 17:27:28.579846',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2NDE2NDgsImV4cCI6MTc1NTI0NjQ0OH0.hBw_08KguYLMAUg4rz-Qsd8KjmwHFvXfdHvFRBim01A','REFRESH','wonjun@mail.com'),(159,'2025-08-08 20:45:57.007154',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ2NTM1NTcsImV4cCI6MTc1NTI1MzU1N30.eHiY6zyVooLg1cwqPYEfCE4xXj_5Js1hhoO0MKCurUM','ACCESS','wonjun@mail.com'),(160,'2025-08-08 20:45:57.017238',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ2NTM1NTcsImV4cCI6MTc1NTI1ODM1N30.YJuiBX0SfMGCrESQT2mSo6QVbByLKs8vhZ4r-iDxrBE','REFRESH','wonjun@mail.com'),(161,'2025-08-09 16:38:11.238850',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ3MjUwOTEsImV4cCI6MTc1NTMyNTA5MX0.bZvpGwYSWHtYEVWifg_y9eq9BYKuQm-OVfIEXhWUgIs','ACCESS','tw_k7@naver.com'),(162,'2025-08-09 16:38:11.275265',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3MjUwOTEsImV4cCI6MTc1NTMyOTg5MX0.3dhz_m2zutfUfXL7jqA8aMnWkEvVHF-luYuVEj4bwBY','REFRESH','tw_k7@naver.com'),(163,'2025-08-09 20:56:06.923145',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NDA1NjYsImV4cCI6MTc1NTM0MDU2Nn0.rG-pgGu-HERQWnVjSlOKjpS4lLXImTth3nQrMI04qgs','ACCESS','wonjun@mail.com'),(164,'2025-08-09 20:56:06.956041',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NDA1NjYsImV4cCI6MTc1NTM0NTM2Nn0.f71vCcexhgOGX-jrtnbFyVhkfJEoguTEEReeS9UEgyU','REFRESH','wonjun@mail.com'),(165,'2025-08-09 21:02:00.753464',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ3NDA5MjAsImV4cCI6MTc1NTM0MDkyMH0.Z2nq52r_ic0KW5bOM9nP5F8k5ObZZx0QEnlkkh8Mzic','ACCESS','tw_k7@naver.com'),(166,'2025-08-09 21:02:00.762165',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NDA5MjAsImV4cCI6MTc1NTM0NTcyMH0.Jxox7rZRQtfs9qhGYQ6XkOL9k_c3SKs4LoaiJd3bTmk','REFRESH','tw_k7@naver.com'),(167,'2025-08-09 22:31:47.770942',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NDYzMDcsImV4cCI6MTc1NTM0NjMwN30.2lfaVAMBdfZmQLspDblUmlzzPwSSLtU0Z5vgQyUABpg','ACCESS','wonjun@mail.com'),(168,'2025-08-09 22:31:47.807666',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NDYzMDcsImV4cCI6MTc1NTM1MTEwN30.mPQlfSBymW5tIIuD-DOQYqLp-Pq-a3TdOvaO-Fz9lLA','REFRESH','wonjun@mail.com'),(169,'2025-08-09 23:17:48.643948',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NDkwNjgsImV4cCI6MTc1NTM0OTA2OH0._aUh-9oV42xgi5CGVKh7mMVkeloKkG_IYvCM6Ekn7SM','ACCESS','wonjun@mail.com'),(170,'2025-08-09 23:17:48.653075',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NDkwNjgsImV4cCI6MTc1NTM1Mzg2OH0.YuVWInDxBuzNjT4yJ0jHFAx2JPO7jCfWzbqkjJ4O1z4','REFRESH','wonjun@mail.com'),(171,'2025-08-09 23:36:00.555906',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NTAxNjAsImV4cCI6MTc1NTM1MDE2MH0.FJ19G_Xd5whVseZ0IlvautF-J1ml9VZ_55Yqq_zsQ7k','ACCESS','wonjun@mail.com'),(172,'2025-08-09 23:36:00.565802',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NTAxNjAsImV4cCI6MTc1NTM1NDk2MH0.9YgIe96f-hvDBkUXs7h2k23ZKuHWPNHXVbtILAGgv54','REFRESH','wonjun@mail.com'),(173,'2025-08-09 23:36:11.674229',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NTAxNzEsImV4cCI6MTc1NTM1MDE3MX0.3vYTvP5K9MK5Y1aTin9Gf-N6084WynsArsbIcmcrmtU','ACCESS','wonjun@mail.com'),(174,'2025-08-09 23:36:11.682996',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NTAxNzEsImV4cCI6MTc1NTM1NDk3MX0.WAjMathAc8yCfaC7n-jBtrwZyQ44m2TyYHt0UWGh_6o','REFRESH','wonjun@mail.com'),(175,'2025-08-09 23:36:23.097237',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NTAxODMsImV4cCI6MTc1NTM1MDE4M30.or2bt5O_SyIlm5YjdpOsK8sw8c4I743tQC8i6uqsO1g','ACCESS','wonjun@mail.com'),(176,'2025-08-09 23:36:23.106177',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NTAxODMsImV4cCI6MTc1NTM1NDk4M30.ut-R9QslxBrcWhvGacjdwgat8lm1Rqx4i2LN3UwCDcQ','REFRESH','wonjun@mail.com'),(177,'2025-08-09 23:41:38.379221',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NTA0OTgsImV4cCI6MTc1NTM1MDQ5OH0.8sWvMjQiL8vCvwddKVsJz-Kn5vbXzDUIlydVZcSNMWQ','ACCESS','wonjun@mail.com'),(178,'2025-08-09 23:41:38.387766',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NTA0OTgsImV4cCI6MTc1NTM1NTI5OH0.FIrQ1wOB-vNOV7ZNMhUA4aN62V_uPgzsVRKuVA8MyM4','REFRESH','wonjun@mail.com'),(179,'2025-08-10 00:47:18.210595',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ3NTQ0MzgsImV4cCI6MTc1NTM1NDQzOH0.47QkgKiu4GiYxQxrIU-fQBHAseerAk2E4xPNEU2ENtY','ACCESS','wonjun@mail.com'),(180,'2025-08-10 00:47:18.245022',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3NTQ0MzgsImV4cCI6MTc1NTM1OTIzOH0.-GRuiFDVJf7DaGUM-L0CxJT3dZ6GObacCBPk7WZf1_8','REFRESH','wonjun@mail.com'),(181,'2025-08-10 13:20:13.012423',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ3OTk2MTIsImV4cCI6MTc1NTM5OTYxMn0.12LQDBuZE-Ntom5hcZiV0nk_beUXozclXJCEViFEWVs','ACCESS','tw_k7@naver.com'),(182,'2025-08-10 13:20:13.049105',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ3OTk2MTMsImV4cCI6MTc1NTQwNDQxM30.bCq-3-60uKqVrhvpXuJyT_IOHF-7bgogspgL47_QKeQ','REFRESH','tw_k7@naver.com'),(183,'2025-08-10 17:45:27.867537',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ4MTU1MjcsImV4cCI6MTc1NTQxNTUyN30.3T7HFDqiwJCzI1UgVlOJn35tM0lIhZCKhaLHsKLOdrA','ACCESS','tw_k7@naver.com'),(184,'2025-08-10 17:45:27.876905',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MTU1MjcsImV4cCI6MTc1NTQyMDMyN30.59d1uVNw-bliMygb6aS8GFOy6a0qV9kOTHCzO3CNz6U','REFRESH','tw_k7@naver.com'),(185,'2025-08-10 17:52:41.291972',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ4MTU5NjEsImV4cCI6MTc1NTQxNTk2MX0.l6GeA8x7iwdEi_8Qbsmhk1ClpnEoI08gapq_AdIM9vA','ACCESS','tw_k7@naver.com'),(186,'2025-08-10 17:52:41.301020',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MTU5NjEsImV4cCI6MTc1NTQyMDc2MX0.M65pTS6AgwIQXESRJUAHGjGSwwEMs6I9-dX_xCMCD3Y','REFRESH','tw_k7@naver.com'),(187,'2025-08-10 19:10:02.203171',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4MjA2MDIsImV4cCI6MTc1NTQyMDYwMn0.r8PJ8T-NwIXSGYLnQWviGRQCWwx31BuHD8Ks4rfczFs','ACCESS','wonjun@mail.com'),(188,'2025-08-10 19:10:02.212067',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MjA2MDIsImV4cCI6MTc1NTQyNTQwMn0.521ulgp-QBVqkSk2rNRbrV3MPoY30qXff7O4u6ZgsDQ','REFRESH','wonjun@mail.com'),(189,'2025-08-10 19:35:48.219257',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN1bnNoaW5lbW9vbmdpdEBnbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9TVFVERU5UIiwiaWF0IjoxNzU0ODIyMTQ4LCJleHAiOjE3NTU0MjIxNDh9.iyi55vbT3Eg_HwLCnJHRzUZF_orB1MBFwKq5jlYmM54','ACCESS','sunshinemoongit@gmail.com'),(190,'2025-08-10 19:35:48.227465',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN1bnNoaW5lbW9vbmdpdEBnbWFpbC5jb20iLCJyb2xlIjoiIiwiaWF0IjoxNzU0ODIyMTQ4LCJleHAiOjE3NTU0MjY5NDh9.nfOV7g9D3_kEx6VsO99QMcWe_1fsSURFYp6iaR71C9w','REFRESH','sunshinemoongit@gmail.com'),(191,'2025-08-10 20:23:53.210686',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4MjUwMzMsImV4cCI6MTc1NTQyNTAzM30.ERN_Kkq4FYTZSqFNluJ6ZriL2FpxtjkWZaegUlEGQc0','ACCESS','wonjun@mail.com'),(192,'2025-08-10 20:23:53.218537',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MjUwMzMsImV4cCI6MTc1NTQyOTgzM30.sBdBpIj5zEdVWwR7FF073FEuZ_V1tHeoDRYOnDNy0sA','REFRESH','wonjun@mail.com'),(193,'2025-08-10 21:48:20.478812',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ4MzAxMDAsImV4cCI6MTc1NTQzMDEwMH0.D7-UheLTn_c1JKDr5pLafcFRoXVgUeEr8aMHdRrJK8o','ACCESS','tw_k7@naver.com'),(194,'2025-08-10 21:48:20.488118',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MzAxMDAsImV4cCI6MTc1NTQzNDkwMH0.X9rrg_5ydTBdo9KlREoFoUTbSnlGcItfe8CI5GMX104','REFRESH','tw_k7@naver.com'),(195,'2025-08-10 22:47:48.885582',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ4MzM2NjgsImV4cCI6MTc1NTQzMzY2OH0.Ia2GBwN7PGrJ9nbk4C8961KvflL_AZO_6qgoQ1hNiY0','ACCESS','tw_k7@naver.com'),(196,'2025-08-10 22:47:48.894025',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MzM2NjgsImV4cCI6MTc1NTQzODQ2OH0.jAGuLaVNl-uKdOLTVeGva9KUkuOe7txC_BEn1a8F5b8','REFRESH','tw_k7@naver.com'),(197,'2025-08-10 23:19:02.596860',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4MzU1NDIsImV4cCI6MTc1NTQzNTU0Mn0.cvWs-gs3BMgVP57iUwgKX6CVNfwgl9Bj3OP6U5HDBEM','ACCESS','wonjun@mail.com'),(198,'2025-08-10 23:19:02.606370',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MzU1NDIsImV4cCI6MTc1NTQ0MDM0Mn0.IFLsP3hMXEQYGg094S9Nv9_ET8h-pmBTnu8Dx5ju5rs','REFRESH','wonjun@mail.com'),(199,'2025-08-10 23:19:27.313275',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4MzU1NjcsImV4cCI6MTc1NTQzNTU2N30.DYwaQJ-EnNi8jnfpYhQlBc0ezyEMjGavv9U3iW32N0k','ACCESS','wonjun@mail.com'),(200,'2025-08-10 23:19:27.321703',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MzU1NjcsImV4cCI6MTc1NTQ0MDM2N30.MVVIlImOn5MBFCFYlwF9k1zoGfY6BIGLAoVyN8Alf7o','REFRESH','wonjun@mail.com'),(201,'2025-08-10 23:26:17.967738',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4MzU5NzcsImV4cCI6MTc1NTQzNTk3N30.f4TXUdpkD_ElAXa2Ta9A3gVdCskq0dHABKgMdYrEnm4','ACCESS','wonjun@mail.com'),(202,'2025-08-10 23:26:17.976705',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MzU5NzcsImV4cCI6MTc1NTQ0MDc3N30.ziVTn7gEH4F1sId9oTclDtNINX2HlWebLBvTRSZ40YE','REFRESH','wonjun@mail.com'),(203,'2025-08-10 23:27:42.763115',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4MzYwNjIsImV4cCI6MTc1NTQzNjA2Mn0.IwkZAhTFxrn8DhSXyH__DeN7SnCj-Ph8SvrJDmzgaIk','ACCESS','wonjun@mail.com'),(204,'2025-08-10 23:27:42.771755',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4MzYwNjIsImV4cCI6MTc1NTQ0MDg2Mn0.dAKPeZg2lXmsgwenZCshwlWdAhKO8OYi3jHlGyCgZu8','REFRESH','wonjun@mail.com'),(205,'2025-08-11 02:14:58.896352',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ4NDYwOTgsImV4cCI6MTc1NTQ0NjA5OH0.iFCxvd7Vr4Nx4_he0p7tkXDs2nyAzwuD3K4B-zxVaPc','ACCESS','tw_k7@naver.com'),(206,'2025-08-11 02:14:58.930251',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4NDYwOTgsImV4cCI6MTc1NTQ1MDg5OH0.7Pzahh2qGAwVDC8LvI5mF6G7WWkIRcuecNizPSM7mGc','REFRESH','tw_k7@naver.com'),(207,'2025-08-11 03:08:31.723224',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4NDkzMTEsImV4cCI6MTc1NTQ0OTMxMX0.RzQGjytyBFzhPCWoX8N1BdvtAlgm2ToqmGKSgTon4bw','ACCESS','wonjun@mail.com'),(208,'2025-08-11 03:08:31.758804',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4NDkzMTEsImV4cCI6MTc1NTQ1NDExMX0.euP1t2GQUeF0w_OmAVgTTcUhNnQveDPLOYbYnUsXr4M','REFRESH','wonjun@mail.com'),(209,'2025-08-11 04:39:23.961126',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4NTQ3NjMsImV4cCI6MTc1NTQ1NDc2M30.PpYeQbsQUBNwCuITvnSlSl4CYq5TYD9R3YRfHp-Py_0','ACCESS','wonjun@mail.com'),(210,'2025-08-11 04:39:23.993088',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4NTQ3NjMsImV4cCI6MTc1NTQ1OTU2M30.m8Y1DcZwSnMgx6-yBmb_lK75gQGicJkkNhuykgEXA9Y','REFRESH','wonjun@mail.com'),(211,'2025-08-11 05:01:40.790444',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4NTYxMDAsImV4cCI6MTc1NTQ1NjEwMH0.E-u_2e8Q8WuGLLceQZ--B9lsKlZ2Wigph8rqg2J9t4I','ACCESS','wonjun@mail.com'),(212,'2025-08-11 05:01:40.799916',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4NTYxMDAsImV4cCI6MTc1NTQ2MDkwMH0.QcgmWiCFhrg4hQsphVspkwu8G3LWFL9Jg-glYuBQlLc','REFRESH','wonjun@mail.com'),(213,'2025-08-11 09:28:09.889946',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4NzIwODksImV4cCI6MTc1NTQ3MjA4OX0.J2FiicIhPwwz32Yrr3p6WuCVMhbZCMO0AbEx-w_FcfM','ACCESS','wonjun@mail.com'),(214,'2025-08-11 09:28:09.899908',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4NzIwODksImV4cCI6MTc1NTQ3Njg4OX0.62Y0GBnesAD7XIrs21ZxEcZ-0TTB2swA--_IChHc2bI','REFRESH','wonjun@mail.com'),(215,'2025-08-11 09:53:29.388681',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ4NzM2MDksImV4cCI6MTc1NTQ3MzYwOX0.G4ag-79FFddK0bcgoQ6Jd3jfCMtti7O74JXyLzNz-84','ACCESS','admin@mail.com'),(216,'2025-08-11 09:53:29.424519',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDg3MzYwOSwiZXhwIjoxNzU1NDc4NDA5fQ.VMOhg2bDN6KDcq6FGuxiIVzGP0DLqrWmPeyLglyd2tA','REFRESH','admin@mail.com'),(217,'2025-08-11 10:56:40.037231',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ4Nzc0MDAsImV4cCI6MTc1NTQ3NzQwMH0.kTJc5Ff-KZ74nf2RoG4d5U0pCXrlTKDQTZtSEoBVgMw','ACCESS','admin@mail.com'),(218,'2025-08-11 10:56:40.046907',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDg3NzQwMCwiZXhwIjoxNzU1NDgyMjAwfQ.XsXuP951H_DqqIpMVAoVau2OMOiJzFL_RUK3FkTvxQM','REFRESH','admin@mail.com'),(219,'2025-08-11 15:27:08.517925',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4OTM2MjgsImV4cCI6MTc1NTQ5MzYyOH0.pelH3RWPnUSpXG09jrOf2NDd3j1-PBFedVrRF9ZdEPw','ACCESS','wonjun@mail.com'),(220,'2025-08-11 15:27:08.552833',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4OTM2MjgsImV4cCI6MTc1NTQ5ODQyOH0.SYTJfzCSWG3xwz59f8aYrs-c5Emo1Znml4bK1F8_9i8','REFRESH','wonjun@mail.com'),(221,'2025-08-11 15:39:02.612004',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ4OTQzNDIsImV4cCI6MTc1NTQ5NDM0Mn0.ZNGd-BW5H6qn1sYFK0VLXENpoXJYc9cirBsaRilyl1o','ACCESS','tw_k7@naver.com'),(222,'2025-08-11 15:39:02.621595',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4OTQzNDIsImV4cCI6MTc1NTQ5OTE0Mn0.0ZB8nnXSrSQO8WlRAwaIC28YZP_49BnOLNRn61xiSlg','REFRESH','tw_k7@naver.com'),(223,'2025-08-11 15:46:06.393778',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4OTQ3NjYsImV4cCI6MTc1NTQ5NDc2Nn0.7n93PlMc3ApaHXQ8joQvH2lRrDMm7DNPyckYTUh-Da8','ACCESS','wonjun@mail.com'),(224,'2025-08-11 15:46:06.402965',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4OTQ3NjYsImV4cCI6MTc1NTQ5OTU2Nn0.89v85crMczmRlsseIKQQcRao0mpO4EW0uTOine3oaAs','REFRESH','wonjun@mail.com'),(225,'2025-08-11 17:04:28.805501',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ4OTk0NjgsImV4cCI6MTc1NTQ5OTQ2OH0.3carFfbkipzdvyy7k0mkIaJeJf8hc1GTatJzwdailHk','ACCESS','wonjun@mail.com'),(226,'2025-08-11 17:04:28.818603',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ4OTk0NjgsImV4cCI6MTc1NTUwNDI2OH0.NSJQU21tkXPa-eJv6wh_g5-R_AczAGOo7ddPRAF7Pr8','REFRESH','wonjun@mail.com'),(227,'2025-08-11 21:54:37.714739',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5MTY4NzcsImV4cCI6MTc1NTUxNjg3N30.KA8pAPnITdnrPnLPZqqQ-8-zbCITzetyIiPBSV7nTL0','ACCESS','wonjun@mail.com'),(228,'2025-08-11 21:54:37.723466',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5MTY4NzcsImV4cCI6MTc1NTUyMTY3N30.jSijQA_bUZjiOdmZgZRnJTq0fiTz8T5PnrS5rMJX06A','REFRESH','wonjun@mail.com'),(229,'2025-08-11 22:45:29.246604',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5MTk5MjksImV4cCI6MTc1NTUxOTkyOX0.q3RjZuDBtPE_ec-cArgjzts-_8hk3UwapMOwxAQiyfk','ACCESS','wonjun@mail.com'),(230,'2025-08-11 22:45:29.254404',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5MTk5MjksImV4cCI6MTc1NTUyNDcyOX0.Ca8FRXMWjM4Ha5iiluaTJZV_iHmBVJbSNzi34B-Ye_M','REFRESH','wonjun@mail.com'),(231,'2025-08-11 23:12:21.593606',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5MjE1NDEsImV4cCI6MTc1NTUyMTU0MX0.Da5h_-NR14ph2PGskEFhqvk6SA9y6Kf-V13mbAYbMXI','ACCESS','admin@mail.com'),(232,'2025-08-11 23:12:21.602406',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDkyMTU0MSwiZXhwIjoxNzU1NTI2MzQxfQ.BxiC1EJ1BDiqrLjItbONvwN942S17ohs01P-3NGW564','REFRESH','admin@mail.com'),(233,'2025-08-12 03:22:22.395317',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5MzY1NDIsImV4cCI6MTc1NTUzNjU0Mn0.Mlqsk0lRdxwbmaHhj13z2sNCBBcgFewnhkxP16bV2No','ACCESS','wonjun@mail.com'),(234,'2025-08-12 03:22:22.436203',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5MzY1NDIsImV4cCI6MTc1NTU0MTM0Mn0.ac8-xGaStdgC7p788VrIfzMTELluI1lZjPczAxidLnE','REFRESH','wonjun@mail.com'),(235,'2025-08-12 03:32:10.795032',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5MzcxMzAsImV4cCI6MTc1NTUzNzEzMH0.fuhMEC4sCqjH0rArHpDGaOL4iul9427ETqVbUO7zyeE','ACCESS','admin@mail.com'),(236,'2025-08-12 03:32:10.804219',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDkzNzEzMCwiZXhwIjoxNzU1NTQxOTMwfQ.GYbH_f_gRXYGeoqBkD1siKd-xalTxyh6Au9Z6h0NHu8','REFRESH','admin@mail.com'),(237,'2025-08-12 03:32:35.004683',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5MzcxNTUsImV4cCI6MTc1NTUzNzE1NX0.XcZVMUcpAvctWo2B1aARQBbc2xrmHjceb7XAFEu17E8','ACCESS','wonjun@mail.com'),(238,'2025-08-12 03:32:35.014926',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5MzcxNTUsImV4cCI6MTc1NTU0MTk1NX0.SZ3HgqjgIUx8ATj6I50DQfcP_FiexwSNt-sxkah1ltU','REFRESH','wonjun@mail.com'),(239,'2025-08-12 04:01:28.827842',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5Mzg4ODgsImV4cCI6MTc1NTUzODg4OH0.3sRbvw8SAGJPlFzYU7i800F6zC8tgyN3vLVHOLE4rvE','ACCESS','tw_k7@naver.com'),(240,'2025-08-12 04:01:28.836818',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5Mzg4ODgsImV4cCI6MTc1NTU0MzY4OH0.DR4KkJDKHQhejXP7-zJoNc9sV3dQka-RPmutLYxairo','REFRESH','tw_k7@naver.com'),(241,'2025-08-12 04:19:25.186929',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5Mzk5NjUsImV4cCI6MTc1NTUzOTk2NX0.Fp-sPhCbY6-quPyHzQxw7W1tBrZsDUWl1QDHy9DCFN0','ACCESS','wonjun@mail.com'),(242,'2025-08-12 04:19:25.197373',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5Mzk5NjUsImV4cCI6MTc1NTU0NDc2NX0.X-Fm_muxA538vi7PyB1cRBR3ZL_97JbyyDaqRXdtD24','REFRESH','wonjun@mail.com'),(243,'2025-08-12 04:49:22.378466',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NDE3NjIsImV4cCI6MTc1NTU0MTc2Mn0.Nosnuv3ikkSOJzIyLWmanU-bfixYKL6KIYVQYB9kLFE','ACCESS','wonjun@mail.com'),(244,'2025-08-12 04:49:22.409723',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NDE3NjIsImV4cCI6MTc1NTU0NjU2Mn0.kUmiE8CuxGgmhx9Wp6beW_YPgAp6g5DNtT7_GhmftrE','REFRESH','wonjun@mail.com'),(245,'2025-08-12 05:00:41.390370',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NDI0NDEsImV4cCI6MTc1NTU0MjQ0MX0.lOsy9FJFCjCC2-9XaojmXG0NYgVTuuWrmo9WLlMDPbw','ACCESS','wonjun@mail.com'),(246,'2025-08-12 05:00:41.399463',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NDI0NDEsImV4cCI6MTc1NTU0NzI0MX0.ecq0K5rCobsHFjWKrrY6a4Z5yM-KSbzqpbv2At7-kWg','REFRESH','wonjun@mail.com'),(247,'2025-08-12 05:12:22.928545',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NDMxNDIsImV4cCI6MTc1NTU0MzE0Mn0.NKMq1J6vyrZ3-USovgl7Nsy1ETcnn-spQ0q50wfimXo','ACCESS','wonjun@mail.com'),(248,'2025-08-12 05:12:22.937383',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NDMxNDIsImV4cCI6MTc1NTU0Nzk0Mn0.D3aA3Ekw9DDyj2pYdkTAgoJXEsLx7ojILR3oEyMhFL8','REFRESH','wonjun@mail.com'),(249,'2025-08-12 06:32:18.752244',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NDc5MzgsImV4cCI6MTc1NTU0NzkzOH0.WfAAmM33dlbW3evqDIG78xcYQjZAQKuh356nuPB5QJs','ACCESS','wonjun@mail.com'),(250,'2025-08-12 06:32:18.760191',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NDc5MzgsImV4cCI6MTc1NTU1MjczOH0.BG108HueYEkrlx-hI6_Czmxw3CjCoNfhuxm9SSH7E98','REFRESH','wonjun@mail.com'),(251,'2025-08-12 07:31:45.830489',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NTE1MDUsImV4cCI6MTc1NTU1MTUwNX0.33eTPcjz2e3cZJn0hL5S-x_CcMcOKUA8abXd2en8tFo','ACCESS','wonjun@mail.com'),(252,'2025-08-12 07:31:45.838603',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NTE1MDUsImV4cCI6MTc1NTU1NjMwNX0.1BunwoEkA2_Jd4GFj896FdiE4bJTy_obPvREQN-PW5E','REFRESH','wonjun@mail.com'),(253,'2025-08-12 08:07:16.008155',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NTM2MzYsImV4cCI6MTc1NTU1MzYzNn0.7iyQBKQkjVgsEtI-kKA_y8KTEDUcKx1x2mOkvZDOqIA','ACCESS','wonjun@mail.com'),(254,'2025-08-12 08:07:16.017151',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NTM2MzYsImV4cCI6MTc1NTU1ODQzNn0.vfI8PFCJ8uHPm8kMk8dG4f3AdiSIAgVia6TiXjHX9w0','REFRESH','wonjun@mail.com'),(255,'2025-08-12 08:08:28.900708',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5NTM3MDgsImV4cCI6MTc1NTU1MzcwOH0.B4nQvkt_8aklnRP0a42YzjIcIsw8ghFCAsh4qcgz1lQ','ACCESS','admin@mail.com'),(256,'2025-08-12 08:08:28.910262',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDk1MzcwOCwiZXhwIjoxNzU1NTU4NTA4fQ.htj7oMWfZfm2e35h2ieZr2lK-B4DAwug1S24WjZkTUI','REFRESH','admin@mail.com'),(257,'2025-08-12 09:14:56.470000',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NTc2OTYsImV4cCI6MTc1NTU1NzY5Nn0.p26eD3Pz0ZSEqo4M7qsVrQ05pxmW9zVtAIO5Sd2Aqp0','ACCESS','wonjun@mail.com'),(258,'2025-08-12 09:14:56.478917',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NTc2OTYsImV4cCI6MTc1NTU2MjQ5Nn0.JvnMxL0Hph5MSPmvVMVwiJ7TEf1dq93IQLKSlFL0Prc','REFRESH','wonjun@mail.com'),(259,'2025-08-12 09:14:58.018092',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NTc2OTgsImV4cCI6MTc1NTU1NzY5OH0.lbOs3fXtmliAZp_eKiZPTQntCMMlRRmT_zmjyVr-xrw','ACCESS','wonjun@mail.com'),(260,'2025-08-12 09:14:58.025846',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NTc2OTgsImV4cCI6MTc1NTU2MjQ5OH0.d3N-lhaB6eHIakJRlMEh4kpTwq4YtaLNa8jxMar9LXk','REFRESH','wonjun@mail.com'),(261,'2025-08-12 09:31:11.826722',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NTg2NzEsImV4cCI6MTc1NTU1ODY3MX0.xMJb3UtFGYObipbv969SsCDwuTni1PCZEONuWUuR0WU','ACCESS','wonjun@mail.com'),(262,'2025-08-12 09:31:11.835123',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NTg2NzEsImV4cCI6MTc1NTU2MzQ3MX0.svDzFaRL_eohyegxA0jt_yAwBV20eh_OxtXUT39tkPQ','REFRESH','wonjun@mail.com'),(263,'2025-08-12 09:31:13.039189',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NTg2NzMsImV4cCI6MTc1NTU1ODY3M30.vTIaVs6yd2LFp-W9MWktZDnKEIHZ0bosMwP9AiBeI7g','ACCESS','wonjun@mail.com'),(264,'2025-08-12 09:31:13.047460',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NTg2NzMsImV4cCI6MTc1NTU2MzQ3M30.d1PI2S8Np7RYXg0zOYKCEVhWATN0kaCHST9fPITMLAw','REFRESH','wonjun@mail.com'),(265,'2025-08-12 10:37:35.567049',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5NjI2NTUsImV4cCI6MTc1NTU2MjY1NX0.hUj8Gu0SLVRxTprj6NZCwcjDGXHyD3mZ-9VzKTrksEI','ACCESS','tw_k7@naver.com'),(266,'2025-08-12 10:37:35.580336',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjI2NTUsImV4cCI6MTc1NTU2NzQ1NX0.uRZAzzdlhqpHzU0XJCf3ITzTpH0LVajzpzSWFex6ZY0','REFRESH','tw_k7@naver.com'),(267,'2025-08-12 10:43:51.482850',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NjMwMzEsImV4cCI6MTc1NTU2MzAzMX0.l9M7Hw2bwQwfQ5O_UH5P1BDYHr4PLNQiZonwGZHLv68','ACCESS','wonjun@mail.com'),(268,'2025-08-12 10:43:51.522326',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjMwMzEsImV4cCI6MTc1NTU2NzgzMX0.pedxyTlqCGeIxGj77ugeJ9fhjBR0gtYCJ9h9Rm9TyrA','REFRESH','wonjun@mail.com'),(269,'2025-08-12 10:55:27.442806',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5NjM3MjcsImV4cCI6MTc1NTU2MzcyN30.qNZDAXzOKTgp0z3K9ykXGH3ijBPzPnXh1BsPuxg96GA','ACCESS','tw_k7@naver.com'),(270,'2025-08-12 10:55:27.475285',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjM3MjcsImV4cCI6MTc1NTU2ODUyN30.I4oS3bW6fgO5JX24XBWcTGBVv56s2dB9xZ11OHhZsgg','REFRESH','tw_k7@naver.com'),(271,'2025-08-12 11:11:33.521789',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NjQ2OTMsImV4cCI6MTc1NTU2NDY5M30.tLe8XDTOUSCCuTT9HUnJTSoIwbdImQ9IG787-wd79QU','ACCESS','wonjun@mail.com'),(272,'2025-08-12 11:11:33.557368',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjQ2OTMsImV4cCI6MTc1NTU2OTQ5M30.NYd0K29ZWeIvtg-pwJgBcoqdIyfOsnjg0UnMMPfsGM0','REFRESH','wonjun@mail.com'),(273,'2025-08-12 11:19:44.351594',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5NjUxODQsImV4cCI6MTc1NTU2NTE4NH0.cdQh93_SgGvACtpxz8DF8r1XRXVGcot3B3G4s7vZkFQ','ACCESS','tw_k7@naver.com'),(274,'2025-08-12 11:19:44.386383',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjUxODQsImV4cCI6MTc1NTU2OTk4NH0.zPfU_WV4ElsAtqb4rKj6UH88a_QTY_h2SCdfkVsnTVg','REFRESH','tw_k7@naver.com'),(275,'2025-08-12 11:25:39.303645',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5NjU1MzksImV4cCI6MTc1NTU2NTUzOX0.UvpTXaUDqc2k9wxQtEFurvsm3V6kkwyeZDHYJvY6x64','ACCESS','admin@mail.com'),(276,'2025-08-12 11:25:39.313438',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDk2NTUzOSwiZXhwIjoxNzU1NTcwMzM5fQ.lcy-KwVy9309y5rmAoqY4eF0C3UxukmyWmqOh5ZI9No','REFRESH','admin@mail.com'),(277,'2025-08-12 11:37:43.121176',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5NjYyNjMsImV4cCI6MTc1NTU2NjI2M30.wQS11zWNWGx76m-DoFbafIUeeW1dvYlaZ3bFyTc19CA','ACCESS','tw_k7@naver.com'),(278,'2025-08-12 11:37:43.155323',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjYyNjMsImV4cCI6MTc1NTU3MTA2M30.HS_5ajeHzouhR9pV7hKI0xh2-9rxNoZZn9HPE7aCwkQ','REFRESH','tw_k7@naver.com'),(279,'2025-08-12 12:02:52.740439',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5Njc3NzIsImV4cCI6MTc1NTU2Nzc3Mn0.je0HVwA8I6NIbeI1iDJAY47QZ_HpINJkm7z3ZR9_B2U','ACCESS','tw_k7@naver.com'),(280,'2025-08-12 12:02:52.776559',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5Njc3NzIsImV4cCI6MTc1NTU3MjU3Mn0.6KZJ8kolvDuwy2UlLWzL5EpNCZm3pECSom2Z7Yj3k_E','REFRESH','tw_k7@naver.com'),(281,'2025-08-12 12:07:01.823693',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NjgwMjEsImV4cCI6MTc1NTU2ODAyMX0.V1gLkSZ231HxIL7a5urP-Uhg3YJw4IyKhmU8ll5txVc','ACCESS','wonjun@mail.com'),(282,'2025-08-12 12:07:01.833161',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjgwMjEsImV4cCI6MTc1NTU3MjgyMX0.LqcZxrw-xInxuS66A34s9EEGGwHFMy1VbbGZywVpp9A','REFRESH','wonjun@mail.com'),(283,'2025-08-12 12:07:15.517885',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NjgwMzUsImV4cCI6MTc1NTU2ODAzNX0.QU3CxVr31IpElUMSq7EJIp_A7ikf2aolRJfCmeCPn3k','ACCESS','wonjun@mail.com'),(284,'2025-08-12 12:07:15.526348',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjgwMzUsImV4cCI6MTc1NTU3MjgzNX0.er1LI-C9AFI2BGpaifM--YP-zrq2-C0-7dl--7pYpNM','REFRESH','wonjun@mail.com'),(285,'2025-08-12 12:07:35.832280',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NjgwNTUsImV4cCI6MTc1NTU2ODA1NX0.c_c2J0ELzH0c9fPVPT5MtnGcO2DUB2_v3AfR-s8FeFc','ACCESS','wonjun@mail.com'),(286,'2025-08-12 12:07:35.840667',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NjgwNTUsImV4cCI6MTc1NTU3Mjg1NX0.7VacMIErSGkcRDHeeH6EgcXULaQtMxHT6OYZS1Xs3EQ','REFRESH','wonjun@mail.com'),(287,'2025-08-12 12:19:22.234652',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5Njg3NjIsImV4cCI6MTc1NTU2ODc2Mn0.hiywCu1uK6zSAjMInDpO7gE5HnhBHFhxqeoGHPhRyZk','ACCESS','wonjun@mail.com'),(288,'2025-08-12 12:19:22.270023',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5Njg3NjIsImV4cCI6MTc1NTU3MzU2Mn0.6JF2SZ6K9C0AMaSGbSQxjjlsU_lTkt36dtaq3ke-Efo','REFRESH','wonjun@mail.com'),(289,'2025-08-12 12:21:00.576390',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5Njg4NjAsImV4cCI6MTc1NTU2ODg2MH0.LWyQHRZ_5rqLhsli5diwx8QqDTWCyTdJ72E4cVhw64A','ACCESS','tw_k7@naver.com'),(290,'2025-08-12 12:21:00.589648',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5Njg4NjAsImV4cCI6MTc1NTU3MzY2MH0.pYyvRir7BQV81od59I4EeSfKxDknZ2S4a_Dj2ZwvcHQ','REFRESH','tw_k7@naver.com'),(291,'2025-08-12 12:33:08.075222',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5Njk1ODgsImV4cCI6MTc1NTU2OTU4OH0.7G-aSoSRDo0wjJg3T6d-SidDAUAorOqnX-CIQI37zPw','ACCESS','admin@mail.com'),(292,'2025-08-12 12:33:08.110452',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDk2OTU4OCwiZXhwIjoxNzU1NTc0Mzg4fQ.I0OhSLT3Lz8R771l-TUMIe3RW1RYzzf59lGRE8OE99I','REFRESH','admin@mail.com'),(293,'2025-08-12 12:34:57.684182',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5Njk2OTcsImV4cCI6MTc1NTU2OTY5N30.VrEvaN4ZptTpOdVxziWnjjTFx88rsX1mYZhaRw_LSYQ','ACCESS','wonjun@mail.com'),(294,'2025-08-12 12:34:57.692570',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5Njk2OTcsImV4cCI6MTc1NTU3NDQ5N30.47B0mE_FPcnMRwc4KvJ4U_j9cY9cjVzVoZCuzJCdVbI','REFRESH','wonjun@mail.com'),(295,'2025-08-12 12:42:27.326749',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5NzAxNDcsImV4cCI6MTc1NTU3MDE0N30.yjF0ePQAE8__bp2vDU4xWRJOcHySGpR7nF7rfn5qp4A','ACCESS','admin@mail.com'),(296,'2025-08-12 12:42:27.335225',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDk3MDE0NywiZXhwIjoxNzU1NTc0OTQ3fQ.FQO75XdWQJMMrazNdtmzBL92rPjYUL77YHy8d2gXXew','REFRESH','admin@mail.com'),(297,'2025-08-12 14:27:33.616306',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5NzY0NTMsImV4cCI6MTc1NTU3NjQ1M30.RCxZF7HgM1-cgRyL3ZXzXr_sZcG0mUox39Yj12oInzI','ACCESS','wonjun@mail.com'),(298,'2025-08-12 14:27:33.650991',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5NzY0NTMsImV4cCI6MTc1NTU4MTI1M30.uhh4fK1x6ogYgXwj8BSkMQ9gWHuSSz_YxxBRG-bkSkA','REFRESH','wonjun@mail.com'),(299,'2025-08-12 15:38:25.388058',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5ODA3MDUsImV4cCI6MTc1NTU4MDcwNX0.SW0xTaMqNFnls1aK4V0zFG5kVGvx3kdNwZiCLUQV8dk','ACCESS','wonjun@mail.com'),(300,'2025-08-12 15:38:25.422159',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODA3MDUsImV4cCI6MTc1NTU4NTUwNX0.RXpzlvyX3R6ktVWtzAOdRivhocgmGPnDP2FbdUS4QO4','REFRESH','wonjun@mail.com'),(301,'2025-08-12 15:47:30.423808',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5ODEyNTAsImV4cCI6MTc1NTU4MTI1MH0.5PpBsxNsOeLwYJff_9K0WhcBZNZKCzAAtotBvEjsyn0','ACCESS','tw_k7@naver.com'),(302,'2025-08-12 15:47:30.458811',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODEyNTAsImV4cCI6MTc1NTU4NjA1MH0.HVXRmpc_l0H-9Wh_HNXIM0r7VGcDQC4OtzixKWNRJf8','REFRESH','tw_k7@naver.com'),(303,'2025-08-12 15:51:08.246220',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5ODE0NjgsImV4cCI6MTc1NTU4MTQ2OH0.DHLGl8WJ4aLSJ1wkY5jU50m6KC5gu-8Oa573ZK7iH50','ACCESS','tw_k7@naver.com'),(304,'2025-08-12 15:51:08.255347',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODE0NjgsImV4cCI6MTc1NTU4NjI2OH0.W9nduMVprJhzXh-4cemwjEvHR3KFgHqSht2yInsFJzY','REFRESH','tw_k7@naver.com'),(305,'2025-08-12 15:57:40.344860',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5ODE4NjAsImV4cCI6MTc1NTU4MTg2MH0.QHFtoL2V1sos0HxUl_qvYT3FX3b7EQbqo3AXfzu6VCs','ACCESS','admin@mail.com'),(306,'2025-08-12 15:57:40.353704',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDk4MTg2MCwiZXhwIjoxNzU1NTg2NjYwfQ.CY51678duXj08bYmZHN3zeYt7O16H6X3Y-J-n6irJo8','REFRESH','admin@mail.com'),(307,'2025-08-12 16:08:21.840866',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5ODI1MDEsImV4cCI6MTc1NTU4MjUwMX0.3ixu07JTo3_zHNGLCRsoEuIfl1eb_YfNnCGF5S9PemY','ACCESS','tw_k7@naver.com'),(308,'2025-08-12 16:08:21.856165',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODI1MDEsImV4cCI6MTc1NTU4NzMwMX0.UnS241NTm27oIlOFrySnzOo1aaEWQhtKe7gk15Ig6z0','REFRESH','tw_k7@naver.com'),(309,'2025-08-12 16:10:27.390842',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NTQ5ODI2MjcsImV4cCI6MTc1NTU4MjYyN30.mZq-hbGxEcqrV-ycEiT_ltsGsqwQqK8_Pr1HtG-S3ow','ACCESS','admin@mail.com'),(310,'2025-08-12 16:10:27.400340',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6IiIsImlhdCI6MTc1NDk4MjYyNywiZXhwIjoxNzU1NTg3NDI3fQ.9-9jIsOsWX8V_Ude5yoVVwgT4f3aIzq4Rg--pRKqn6U','REFRESH','admin@mail.com'),(311,'2025-08-12 16:13:22.406972',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5ODI4MDIsImV4cCI6MTc1NTU4MjgwMn0.Sl4jqyQ_RXmnGwEkvZDMRlt6ifX8FZ7Wplm-JSKoWyU','ACCESS','tw_k7@naver.com'),(312,'2025-08-12 16:13:22.419020',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODI4MDIsImV4cCI6MTc1NTU4NzYwMn0.O_uhg-TaII1azRtLCh9xr0u9VPfFAvrs0eMt5kxKLyI','REFRESH','tw_k7@naver.com'),(313,'2025-08-12 16:15:43.522257',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5ODI5NDMsImV4cCI6MTc1NTU4Mjk0M30.GMM1V_N49_m7lO9VvFIShWHwghJkQ3z2FYytUszefFk','ACCESS','wonjun@mail.com'),(314,'2025-08-12 16:15:43.530841',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODI5NDMsImV4cCI6MTc1NTU4Nzc0M30.chTzX4qKiXnEfn3922UFjUjkT16ryDjr67m9JaLppRo','REFRESH','wonjun@mail.com'),(315,'2025-08-12 16:44:58.415580',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTQ5ODQ2OTgsImV4cCI6MTc1NTU4NDY5OH0.6XVcw4zP_awLbbwnDSzPAP1tHob91xgbWtMoMBKsX_4','ACCESS','tw_k7@naver.com'),(316,'2025-08-12 16:44:58.426998',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODQ2OTgsImV4cCI6MTc1NTU4OTQ5OH0.yRZeZsSTdMJv2baWciAM4CGQBzor_p87_rcqGEAPyS0','REFRESH','tw_k7@naver.com'),(317,'2025-08-12 17:13:21.187245',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhZTkwMTE0NTE4QGdtYWlsLmNvbSIsInJvbGUiOiJST0xFX1NUVURFTlQiLCJpYXQiOjE3NTQ5ODY0MDEsImV4cCI6MTc1NTU4NjQwMX0.yTzEhlhDUKu5-hkBM8_0l9NndDhxkdFve3yK7PUgN7Q','ACCESS','bae90114518@gmail.com'),(318,'2025-08-12 17:13:21.197852',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJhZTkwMTE0NTE4QGdtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTQ5ODY0MDEsImV4cCI6MTc1NTU5MTIwMX0.-HfNeslTIFlDFvDqPZUIbKN2kc5SmaPgQQKg6uidu8A','REFRESH','bae90114518@gmail.com'),(319,'2025-08-12 22:52:15.702402',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTUwMDY3MzUsImV4cCI6MTc1NTYwNjczNX0.s6O8ntvtdMEWXZwqOWBrfWNgAK8gwrTf6MYFNoL_Nh8','ACCESS','wonjun@mail.com'),(320,'2025-08-12 22:52:15.736426',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTUwMDY3MzUsImV4cCI6MTc1NTYxMTUzNX0.5QvuB6_0OpdO8lKeDTcKUQqh01tmJysAiG5lwnQPfpg','REFRESH','wonjun@mail.com'),(321,'2025-08-13 04:46:19.261613',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX0lOU1RSVUNUT1IiLCJpYXQiOjE3NTUwMjc5NzksImV4cCI6MTc1NTYyNzk3OX0.BZ3UgKK57PDB-40QBiniC0z3YTw8FGpW2_RuV1X27E0','ACCESS','tw_k7@naver.com'),(322,'2025-08-13 04:46:19.294913',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InR3X2s3QG5hdmVyLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NTUwMjc5NzksImV4cCI6MTc1NTYzMjc3OX0.eeJoALfRlcZRy9jGL5TuNcUCs9RexmEy2y5yvOXRVfA','REFRESH','tw_k7@naver.com');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `birth_date` date DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` int DEFAULT NULL,
  `is_activated` bit(1) DEFAULT NULL,
  `job` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'2025-08-01','2025-08-05 19:41:56.310261','wonjun@mail.com',0,_binary '','네이버 개발자','이원준','WONJUNY','$2a$10$BKazzzUMqsW1OER2b2p.lu50OCoPlJ1dgUbB6OhC1W/dJR0dZyNQ6','ROLE_INSTRUCTOR',NULL),(9,'1111-11-11','2025-08-05 19:44:18.614194','molee@mail.com',1,_binary '','천재','이원준',NULL,'$2a$10$Z0a8gV8EBeBiQHP23L3YPuAAq.0sLJ8O9s5p5og9Z7qNwbodg9ffG','ROLE_STUDENT',NULL),(10,'2000-01-01','2025-08-05 19:50:03.631041','admin@mail.com',1,_binary '','개발자','이원준',NULL,'$2a$10$vQ8ulTNdepOz1kn817ulFeX1wdIW0gIJnbXoUDF37fZBh7I2NGvYO','ROLE_ADMIN',NULL),(26,'1996-11-01','2025-08-07 00:21:54.336205','tw_k7@naver.com',0,_binary '','2백수111','강태욱','태욱핑','$2a$10$xa32YTcKEAf/f0umYo5rR.Cm8CmLbddBYIf14E0zLH25uHQy4tsMC','ROLE_INSTRUCTOR',NULL),(71,'2025-08-05','2025-08-10 19:35:47.095954','sunshinemoongit@gmail.com',0,_binary '','백수','강태욱','테스트','$2a$10$BHBMNY711d7PixpnIywNtu7Fy7xQvZt99LJGLVvv/mCTH.eMPtCNu','ROLE_STUDENT',NULL),(89,'2025-08-04','2025-08-12 11:21:46.718794','wl202wl@naver.com',0,_binary '','취준생','윤지욱','이원준1대제자','$2a$10$YhArE4KZ8lerUC5T/KMllegNuryhVg8pxUcVAcKr6RiuItaZ.VwXy','ROLE_INSTRUCTOR',NULL),(117,'2025-08-01','2025-08-12 17:02:44.222277','bae90114518@gmail.com',0,_binary '','롯데 직원','배준재','숯불위의 장어','$2a$10$rR2Sk7j4igdgH5sAHFyxlOj0M2B40YSs66WviIafrTH0SgUktODxe','ROLE_INSTRUCTOR',NULL),(143,'2025-08-07','2025-08-14 04:43:40.877718','twkang1101@gmail.com',0,_binary '','백수','강태욱','바보야','$2a$10$yrh3nQX13dZJxvbaGl26hegfP6L1ATUv2GYtHx.gRdRElY2U.ZATK','ROLE_STUDENT',NULL),(144,'2000-12-15','2025-08-14 09:25:23.814537','icandol007@naver.com',0,_binary '','자택경비원','김팝송','김팝송','$2a$10$PGGTnWo6I13.gjuq./ji/uGPfHqKJMrFLVIm3lt/KMqsXLaB7aioe','ROLE_STUDENT',NULL),(145,'2025-08-01','2025-08-14 12:04:00.204978','cavalier7@naver.com',0,_binary '','컨설턴트','고성현','테스터','$2a$10$/MXqT6mbgem2kE50e8ynMOvh67kDEXbHOJHFp8A4sCG7wEAiSrogq','ROLE_STUDENT',NULL),(158,'2000-02-06','2025-08-15 16:50:38.099814','evenil0206@gmail.com',0,_binary '','백엔드 개발자가 되고싶어요','이원준','모리','$2a$10$GfQ6hSmUX9m17jEZ/RLkdOMvFpoP6MArEaBMzoaJ.CqbUA7Un56yO','ROLE_STUDENT',NULL),(160,'2025-08-04','2025-08-16 05:54:04.799494','contact@alpacar.kr',0,_binary '','ㅁ','ㅁ','□　□　□　□□','$2a$10$Ka33My.rjsE7PhnSYtKRiuf7D3f.Xn/a4e15EvXJWReVOX/SBWy.e','ROLE_STUDENT',NULL),(161,'2025-08-15','2025-08-16 11:27:46.134441','kimxminsu@gmail.com',1,_binary '','요요','요요','요요','$2a$10$.2JsIE9/44ZqAS0Bppj7JepcsBROeDxUZakIfPCFyYUS9dPNQoSsS','ROLE_STUDENT',NULL),(164,NULL,'2025-08-17 01:11:26.159911','dnjswns648@naver.com',NULL,_binary '',NULL,'','',NULL,'ROLE_STUDENT',NULL),(173,NULL,'2025-08-17 10:29:38.234850','leejiun0102@nate.com',NULL,_binary '',NULL,'','',NULL,'ROLE_STUDENT',NULL),(176,'2000-01-02','2025-08-17 10:32:02.112358','leejiwoo0126@gmail.com',1,_binary '','홈프로텍터','이지언','leejiwoo0126',NULL,'ROLE_STUDENT',NULL),(178,'2025-08-13','2025-08-17 10:38:00.756288','bjj3141592@naver.com',0,_binary '','가수','하하','null',NULL,'ROLE_STUDENT',NULL),(179,'1996-03-12','2025-08-17 11:30:26.085433','high.kick.jake@gmail.com',0,_binary '','백수','이재익','jakelee','$2a$10$O2ZPAEm3Er6M9E61GgKvkeyBFkU2/5GZ7jXtQa8hu81m6g71XFxgu','ROLE_STUDENT',NULL),(180,'1996-11-29','2025-08-17 15:42:37.638409','ji202ji@naver.com',0,_binary '','음식점 매니저','윤지욱','지욱이로지우기','$2a$10$d.ZspUzCLrnQr25HD78kC.uBudTgJ0OCrwxnCF0po9jngyO.eHxca','ROLE_STUDENT',NULL),(181,'2025-02-20','2025-08-17 15:55:37.682827','bjj3141592@gmail.com',0,_binary '','강시','강사준재','bjj3141592',NULL,'ROLE_INSTRUCTOR',NULL),(182,'2000-01-02','2025-08-17 18:16:45.928698','leejiun0102@naver.com',1,_binary '','홈프로텍터','이지언','홈프로텍터','$2a$10$XHwCF9hXJwW/XjM9fsC0zOPjZ8yzsaSMlxwHradtQuR349W.sgyA6','ROLE_STUDENT',NULL),(183,'2025-08-04','2025-08-18 02:12:00.483216','ejoyee1016@gmail.com',1,_binary '','수강생','이농담곰','농담곰','$2a$10$vHlhD7gPLMQpXLL46/lASe9NEm0t7i/8tR5r8ghaJZaAONMmUsgZ2','ROLE_STUDENT',NULL),(184,'2025-08-30','2025-08-18 09:07:04.360443','jun3021303@naver.com',1,_binary '','\" OR 1=1 --\"','\" OR 1=1 --\"','asfrhdrth','$2a$10$fljWcF347By4J/1gRUi0nO3FvqOYGPT54GQF6BBUHxfO8vQ3OhON6','ROLE_STUDENT',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zzims`
--

DROP TABLE IF EXISTS `zzims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zzims` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zzims`
--

LOCK TABLES `zzims` WRITE;
/*!40000 ALTER TABLE `zzims` DISABLE KEYS */;
INSERT INTO `zzims` VALUES (1,3,117),(2,3,145),(3,3,8),(10,4,160),(11,75,160),(12,4,161),(13,75,161),(14,5,161),(16,4,89),(18,4,117),(21,85,180),(22,83,180),(23,83,117);
/*!40000 ALTER TABLE `zzims` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-18  2:24:23
