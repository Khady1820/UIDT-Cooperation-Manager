-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: coopmanager_v4
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convention_logs`
--

DROP TABLE IF EXISTS `convention_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `convention_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `convention_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `action` varchar(255) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `convention_logs_convention_id_foreign` (`convention_id`),
  KEY `convention_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `convention_logs_convention_id_foreign` FOREIGN KEY (`convention_id`) REFERENCES `conventions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `convention_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convention_logs`
--

LOCK TABLES `convention_logs` WRITE;
/*!40000 ALTER TABLE `convention_logs` DISABLE KEYS */;
INSERT INTO `convention_logs` VALUES (1,1,2,'creation','Convention créée en tant que brouillon','2026-04-20 14:02:16','2026-04-20 14:02:16'),(2,1,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : dossier complet','2026-04-20 14:03:31','2026-04-20 14:03:31'),(3,1,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-20 14:04:21','2026-04-20 14:04:21'),(4,1,5,'validation_juridique','Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.','2026-04-20 14:05:47','2026-04-20 14:05:47'),(5,1,3,'finalisation_directeur','Contrôle final effectué. Dossier transmis au Rectorat pour signature.','2026-04-20 14:06:54','2026-04-20 14:06:54'),(6,1,4,'signature_recteur','Dossier signé officiellement par le Recteur. Document final archivé.','2026-04-20 14:08:06','2026-04-20 14:08:06'),(7,1,2,'restauration','Dossier restauré vers les projets actifs','2026-04-20 14:11:15','2026-04-20 14:11:15'),(8,12,2,'restauration','Dossier restauré vers les projets actifs','2026-04-20 14:49:03','2026-04-20 14:49:03'),(9,10,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : dossier bien fait','2026-04-20 14:50:22','2026-04-20 14:50:22'),(10,10,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-20 14:51:24','2026-04-20 14:51:24'),(11,1,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : bonne idée de projet','2026-04-20 16:20:21','2026-04-20 16:20:21'),(12,1,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-20 16:21:16','2026-04-20 16:21:16'),(13,1,5,'validation_juridique','Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.','2026-04-20 16:22:32','2026-04-20 16:22:32'),(14,1,3,'finalisation_directeur','Contrôle final effectué. Dossier transmis au Rectorat pour signature.','2026-04-20 16:23:51','2026-04-20 16:23:51'),(15,1,4,'signature_recteur','Dossier signé officiellement par le Recteur. Document final archivé.','2026-04-20 16:25:28','2026-04-20 16:25:28'),(16,18,2,'creation','Convention créée en tant que brouillon','2026-04-20 17:28:33','2026-04-20 17:28:33'),(17,18,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : test','2026-04-20 17:30:35','2026-04-20 17:30:35'),(18,18,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-20 17:36:16','2026-04-20 17:36:16'),(19,18,5,'validation_juridique','Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.','2026-04-20 17:37:48','2026-04-20 17:37:48'),(20,18,3,'finalisation_directeur','Contrôle final effectué. Dossier transmis au Rectorat pour signature.','2026-04-20 17:38:55','2026-04-20 17:38:55'),(21,18,4,'signature_recteur','Dossier signé officiellement par le Recteur. Document final archivé.','2026-04-20 17:40:58','2026-04-20 17:40:58'),(22,10,2,'archivage','Dossier déplacé vers les archives','2026-04-20 17:45:27','2026-04-20 17:45:27'),(23,11,2,'restauration','Dossier restauré vers les projets actifs','2026-04-20 19:23:55','2026-04-20 19:23:55'),(24,11,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : moderne','2026-04-20 19:26:00','2026-04-20 19:26:00'),(25,11,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-20 19:28:00','2026-04-20 19:28:00'),(26,11,5,'validation_juridique','Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.','2026-04-20 19:30:45','2026-04-20 19:30:45'),(27,11,3,'finalisation_directeur','Contrôle final effectué. Dossier transmis au Rectorat pour signature.','2026-04-20 19:31:53','2026-04-20 19:31:53'),(28,11,4,'signature_recteur','Dossier signé officiellement par le Recteur. Document final archivé.','2026-04-20 19:33:27','2026-04-20 19:33:27'),(29,15,2,'restauration','Dossier restauré vers les projets actifs','2026-04-20 19:46:25','2026-04-20 19:46:25'),(30,19,2,'creation','Convention créée en tant que brouillon','2026-04-20 22:57:31','2026-04-20 22:57:31'),(31,19,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : xxxxxxxxxxxxxxxxxxx','2026-04-20 23:00:43','2026-04-20 23:00:43'),(32,19,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : xxxxxxxxxxxxxxxxxxx','2026-04-20 23:00:55','2026-04-20 23:00:55'),(33,19,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : xxxxxxxxxxxxxxxxxxx','2026-04-20 23:01:18','2026-04-20 23:01:18'),(34,19,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-20 23:15:19','2026-04-20 23:15:19'),(35,19,5,'validation_juridique','Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.','2026-04-20 23:31:16','2026-04-20 23:31:16'),(36,19,3,'rejet','Rejeté. Motif : corriger','2026-04-20 23:31:58','2026-04-20 23:31:58'),(37,15,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : projet interressant','2026-04-21 17:22:44','2026-04-21 17:22:44'),(38,15,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-21 17:23:47','2026-04-21 17:23:47'),(39,15,5,'validation_juridique','Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.','2026-04-21 17:24:48','2026-04-21 17:24:48'),(40,15,3,'finalisation_directeur','Contrôle final effectué. Dossier transmis au Rectorat pour signature.','2026-04-21 17:25:35','2026-04-21 17:25:35'),(41,15,4,'signature_recteur','Dossier signé officiellement par le Recteur. Document final archivé.','2026-04-21 17:26:43','2026-04-21 17:26:43'),(42,15,2,'restauration','Dossier restauré vers les projets actifs','2026-04-21 17:36:29','2026-04-21 17:36:29'),(43,20,2,'creation','Convention créée en tant que brouillon','2026-04-21 17:57:56','2026-04-21 17:57:56'),(44,20,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : ryhytjh-jutn','2026-04-21 17:59:52','2026-04-21 17:59:52'),(45,20,3,'rejet','Rejeté. Motif : kjm,mnbhbv','2026-04-21 18:06:42','2026-04-21 18:06:42'),(46,15,6,'pre_validation_chef','Pré-validation effectuée par le Chef de Division. Avis : dossier ciompleet','2026-04-21 23:05:34','2026-04-21 23:05:34'),(47,15,3,'validation_directeur_initial','Première validation effectuée. Dossier transmis au Service Juridique.','2026-04-21 23:14:37','2026-04-21 23:14:37'),(48,15,3,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-21 23:27:25','2026-04-21 23:27:25'),(49,15,5,'validation_juridique','Conformité visée par le Service Juridique. Renvoi à la Direction pour contrôle final.','2026-04-21 23:28:45','2026-04-21 23:28:45'),(50,15,5,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-21 23:30:42','2026-04-21 23:30:42'),(51,15,3,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-21 23:32:32','2026-04-21 23:32:32'),(52,15,3,'finalisation_directeur','Contrôle final effectué. Dossier transmis au Rectorat pour signature.','2026-04-21 23:32:58','2026-04-21 23:32:58'),(53,15,4,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-21 23:34:30','2026-04-21 23:34:30'),(54,15,4,'signature_recteur','Dossier signé officiellement par le Recteur. Document final archivé.','2026-04-21 23:37:22','2026-04-21 23:37:22'),(55,15,4,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-21 23:37:57','2026-04-21 23:37:57'),(56,15,4,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-21 23:37:58','2026-04-21 23:37:58'),(57,15,7,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-22 00:46:33','2026-04-22 00:46:33'),(58,10,3,'restauration','Dossier restauré vers les projets actifs','2026-04-22 00:49:55','2026-04-22 00:49:55'),(59,15,7,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-22 00:59:13','2026-04-22 00:59:13'),(60,15,7,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-22 01:05:34','2026-04-22 01:05:34'),(61,15,7,'modification_document','Une nouvelle version corrigée du document a été téléversée.','2026-04-22 01:19:32','2026-04-22 01:19:32');
/*!40000 ALTER TABLE `convention_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conventions`
--

DROP TABLE IF EXISTS `conventions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conventions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `num_dossier` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('regional','national','international') NOT NULL DEFAULT 'international',
  `partner_type` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `objectives` text DEFAULT NULL,
  `partners` text DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `indicator` varchar(255) DEFAULT NULL,
  `valeur_reference` decimal(15,2) DEFAULT NULL,
  `target` decimal(15,2) DEFAULT NULL,
  `actual_value` decimal(15,2) DEFAULT NULL,
  `completion_rate` decimal(8,2) DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'brouillon',
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conventions_num_dossier_unique` (`num_dossier`),
  KEY `conventions_user_id_foreign` (`user_id`),
  CONSTRAINT `conventions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conventions`
--

LOCK TABLES `conventions` WRITE;
/*!40000 ALTER TABLE `conventions` DISABLE KEYS */;
INSERT INTO `conventions` VALUES (1,'UIDT-2026-001',2,'Aider les enfants démunies','regional','ONG',NULL,'dgjfl,bkfnbk','CBAO',2026,'3 mois','nbrs d\'enfant orphelin de pere',100.00,50.00,29.00,58.00,'zefzfever',NULL,'2026-04-25','2026-08-23','termine',NULL,'2026-04-20 14:02:16','2026-04-20 16:25:28'),(10,'UIDT-2026-002',2,'Projet de Recherche Solaire','international',NULL,NULL,NULL,'EnerSen, GreenTech',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-01','2027-05-01','termine',NULL,'2026-04-20 14:28:21','2026-04-22 00:49:55'),(11,'UIDT-2026-003',2,'Modernisation de la Bibliothèque','international',NULL,NULL,'modernisé','Fondation Lecture, Ministère Éducation',2026,NULL,'Nombre de materiel fourni',63.00,18.00,NULL,NULL,'testmodernisation',NULL,'2026-06-15','2026-12-15','termine',NULL,'2026-04-20 14:28:21','2026-04-20 19:33:27'),(12,'UIDT-2026-004',2,'Programme d\'Échange avec le Canada','international',NULL,NULL,NULL,'Université de Montréal, Ambassade du Canada',2026,NULL,'yhgjhihoj',94.00,62.00,33.00,53.23,NULL,NULL,'2026-09-01','2027-06-30','soumis',NULL,'2026-04-20 14:28:21','2026-04-20 14:49:03'),(13,'UIDT-2026-005',2,'Atelier de Robotique Mobile','international',NULL,NULL,NULL,'TechSolutions, FabLab Dakar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-20','2026-08-20','en attente',NULL,'2026-04-20 14:28:21','2026-04-20 14:28:21'),(14,'UIDT-2026-006',2,'Optimisation des Ressources Agricoles','international',NULL,NULL,NULL,'ISRA, FAO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-10','2027-10-10','en attente',NULL,'2026-04-20 14:28:21','2026-04-20 14:28:21'),(15,'UIDT-2025-001',2,'Convention expirant bientôt A','international',NULL,NULL,NULL,'Partenaire A',2026,NULL,NULL,47.00,35.00,29.00,82.86,'bien fournie claire et nette','conventions/mv4dCEfFqUTqr07TAxAKdoCsCAPamcIJElyw6HxF.docx','2025-01-01','2026-05-15','termine',NULL,'2026-04-20 14:30:31','2026-04-22 01:19:32'),(16,'UIDT-2025-002',2,'Convention expirant bientôt B','international',NULL,NULL,NULL,'Partenaire B',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-01-01','2026-06-10','termine',NULL,'2026-04-20 14:30:31','2026-04-20 14:30:31'),(17,'UIDT-2025-003',2,'Convention expirant bientôt C','international',NULL,NULL,NULL,'Partenaire C',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-01-01','2026-07-05','termine',NULL,'2026-04-20 14:30:31','2026-04-20 14:30:31'),(18,'UIDT-2026-007',2,'testprojet','national','Banque',NULL,'testprojet','CBAO',2026,'3 mois','test',51.00,25.00,8.00,32.00,'test',NULL,'2026-04-24','2026-08-23','termine',NULL,'2026-04-20 17:28:33','2026-04-20 17:40:58'),(19,'UIDT-2026-008',2,'Recherche formation','national','Banque',NULL,'ghjklm','CBAO',2026,'1 mois','nombre de place disponible',100.00,43.00,NULL,NULL,'scscncnsc',NULL,'2026-05-01','2026-06-12','brouillon','corriger','2026-04-20 22:57:31','2026-04-20 23:31:58'),(20,'UIDT-2026-009',2,'hliekfjerkj','national','Banque',NULL,'ghtybnytn','tgtrgkm;l',2026,'17 jours','y(-y-yh',26.00,22.00,NULL,NULL,'thtyn-yh-',NULL,'2026-04-30','2026-05-17','brouillon','kjm,mnbhbv','2026-04-21 17:57:56','2026-04-21 18:06:42');
/*!40000 ALTER TABLE `conventions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpis`
--

DROP TABLE IF EXISTS `kpis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpis` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `convention_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `valeur_reference` varchar(255) DEFAULT NULL,
  `valeur_cible` varchar(255) DEFAULT NULL,
  `valeur_atteinte` varchar(255) DEFAULT NULL,
  `frequence_mesure` varchar(255) DEFAULT NULL,
  `responsable` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kpis_convention_id_foreign` (`convention_id`),
  CONSTRAINT `kpis_convention_id_foreign` FOREIGN KEY (`convention_id`) REFERENCES `conventions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpis`
--

LOCK TABLES `kpis` WRITE;
/*!40000 ALTER TABLE `kpis` DISABLE KEYS */;
/*!40000 ALTER TABLE `kpis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_03_22_232833_create_conventions_table',1),(5,'2026_03_22_232833_create_roles_table',1),(6,'2026_03_22_232834_create_kpis_table',1),(7,'2026_03_22_232856_add_role_id_to_users_table',1),(8,'2026_03_22_233012_create_personal_access_tokens_table',1),(9,'2026_04_01_153001_create_convention_logs_table',1),(10,'2026_04_05_190924_update_conventions_table_v2',1),(11,'2026_04_05_205442_create_notifications_table',1),(12,'2026_04_08_160500_add_file_path_to_conventions_table',1),(13,'2026_04_12_170719_create_partenaires_table',1),(14,'2026_04_13_231303_add_last_login_at_to_users_table',1),(15,'2026_04_13_233430_add_num_dossier_to_conventions_table',1),(16,'2026_04_13_233437_enhance_kpis_table',1),(17,'2026_04_15_185020_add_new_statuses_to_conventions_table',1),(18,'2026_04_19_002344_make_value_nullable_in_kpis_table',1),(19,'2026_04_19_002609_add_valeur_reference_to_conventions_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) unsigned NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('014c3f5d-1984-4acb-94e1-32b58e41e94a','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":19,\"convention_name\":\"Recherche formation\",\"status\":\"brouillon\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Le dossier a \\u00e9t\\u00e9 rejet\\u00e9 pour correction.\"}',NULL,'2026-04-20 23:32:04','2026-04-20 23:32:04'),('02cbd864-51f1-43db-8248-953b2f89508e','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-21 23:05:49','2026-04-21 23:05:49'),('085a1bd5-fcd9-4e2b-bea6-0102cb1b396b','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":10,\"convention_name\":\"Projet de Recherche Solaire\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 14:50:22','2026-04-20 14:50:22'),('1ba97347-1286-4eca-9e0b-43c2737a4bdc','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":11,\"convention_name\":\"Modernisation de la Biblioth\\u00e8que\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-20 19:28:00','2026-04-20 19:28:00'),('2289286d-9348-4fc6-9ee4-92d43059572f','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":20,\"convention_name\":\"hliekfjerkj\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}','2026-04-21 18:17:52','2026-04-21 18:00:10','2026-04-21 18:17:52'),('22e8aacc-6a52-4af4-9a07-434854d951b4','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',1,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"soumis\",\"actor_name\":\"Admin ConvManager\",\"message\":\"Un nouveau dossier est en attente de votre instruction.\"}',NULL,'2026-04-20 20:35:55','2026-04-20 20:35:55'),('276979df-d357-4c74-8a81-0741efc886d7','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":11,\"convention_name\":\"Modernisation de la Biblioth\\u00e8que\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 19:26:01','2026-04-20 19:26:01'),('29592cd1-c625-4cf7-a162-f3eee8b074c8','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_juridique\",\"actor_name\":\"Service Juridique\",\"message\":\"Visa juridique accord\\u00e9, retour \\u00e0 la Direction.\"}','2026-04-20 17:10:49','2026-04-20 16:22:32','2026-04-20 17:10:49'),('2e3f70ba-d1d5-4b46-aa32-20557a3b70d9','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_juridique\",\"actor_name\":\"Service Juridique\",\"message\":\"Visa juridique accord\\u00e9, retour \\u00e0 la Direction.\"}',NULL,'2026-04-20 14:05:48','2026-04-20 14:05:48'),('2e668a5b-aa9d-4287-aa8a-3590060e4a65','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',4,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"pret_pour_signature\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier valid\\u00e9 par la Direction, en attente de signature.\"}',NULL,'2026-04-21 23:33:02','2026-04-21 23:33:02'),('3325b93c-d984-428c-9414-2b7b38648ba6','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":11,\"convention_name\":\"Modernisation de la Biblioth\\u00e8que\",\"status\":\"valide_juridique\",\"actor_name\":\"Service Juridique\",\"message\":\"Visa juridique accord\\u00e9, retour \\u00e0 la Direction.\"}',NULL,'2026-04-20 19:30:45','2026-04-20 19:30:45'),('3460be5e-f053-40b7-9126-5d1d36481602','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":18,\"convention_name\":\"testprojet\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-20 17:36:16','2026-04-20 17:36:16'),('34689a78-9c3a-41bd-a851-61bfb6e5717e','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":18,\"convention_name\":\"testprojet\",\"status\":\"valide_juridique\",\"actor_name\":\"Service Juridique\",\"message\":\"Visa juridique accord\\u00e9, retour \\u00e0 la Direction.\"}','2026-04-20 17:38:21','2026-04-20 17:37:48','2026-04-20 17:38:21'),('34fc44d6-6757-486b-a954-b8988029a65c','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":19,\"convention_name\":\"Recherche formation\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 23:00:48','2026-04-20 23:00:48'),('356c1f03-58d4-4348-b622-31d0d1cbdeb1','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',4,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"pret_pour_signature\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier valid\\u00e9 par la Direction, en attente de signature.\"}',NULL,'2026-04-20 14:06:54','2026-04-20 14:06:54'),('3b9c2347-444a-4375-a50c-dd9460d1c55c','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 14:03:46','2026-04-20 14:03:46'),('3c4a252c-aa25-43f5-9c9e-b4d6c2a76c1a','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-20 14:04:21','2026-04-20 14:04:21'),('47cb3cac-9089-40b5-b2d4-45270e225d01','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-20 16:21:16','2026-04-20 16:21:16'),('4cd5e633-7740-4d32-b43b-8a4059f1769f','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":19,\"convention_name\":\"Recherche formation\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 23:01:22','2026-04-20 23:01:22'),('55c24daa-32d4-4ee9-818d-89b940176e5a','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":19,\"convention_name\":\"Recherche formation\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-20 23:15:24','2026-04-20 23:15:24'),('59c7da59-dae1-40c6-84b2-2e368d933936','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":19,\"convention_name\":\"Recherche formation\",\"status\":\"valide_juridique\",\"actor_name\":\"Service Juridique\",\"message\":\"Visa juridique accord\\u00e9, retour \\u00e0 la Direction.\"}',NULL,'2026-04-20 23:31:21','2026-04-20 23:31:21'),('6000b1bd-607a-4d5d-b75f-e96534bf7e81','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":11,\"convention_name\":\"Modernisation de la Biblioth\\u00e8que\",\"status\":\"termine\",\"actor_name\":\"Recteur UIDT\",\"message\":\"Le dossier a \\u00e9t\\u00e9 sign\\u00e9 par le Recteur.\"}',NULL,'2026-04-20 19:33:27','2026-04-20 19:33:27'),('6be2c163-adeb-47bc-ad84-337ee930432e','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 14:03:46','2026-04-20 14:03:46'),('7326cb36-ace6-43f8-bdc5-2dffe8b42f41','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-21 17:22:47','2026-04-21 17:22:47'),('771f115e-52ff-448e-b536-20e54ad6b4cb','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',4,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"pret_pour_signature\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier valid\\u00e9 par la Direction, en attente de signature.\"}',NULL,'2026-04-20 16:23:57','2026-04-20 16:23:57'),('7ec10281-c6cb-4183-a72d-031b2e088e82','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 16:20:21','2026-04-20 16:20:21'),('7f1da16a-28e2-4e64-8dc8-cef79f9e708b','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":10,\"convention_name\":\"Projet de Recherche Solaire\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 14:50:22','2026-04-20 14:50:22'),('863cbdf0-7100-4c51-b6bb-2bb188a3e946','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"valide_juridique\",\"actor_name\":\"Service Juridique\",\"message\":\"Visa juridique accord\\u00e9, retour \\u00e0 la Direction.\"}',NULL,'2026-04-21 23:29:04','2026-04-21 23:29:04'),('8933b311-2e7b-4774-9259-a43f89fa8d70','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"termine\",\"actor_name\":\"Recteur UIDT\",\"message\":\"Le dossier a \\u00e9t\\u00e9 sign\\u00e9 par le Recteur.\"}',NULL,'2026-04-21 17:26:46','2026-04-21 17:26:46'),('8aa6541f-abf3-46be-a8d0-04da39ecd924','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',4,'{\"convention_id\":11,\"convention_name\":\"Modernisation de la Biblioth\\u00e8que\",\"status\":\"pret_pour_signature\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier valid\\u00e9 par la Direction, en attente de signature.\"}',NULL,'2026-04-20 19:31:53','2026-04-20 19:31:53'),('90655cab-f7b6-4e4b-9db2-0197ca90dd5f','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"termine\",\"actor_name\":\"Recteur UIDT\",\"message\":\"Le dossier a \\u00e9t\\u00e9 sign\\u00e9 par le Recteur.\"}',NULL,'2026-04-21 23:37:30','2026-04-21 23:37:30'),('926cb903-07b6-480e-b0b1-05a57afb44ad','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-21 23:14:44','2026-04-21 23:14:44'),('9f9aade9-1ee5-4947-b9b0-a292c53326d8','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":19,\"convention_name\":\"Recherche formation\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 23:00:59','2026-04-20 23:00:59'),('a927f125-409f-4e46-9aa8-a8a657b23cb7','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":18,\"convention_name\":\"testprojet\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 17:30:35','2026-04-20 17:30:35'),('a9c98555-0512-4f9e-9b86-0e6096c463fd','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-21 17:23:50','2026-04-21 17:23:50'),('ade34e1b-f0c3-4105-8e83-aa271a541a48','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 16:20:21','2026-04-20 16:20:21'),('aff5e1a3-b69a-4624-9b31-bf749857f26e','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"termine\",\"actor_name\":\"Recteur UIDT\",\"message\":\"Le dossier a \\u00e9t\\u00e9 sign\\u00e9 par le Recteur.\"}',NULL,'2026-04-20 16:25:28','2026-04-20 16:25:28'),('b17c6ce3-13c6-41e3-8b4a-2601219ed83c','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"valide_juridique\",\"actor_name\":\"Service Juridique\",\"message\":\"Visa juridique accord\\u00e9, retour \\u00e0 la Direction.\"}',NULL,'2026-04-21 17:24:50','2026-04-21 17:24:50'),('b9e00d40-cd69-44ec-9127-80091ae0b91a','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":11,\"convention_name\":\"Modernisation de la Biblioth\\u00e8que\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}',NULL,'2026-04-20 19:26:01','2026-04-20 19:26:01'),('d29ea91f-df4a-45fc-9392-4ae397d112cf','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',4,'{\"convention_id\":15,\"convention_name\":\"Convention expirant bient\\u00f4t A\",\"status\":\"pret_pour_signature\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier valid\\u00e9 par la Direction, en attente de signature.\"}',NULL,'2026-04-21 17:25:38','2026-04-21 17:25:38'),('d67f1fd6-f5c1-429e-9eb3-81c32b922fe4','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":18,\"convention_name\":\"testprojet\",\"status\":\"termine\",\"actor_name\":\"Recteur UIDT\",\"message\":\"Le dossier a \\u00e9t\\u00e9 sign\\u00e9 par le Recteur.\"}','2026-04-20 17:44:44','2026-04-20 17:40:58','2026-04-20 17:44:44'),('da8b9377-75ac-41ec-b255-7df956a9bfa5','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',3,'{\"convention_id\":18,\"convention_name\":\"testprojet\",\"status\":\"valide_chef_division\",\"actor_name\":\"Chef de Division\",\"message\":\"Le statut du dossier a \\u00e9t\\u00e9 mis \\u00e0 jour.\"}','2026-04-20 17:35:08','2026-04-20 17:30:35','2026-04-20 17:35:08'),('ee2e803d-8db2-4ab9-9e67-bed24cdd07fd','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',4,'{\"convention_id\":18,\"convention_name\":\"testprojet\",\"status\":\"pret_pour_signature\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier valid\\u00e9 par la Direction, en attente de signature.\"}',NULL,'2026-04-20 17:38:55','2026-04-20 17:38:55'),('f6a2785d-e7c9-4b02-b5e0-b31885a2776f','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":1,\"convention_name\":\"Aider les enfants d\\u00e9munies\",\"status\":\"termine\",\"actor_name\":\"Recteur UIDT\",\"message\":\"Le dossier a \\u00e9t\\u00e9 sign\\u00e9 par le Recteur.\"}',NULL,'2026-04-20 14:08:06','2026-04-20 14:08:06'),('f9e4bf41-4c7d-4e29-9efa-c0e2aec527ef','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',2,'{\"convention_id\":20,\"convention_name\":\"hliekfjerkj\",\"status\":\"brouillon\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Le dossier a \\u00e9t\\u00e9 rejet\\u00e9 pour correction.\"}',NULL,'2026-04-21 18:06:45','2026-04-21 18:06:45'),('fc53c072-1330-4544-bdc3-d0ce8db326b2','App\\Notifications\\ConventionStatusChanged','App\\Models\\User',5,'{\"convention_id\":10,\"convention_name\":\"Projet de Recherche Solaire\",\"status\":\"valide_dir_initial\",\"actor_name\":\"Directeur Coop\\u00e9ration\",\"message\":\"Dossier en attente de visa juridique.\"}',NULL,'2026-04-20 14:51:24','2026-04-20 14:51:24');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partenaires`
--

DROP TABLE IF EXISTS `partenaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partenaires` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `partenaires_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partenaires`
--

LOCK TABLES `partenaires` WRITE;
/*!40000 ALTER TABLE `partenaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `partenaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (29,'App\\Models\\User',3,'auth_token','39cce0cc2e56928d891f4efe62d54e1741c804ac9db54ebd8be6aea3f748b354','[\"*\"]','2026-04-21 02:31:41',NULL,'2026-04-20 17:10:11','2026-04-21 02:31:41'),(70,'App\\Models\\User',2,'auth_token','e02515b21a4294ac9e3cb241079ba95e77694b7fbcb441015cb2dfbda8e33134','[\"*\"]','2026-04-21 21:39:11',NULL,'2026-04-21 18:39:28','2026-04-21 21:39:11');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','2026-04-20 13:43:42','2026-04-20 13:43:42'),(2,'responsable','2026-04-20 13:43:42','2026-04-20 13:43:42'),(3,'porteur_projet','2026-04-20 13:43:42','2026-04-20 13:43:42'),(4,'directeur_cooperation','2026-04-20 13:43:42','2026-04-20 13:43:42'),(5,'recteur','2026-04-20 13:43:42','2026-04-20 13:43:42'),(6,'partenaire','2026-04-20 13:43:42','2026-04-20 13:43:42'),(7,'service_juridique','2026-04-20 13:43:42','2026-04-20 13:43:42'),(8,'chef_division','2026-04-20 13:43:42','2026-04-20 13:43:42'),(9,'secretariat','2026-04-22 00:00:35','2026-04-22 00:00:35');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('cz5QEVHWQ3G7y4G1TmluGjsGo5EZPW6uKYinU0WT',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJLZ255QzFzMzdYaUZkemFwVFJFek9qR1hOQnJmRVJ1MjJYcW1BVnFRIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1776693233),('NGk0LQ6PKJM30JTydW2GELZwMF3kqGRPNlYOq2ML',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJVT3Y0enZ4REVBM1pkYjY5QjN6dUNXdjhBZmNTSEVsZktVdFJnYXNwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1776700961);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'Admin ConvManager','admin@convmanager.com',NULL,'$2y$12$fWbJy5mgCA2g4JuARiwqme7qU0NRLGgecGgJYYFiMWfBJJ7nqB5sq',NULL,'2026-04-21 16:59:29','2026-04-20 13:43:43','2026-04-21 16:59:29'),(2,3,'Dr. Moussa Ndiaye','porteur@uidt.sn',NULL,'$2y$12$undvvIBhSuov25FDrUqnq.2tw.Y4NhwRK0pgaQoXb8k8HJTkSUq1O',NULL,'2026-04-21 22:03:09','2026-04-20 13:43:44','2026-04-21 22:03:09'),(3,4,'Directeur Coopération','directeur@uidt.sn',NULL,'$2y$12$M4LjhcXp2tqGzCijvxPpUeQ8gxFuom5/UPToQIwNacCkZWv.ODLmC',NULL,'2026-04-22 00:47:39','2026-04-20 13:43:44','2026-04-22 00:47:39'),(4,5,'Recteur UIDT','recteur@uidt.sn',NULL,'$2y$12$iy5.3tWLfxSErrnykJxMie1Wr6K8T5X5PG9JjGnFJuBjt1hR2FfbG',NULL,'2026-04-22 01:20:28','2026-04-20 13:43:45','2026-04-22 01:20:28'),(5,7,'Service Juridique','juridique@uidt.sn',NULL,'$2y$12$ZDONBO6eH9bn5ySoSIyQP.DAvLPgYir60JUyUsfS6ylaG/jGbhYz.',NULL,'2026-04-21 23:28:29','2026-04-20 13:43:46','2026-04-21 23:28:29'),(6,8,'Chef de Division','chef@uidt.sn',NULL,'$2y$12$wqThDUcXB5RhlaoT4K89NeCkz9xBl7fsbPJ.umufG4FPmRl9nDx3S',NULL,'2026-04-21 23:07:14','2026-04-20 13:43:46','2026-04-21 23:07:14'),(7,9,'Secrétariat Général','secretariat@uidt.sn',NULL,'$2y$12$1hYu/36CN6tCSk2j9vLclONFp3NnpY6SPJIq.8V37tmvgYnwqa3QK',NULL,'2026-04-22 00:58:32','2026-04-22 00:00:38','2026-04-22 00:58:32');
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

-- Dump completed on 2026-04-22  2:39:19
