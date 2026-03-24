import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    'Français (France)': {
        'dashboard': 'Tableau de bord',
        'conventions': 'Conventions',
        'settings': 'Paramètres',
        'logout': 'Se déconnecter',
        'partner_page': 'Ma Page',
        'notifications': 'Notifications',
        'all_conventions': 'Toutes les conventions',
        'pending_conventions': 'Conventions en attente',
        'active_conventions': 'Conventions actives',
        'completed_conventions': 'Conventions terminées',
        'no_notifications': 'Aucune notification',
        'change_password': 'Changer le mot de passe',
        'language': 'Langue',
        'dark_mode': 'Mode Sombre',
        'profile': 'Profil',
        'save': 'Sauvegarder',
        'cancel': 'Annuler',
        'edit': 'Modifier',
        'welcome': 'Bienvenue',
        'stats': 'Statistiques',
        'quick_actions': 'Actions Rapides',
        'total': 'Total',
        'active': 'En cours',
        'pending': 'En attente',
        'completed': 'Terminées',
        'search': 'Rechercher...',
        'notifications_pending': 'Vous avez {count} dossiers en attente',
        'login': 'Se connecter',
        'register': 'S\'inscrire',
        'email': 'Email',
        'password': 'Mot de passe',
        'confirm_password': 'Confirmer le mot de passe',
        'name': 'Nom Complet',
        'role': 'Rôle',
        'create_account': 'Créer mon compte',
        'already_have_account': 'Déjà un compte ?',
        'no_account': 'Pas encore de compte ?',
        'indicators': 'Indicateurs',
        'overview': 'Vue d’ensemble',
        'performance_overview': 'Suivi analytique et performance des conventions actives.',
        'export': 'Exporter',
        'new_convention': 'Nouvelle Convention',
        'num_conventions': 'Nombre de conventions',
        'avg_kpi': 'Moyenne des KPI',
        'active_partners': 'Partenaires actifs',
        'vs_last_month': 'vs mois dernier',
        'global_performance': 'performance globale',
        'new_this_semester': 'Nouveaux ce semestre',
        'kpi_evolution': 'Évolution globale des KPI',
        'aggregated_performance': 'Performance agrégée sur les 12 derniers mois',
        'convention_status_dist': 'Statut des conventions',
        'distribution_by_status': 'Répartition par état d’avancement',
        'q4_objectives': 'Objectifs Q4',
        'on_track': 'En bonne voie',
        'pending_attention': 'La convention "{name}" nécessite votre attention.',
        'all_dossiers': 'Consulter tous les dossiers',
        'loading': 'Chargement...',
    },
    'English (US)': {
        'dashboard': 'Dashboard',
        'conventions': 'Conventions',
        'settings': 'Settings',
        'logout': 'Logout',
        'partner_page': 'My Page',
        'notifications': 'Notifications',
        'all_conventions': 'All Conventions',
        'pending_conventions': 'Pending Conventions',
        'active_conventions': 'Active Conventions',
        'completed_conventions': 'Completed Conventions',
        'no_notifications': 'No notifications',
        'change_password': 'Change Password',
        'language': 'Language',
        'dark_mode': 'Dark Mode',
        'profile': 'Profile',
        'save': 'Save',
        'cancel': 'Cancel',
        'edit': 'Edit',
        'welcome': 'Welcome',
        'stats': 'Statistics',
        'quick_actions': 'Quick Actions',
        'total': 'Total',
        'active': 'Active',
        'pending': 'Pending',
        'completed': 'Completed',
        'search': 'Search...',
        'notifications_pending': 'You have {count} pending dossiers',
        'login': 'Login',
        'register': 'Register',
        'email': 'Email',
        'password': 'Password',
        'confirm_password': 'Confirm Password',
        'name': 'Full Name',
        'role': 'Role',
        'create_account': 'Create Account',
        'already_have_account': 'Already have an account?',
        'no_account': 'No account yet?',
        'indicators': 'Indicators',
        'overview': 'Overview',
        'performance_overview': 'Analytical tracking and performance of active conventions.',
        'export': 'Export',
        'new_convention': 'New Convention',
        'num_conventions': 'Number of Conventions',
        'avg_kpi': 'Average KPI',
        'active_partners': 'Active Partners',
        'vs_last_month': 'vs last month',
        'global_performance': 'global performance',
        'new_this_semester': 'New this semester',
        'kpi_evolution': 'Global KPI Evolution',
        'aggregated_performance': 'Aggregated performance over the last 12 months',
        'convention_status_dist': 'Convention Status',
        'distribution_by_status': 'Distribution by progress state',
        'q4_objectives': 'Q4 Objectives',
        'on_track': 'On track',
        'pending_attention': 'The convention "{name}" requires your attention.',
        'all_dossiers': 'View all dossiers',
        'loading': 'Loading...',
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'Français (France)');

    const t = (key, params = {}) => {
        let text = translations[language]?.[key] || translations['Français (France)'][key] || key;
        
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    };

    const changeLanguage = (newLang) => {
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <LanguageContext.Provider value={{ language, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
