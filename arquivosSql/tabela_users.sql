-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: transaction_app
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `cpf` (`cpf`),
  CONSTRAINT `cpf_format_check` CHECK (((`cpf` is null) or regexp_like(`cpf`,_utf8mb4'^[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}$')))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'marcos','marcos@gmail.com','$2a$08$XAtv28Graga1cb5fvaPSYOL.CXgFzhkVu3wSav7KzJrReI88/../m','admin','2025-05-14 03:41:12','2025-05-14 03:41:12',NULL),(3,'jorge','jorge@gmail.com','$2a$08$QJ9pv9yEJv/2jQ0ScC2Po.VNhDncU.S/92fr5SdNT/Y0fPPbcRUfi','user','2025-05-14 04:45:28','2025-05-14 04:45:28','874.863.320-86'),(4,'Ronaldo','naldo@gmail.com','$2a$08$erD8gA/FOrCTTE2xWj6KdOUhL2o3yVkScmbvLywUQ80e7EXoRxA9m','admin','2025-05-14 06:23:03','2025-05-14 06:23:03',NULL),(5,'Junior','junior@gmail.com','$2a$08$QS9WYDY01.ilAuamvcHXC.wzZgf/JWjWtnTaJq6WXzbKboRkibFYq','user','2025-05-14 06:55:02','2025-05-14 06:55:02','581.642.068-22'),(6,'Lara','lara@gmail.com','$2a$08$2gHnTIkzByuOx6REGunFEeQa5siixH7ongriiJ67YtczE16JBOkBi','admin','2025-05-14 07:09:25','2025-05-14 07:09:25','964.814.370-67'),(7,'Rayssa','ray@gmail.com','$2a$08$b9PnrprXMFRWQUS97KEzkud/38kN2pjT2pj1eqNUmJBh3QOvi71G2','admin','2025-05-14 21:34:48','2025-05-14 21:34:48','804.966.490-27'),(8,'Maria','maria@gmail.com','$2a$08$3oLAcRsOtmTrJJf4dn36rOIMIAx790XqoH1MCELaclzLRV/qK3i3K','user','2025-05-15 13:55:07','2025-05-15 13:55:07','558.308.300-00'),(9,'Matheus','mateo@gmail.com','$2a$08$9qcD9qnYig826Nq/2uIYVeovoEO5Ljlim9QTOpXMvrW/J1.TNPvHa','user','2025-05-15 23:07:21','2025-05-15 23:07:21','169.683.350-77');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-15 21:21:59
