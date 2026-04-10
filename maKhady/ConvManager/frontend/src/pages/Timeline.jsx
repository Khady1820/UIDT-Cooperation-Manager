import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Timeline = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (action) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('soumis') || actionLower.includes('submit')) return 'bg-blue-50 text-blue-600 border-blue-100';
        if (actionLower.includes('validé') || actionLower.includes('validate')) return 'bg-green-50 text-green-600 border-green-100';
        if (actionLower.includes('signé') || actionLower.includes('sign')) return 'bg-purple-50 text-purple-600 border-purple-100';
        if (actionLower.includes('rejeté') || actionLower.includes('reject')) return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-gray-50 text-gray-600 border-gray-100';
    };

    const getActionIcon = (action) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('soumis') || actionLower.includes('submit')) return 'send';
        if (actionLower.includes('validé') || actionLower.includes('validate')) return 'task_alt';
        if (actionLower.includes('signé') || actionLower.includes('sign')) return 'history_edu';
        if (actionLower.includes('rejeté') || actionLower.includes('reject')) return 'cancel';
        return 'info';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#001D3D]/10 border-t-[#001D3D] rounded-full animate-spin"></div>
                    <p className="text-xs font-black text-[#001D3D] tracking-widest uppercase">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#001D3D] rounded-xl flex items-center justify-center shadow-lg shadow-[#001D3D]/20">
                        <span className="material-symbols-outlined text-white text-2xl">account_tree</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#001D3D] tracking-tight">{t('timeline')}</h1>
                        <p className="text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mt-0.5">{t('institutional_sub')}</p>
                    </div>
                </div>
                <button 
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-[#001D3D] uppercase tracking-widest bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
                >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    Actualiser
                </button>
            </div>

            {/* Timeline Feed */}
            <div className="relative pl-8 space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#001D3D]/20 before:via-[#001D3D]/5 before:to-transparent">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group"
                        >
                            {/* Dot */}
                            <div className={`absolute -left-[27px] top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-125 z-10 ${getStatusStyles(log.action)}`}>
                                <span className="material-symbols-outlined text-[12px]">{getActionIcon(log.action)}</span>
                            </div>

                            {/* Card */}
                            <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-[#001D3D]/10 transition-all group-hover:-translate-y-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyles(log.action)}`}>
                                                {log.action}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {new Date(log.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-black text-[#001D3D] line-clamp-1">{log.convention?.name || 'Projet inconnu'}</h3>
                                        <p className="text-sm font-medium text-gray-500 italic">"{log.comment || 'Aucun commentaire'}"</p>
                                    </div>

                                    <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shrink-0">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-400">person</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-[#001D3D] uppercase tracking-tight">{log.user?.name}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{log.user?.role?.name || 'Utilisateur'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
                        <span className="material-symbols-outlined text-[60px] text-gray-200 mb-4">folder_open</span>
                        <p className="text-sm font-bold text-gray-400">Aucune activité institutionnelle enregistrée.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timeline;
