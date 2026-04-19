<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SHOW VARIABLES WHERE Variable_name = 'datadir'");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $datadir = $row['Value'];
    
    $dbDir = $datadir . 'coopmanager';
    echo "Data dir is: " . $dbDir . "\n";
    
    // Function to recursively remove directory
    function rrmdir($dir) {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (is_dir($dir. DIRECTORY_SEPARATOR .$object) && !is_link($dir."/".$object))
                        rrmdir($dir. DIRECTORY_SEPARATOR .$object);
                    else
                        unlink($dir. DIRECTORY_SEPARATOR .$object);
                }
            }
            rmdir($dir);
        }
    }
    
    if (is_dir($dbDir)) {
        echo "Removing directory manually...\n";
        rrmdir($dbDir);
    }
    
    $pdo->exec("DROP DATABASE IF EXISTS coopmanager");
    $pdo->exec("CREATE DATABASE coopmanager");
    echo "Database coopmanager recreated successfully.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
