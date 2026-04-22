<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class AdminController extends Controller
{
    public function backup()
    {
        $dbName = env('DB_DATABASE', 'coopmanager_v4');
        $dbUser = env('DB_USERNAME', 'root');
        $dbPass = env('DB_PASSWORD', '');
        $fileName = "backup_coopmanager_" . date('Y-m-d_H-i-s') . ".sql";
        $filePath = storage_path("app/" . $fileName);

        // Path to mysqldump in XAMPP
        $mysqldumpPath = 'C:\xampp\mysql\bin\mysqldump.exe';

        // Command for Windows
        $command = "\"$mysqldumpPath\" --user=$dbUser " . ($dbPass ? "--password=$dbPass " : "") . "$dbName > \"$filePath\"";
        
        try {
            // Use shell_exec for direct Windows command execution
            shell_exec($command);

            if (file_exists($filePath)) {
                return response()->download($filePath)->deleteFileAfterSend(true);
            } else {
                return response()->json(['message' => 'Erreur lors de la génération du fichier SQL'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur système: ' . $e->getMessage()], 500);
        }
    }
}
