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
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `transactionDate` date NOT NULL,
  `points` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('Aprovado','Reprovado','Em avaliação') NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `user_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `adminId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_cpf` (`cpf`),
  KEY `idx_status` (`status`),
  KEY `idx_date` (`transactionDate`),
  KEY `fk_transactions_admin` (`adminId`),
  CONSTRAINT `fk_transactions_admin` FOREIGN KEY (`adminId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'Venda do produto X','2022-10-09',10,10000.00,'Aprovado','581.642.068-22',5,'2025-05-14 17:21:18','2025-05-15 15:12:44',1),(2,'Venda do produto Xbox','2022-10-09',5000,10000.00,'Aprovado','581.642.068-22',5,'2025-05-14 20:44:14','2025-05-15 11:58:41',1),(3,'Venda do produto Play5','2022-10-09',5000,5000.00,'Reprovado','581.642.068-22',5,'2025-05-15 12:33:07','2025-05-15 12:33:07',1),(4,'Venda do produto Iphone','2023-10-09',5000,5000.00,'Reprovado','581.642.068-22',5,'2025-05-15 12:42:56','2025-05-15 12:42:56',1),(5,'Venda do produto Moto Elétrica','2022-10-09',10000,10000.00,'Aprovado','581.642.068-22',5,'2025-05-15 12:47:03','2025-05-15 12:47:03',1),(6,'Venda do produto Onix','2024-10-09',50000,76000.00,'Em avaliação','581.642.068-22',5,'2025-05-15 12:47:03','2025-05-15 12:47:03',1),(7,'Venda do produto Iphone','2023-10-09',5000,5000.00,'Reprovado','581.642.068-22',5,'2025-05-15 12:47:03','2025-05-15 12:47:03',1),(8,'Venda do produto Moto Elétrica','2022-10-09',10000,10000.00,'Aprovado','804.966.490-27',7,'2025-05-15 12:51:11','2025-05-15 12:51:11',1),(9,'Venda do produto Iphone','2023-10-09',5000,5000.00,'Reprovado','804.966.490-27',7,'2025-05-15 12:51:11','2025-05-15 12:51:11',1),(10,'Venda do produto Onix','2024-10-09',50000,76000.00,'Em avaliação','804.966.490-27',7,'2025-05-15 12:51:11','2025-05-15 12:51:11',1),(11,'Venda do produto Moto Elétrica','2022-10-09',10000,10000.00,'Aprovado','964.814.370-67',6,'2025-05-15 13:08:58','2025-05-15 13:08:58',1),(12,'Venda do produto Iphone','2023-10-09',5000,5000.00,'Reprovado','964.814.370-67',6,'2025-05-15 13:08:58','2025-05-15 13:08:58',1),(13,'Venda do produto Onix','2024-10-09',50000,76000.00,'Em avaliação','964.814.370-67',6,'2025-05-15 13:08:58','2025-05-15 13:08:58',1),(14,'Venda do produto Moto Elétrica','2022-10-09',10000,10000.00,'Aprovado','558.308.300-00',8,'2025-05-15 13:57:07','2025-05-15 13:57:07',1),(15,'Venda do produto Onix','2024-10-09',50000,76000.00,'Em avaliação','558.308.300-00',8,'2025-05-15 13:57:07','2025-05-15 13:57:07',1),(16,'Venda do produto Iphone','2023-10-09',5000,5000.00,'Reprovado','558.308.300-00',8,'2025-05-15 13:57:07','2025-05-15 13:57:07',1),(17,'Venda do produto Moto Elétrica','2025-10-09',10000,10000.00,'Aprovado','558.308.300-00',8,'2025-05-15 16:49:17','2025-05-15 16:49:17',1),(18,'Venda do produto Moto Elétrica','2025-10-09',10000,10000.00,'Aprovado','581.642.068-22',5,'2025-05-15 20:50:41','2025-05-15 20:50:41',1),(19,'Venda do produto Moto Elétrica','2029-10-09',12000,12000.00,'Aprovado','581.642.068-22',5,'2025-05-15 20:50:41','2025-05-15 20:50:41',1),(20,'Venda do produto Bolsa Gucci','2027-10-09',3000,3000.00,'Aprovado','581.642.068-22',5,'2025-05-15 20:50:41','2025-05-15 20:50:41',1),(21,'Venda do produto Moto Hornet','2026-10-09',8000,8000.00,'Aprovado','581.642.068-22',5,'2025-05-15 20:50:41','2025-05-15 20:50:41',1),(22,'Venda do produto','2028-10-09',2000,2000.00,'Aprovado','581.642.068-22',5,'2025-05-15 20:50:41','2025-05-15 20:50:41',1),(23,'Venda do produto Moto Elétrica','2030-10-09',10000,10000.00,'Aprovado','581.642.068-22',5,'2025-05-15 20:50:41','2025-05-15 20:50:41',1),(24,'Venda do produto Capacete','2030-10-09',10000,10000.00,'Aprovado','874.863.320-86',3,'2025-05-15 21:30:29','2025-05-15 21:30:29',6),(25,'Venda do produto Capacete','2030-10-09',10000,10000.00,'Aprovado','874.863.320-86',3,'2025-05-15 22:15:51','2025-05-15 22:15:51',1),(26,'Venda do produto Capacete','2025-05-14',10000,10000.00,'Aprovado','874.863.320-86',3,'2025-05-16 00:08:16','2025-05-16 00:08:16',7),(27,'Venda do produto Capacete','2025-05-15',10000,10000.00,'Aprovado','581.642.068-22',5,'2025-05-16 00:08:16','2025-05-16 00:08:16',7),(28,'Venda do produto Capacete','2025-05-16',10000,10000.00,'Aprovado','964.814.370-67',6,'2025-05-16 00:08:16','2025-05-16 00:08:16',7),(29,'Venda do produto Capacete','2025-05-17',10000,10000.00,'Aprovado','804.966.490-27',7,'2025-05-16 00:08:16','2025-05-16 00:08:16',7),(30,'Venda do produto Capacete','2025-05-18',10000,10000.00,'Aprovado','558.308.300-00',8,'2025-05-16 00:08:16','2025-05-16 00:08:16',7),(31,'Venda do produto Capacete','2025-05-19',10000,10000.00,'Aprovado','169.683.350-77',9,'2025-05-16 00:08:16','2025-05-16 00:08:16',7);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
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
