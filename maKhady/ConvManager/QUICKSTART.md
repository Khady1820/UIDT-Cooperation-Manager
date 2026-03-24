# ConvManager - Guide de Démarrage Rapide

ConvManager est une application Fullstack (Laravel 11 + React/Vite) pour la gestion des conventions et de leurs KPIs, basée sur une interface "Analytical Atelier" (Shadcn/UI).

## Prérequis
- PHP 8.2+
- Composer
- Node.js & npm
- MySQL

## Installation & Démarrage

### 1. Backend (Laravel)

Ouvrez un terminal dans le dossier `backend` :
```bash
cd backend
```

Installez les dépendances :
```bash
composer install
```

Préparez l'environnement (le fichier `.env` est déjà configuré pour MySQL avec l'utilisateur `mg4`) :
```bash
php artisan key:generate
```

Générez la base de données et les données de test (rôles et compte administrateur par défaut) :
```bash
php artisan migrate --seed
```

Lancez le serveur de développement Laravel :
```bash
php artisan serve
```
Le backend sera disponible sur `http://localhost:8000`.

### 2. Frontend (React)

Ouvrez un second terminal dans le dossier `frontend` :
```bash
cd frontend
```

Installez les dépendances :
```bash
npm install
```

Lancez le serveur de développement Vite :
```bash
npm run dev
```
Le frontend sera disponible sur `http://localhost:5173`.

---

## Utilisation

Accédez au frontend dans votre navigateur.
Vous pouvez vous connecter avec le compte administrateur généré par défaut :

**Email :** `admin@convmanager.com`
**Mot de passe :** `password`

Une fois connecté, vous pourrez explorer le tableau de bord, gérer les conventions, exporter des données au format CSV et ajouter des indicateurs de performance (KPIs) de manière dynamique.
