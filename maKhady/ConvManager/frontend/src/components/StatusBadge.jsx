import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const StatusBadge = ({ status }) => {
    const { t } = useLanguage();
    
    const config = {
        'brouillon': { 
            color: 'bg-gray-100 text-gray-500 border-gray-200', 
            label: 'Brouillon', 
            icon: 'edit_note' 
        },
        'soumis': { 
            color: 'bg-blue-50 text-blue-600 border-blue-100', 
            label: 'En attente (Division)', 
            icon: 'send' 
        },
        'en attente': { 
            color: 'bg-blue-50 text-blue-600 border-blue-100', 
            label: 'En attente (Division)', 
            icon: 'send' 
        },
        'valide_chef_division': { 
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100', 
            label: 'En attente (Direction)', 
            icon: 'account_balance' 
        },
        'valide_dir_initial': { 
            color: 'bg-purple-50 text-purple-600 border-purple-100', 
            label: 'Visa Juridique', 
            icon: 'gavel' 
        },
        'valide_juridique': { 
            color: 'bg-cyan-50 text-cyan-600 border-cyan-100', 
            label: 'Contrôle Final', 
            icon: 'verified_user' 
        },
        'pret_pour_signature': { 
            color: 'bg-orange-50 text-orange-600 border-orange-100', 
            label: 'Prêt pour Signature', 
            icon: 'ink_pen' 
        },
        'termine': { 
            color: 'bg-green-50 text-green-600 border-green-100', 
            label: 'Signé & Archivé', 
            icon: 'task_alt' 
        },
        'rejete': { 
            color: 'bg-red-50 text-red-600 border-red-100', 
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
