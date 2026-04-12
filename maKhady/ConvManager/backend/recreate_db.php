<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db = 'convmanager_v2';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Attempting to clean up database directory files manually...\n";
    $dbPath = "C:\\xampp\\mysql\\data\\$db";
    if (is_dir($dbPath)) {
        $files = glob($dbPath . DIRECTORY_SEPARATOR . "*");
        foreach ($files as $file) {
            if (is_file($file)) {
                echo "Deleting $file...\n";
                @unlink($file);
            }
        }
    }

    echo "Dropping database $db...\n";
    $pdo->exec("DROP DATABASE IF EXISTS `$db` ");
    
    echo "Creating database $db...\n";
    $pdo->exec("CREATE DATABASE `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "Database $db recreated successfully.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    // Check if directory still exists and try to report content
    if (is_dir("C:\\xampp\\mysql\\data\\$db")) {
        echo "Remaining files in directory:\n";
        print_r(scandir("C:\\xampp\\mysql\\data\\$db"));
    }
    exit(1);
}
