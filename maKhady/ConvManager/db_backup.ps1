# Script de sauvegarde automatique pour CoopManager
$DB_NAME = "coopmanager_v4"
$BACKUP_DIR = "backups_db"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmm"
$FILENAME = "$BACKUP_DIR/backup_$($DB_NAME)_$TIMESTAMP.sql"

# Liste des chemins probables de mysqldump (XAMPP, Laragon, MySQL standard)
$POSSIBLE_PATHS = @(
    "C:\xampp\mysql\bin\mysqldump.exe",
    "C:\laragon\bin\mysql\mysql-*\bin\mysqldump.exe",
    "C:\Program Files\MySQL\MySQL Server *\bin\mysqldump.exe",
    "mysqldump.exe" # Si déjà dans le PATH
)

$MYSQLDUMP_PATH = $null
foreach ($path in $POSSIBLE_PATHS) {
    $found = Get-ChildItem $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $MYSQLDUMP_PATH = $found.FullName
        break
    }
}

if (!$MYSQLDUMP_PATH) {
    Write-Host "ERREUR : Impossible de trouver 'mysqldump.exe' sur votre ordinateur." -ForegroundColor Red
    Write-Host "Veuillez vérifier que XAMPP ou MySQL est installé." -ForegroundColor Cyan
    pause
    exit
}

# Créer le dossier de backup s'il n'existe pas
if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
    Write-Host "Dossier $BACKUP_DIR créé." -ForegroundColor Cyan
}

Write-Host "Utilisation de : $MYSQLDUMP_PATH" -ForegroundColor Gray
Write-Host "Sauvegarde de la base de données $DB_NAME en cours..." -ForegroundColor Yellow

# Exécution du dump
try {
    & $MYSQLDUMP_PATH -u root $DB_NAME --result-file=$FILENAME 2>&1 | Tee-Object -Variable dbError
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Succès ! Votre sauvegarde est disponible ici : $FILENAME" -ForegroundColor Green
    } else {
        Write-Host "Erreur lors de la sauvegarde :" -ForegroundColor Red
        Write-Host $dbError -ForegroundColor Gray
    }
} catch {
    Write-Host "Une erreur système est survenue : $($_.Exception.Message)" -ForegroundColor Red
}

pause
