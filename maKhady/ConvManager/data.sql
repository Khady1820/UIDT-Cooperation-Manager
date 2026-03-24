-- ==========================================================
-- Fichier d'alimentation SQL pour ConvManager
-- Exécutez ce fichier dans votre base de données MySQL
-- pour pré-remplir les données (Rôles, Admin, Conventions, KPIs)
-- ==========================================================

-- ATTENTION : Si vos tables ne sont pas vides, vous pouvez ignorer
-- l'insertion de l'Admin et des rôles pour éviter les doublons.

-- 1. Insertion des Rôles
INSERT IGNORE INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'admin', NOW(), NOW()),
(2, 'responsable', NOW(), NOW()),
(3, 'partenaire', NOW(), NOW());

-- 2. Insertion de l'Administrateur par défaut
-- Mot de passe: 'password' (hachage bcrypt Laravel standard)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `role_id`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@convmanager.com', 1, '$2y$12$T4C63E0b8fFh0Y4nE8OaCOA9.n3xT6RzKx5M0M1h21F1F8pZzS/Pq', NOW(), NOW());

-- 3. Insertion des Conventions
-- (Assurez-vous que l'auto-incrémentation commence à 1 ou modifiez les IDs des KPIs ci-dessous)
INSERT INTO `conventions` (`id`, `name`, `partners`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Convention Tech Africa 2026', 'Google, Microsoft, Orange', '2026-06-10', '2026-06-15', 'en attente', NOW(), NOW()),
(2, 'Sommet Santé et Innovation', 'OMS, Ministère de la Santé', '2025-10-01', '2025-10-05', 'terminé', NOW(), NOW()),
(3, 'Forum de l''Agriculture Durable', 'FAO, AGRA, Coopératives locales', '2026-03-20', '2026-03-25', 'en cours', NOW(), NOW()),
(4, 'Festival des Arts Numériques', 'Institut Français, Sony', '2026-08-05', '2026-08-12', 'en attente', NOW(), NOW()),
(5, 'Salon de l''Habitat', 'BHS, CSTT, Eiffage', '2025-12-10', '2025-12-15', 'terminé', NOW(), NOW());

-- 4. Insertion des KPIs
-- NB: Les `convention_id` correspondent aux ID des conventions insérées ci-dessus
INSERT INTO `kpis` (`convention_id`, `name`, `value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Participants Attendus', 5000.00, 'Nombre cible de visiteurs.', NOW(), NOW()),
(1, 'Sponsors Confirmés', 45.00, 'Objectif B2B.', NOW(), NOW()),
(1, 'Couverture Média', 120.00, 'Articles et passages TV attendus.', NOW(), NOW()),

(2, 'Participants', 3200.00, 'Médecins et chercheurs présents.', NOW(), NOW()),
(2, 'Ateliers Réalisés', 15.00, 'Ateliers pratiques organisés.', NOW(), NOW()),
(2, 'Taux de Satisfaction', 94.00, 'En pourcentage (%).', NOW(), NOW()),
(2, 'Partenariats Signés', 8.00, 'Accords B2B clôturés.', NOW(), NOW()),

(3, 'Visiteurs Actuels', 1850.00, 'Score à mi-parcours.', NOW(), NOW()),
(3, 'Stands', 80.00, 'Agriculteurs exposant.', NOW(), NOW()),
(3, 'Ventes (K FCFA)', 45000.00, 'Estimation des transactions.', NOW(), NOW()),

(4, 'Artistes Inscrits', 120.00, 'Créatifs participants.', NOW(), NOW()),
(4, 'Billets Vendus', 8500.00, 'Préventes actuelles.', NOW(), NOW()),

(5, 'Constructeurs', 60.00, 'Entreprises de BTP.', NOW(), NOW()),
(5, 'Contrats Signés', 310.00, 'Maisons / Parcelles.', NOW(), NOW()),
(5, 'Visiteurs', 14000.00, 'Grand public.', NOW(), NOW());
