<?php

$host = '127.0.0.1';
$db   = 'convmanager_v3';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     echo "Connected to MySQL successfully.\n";
     
     echo "Creating database $db...\n";
     $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
     echo "Database $db created.\n";
     
} catch (\PDOException $e) {
     echo "Error: " . $e->getMessage() . "\n";
     exit(1);
}
