import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const StatusBadge = ({ status }) => {
    const { t } = useLanguage();
    
    const config = {
        'brouillon': { 
            color: 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700', 
            label: 'Brouillon', 
            icon: 'edit_note' 
        },
        'soumis': { 
            color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30', 
            label: 'En attente (Division)', 
            icon: 'send' 
        },
        'en attente': { 
            color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30', 
            label: 'En attente (Division)', 
            icon: 'send' 
        },
        'valide_chef_division': { 
            color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30', 
            label: 'En attente (Direction)', 
            icon: 'account_balance' 
        },
        'valide_dir_initial': { 
            color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30', 
            label: 'Visa Juridique', 
            icon: 'gavel' 
        },
        'valide_juridique': { 
            color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/30', 
            label: 'Contrôle Final', 
            icon: 'verified_user' 
        },
        'pret_pour_signature': { 
            color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30', 
            label: 'Prêt pour Signature', 
            icon: 'ink_pen' 
        },
        'termine': { 
            color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30', 
            label: 'Signé & Archivé', 
            icon: 'task_alt' 
        },
        'rejete': { 
            color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30', 
            label: 'Rejeté / Action Requise', 
            icon: 'cancel' 
        }
    };

    const current = config[status] || config['brouillon'];

    return (
        <span className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-sm ${current.color}`}>
            <span className="material-symbols-outlined text-[14px]">{current.icon}</span>
            {current.label}
        </span>
    );
};

export default StatusBadge;
