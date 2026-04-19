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
        if (actionLower.includes('soumis') || actionLower.includes('submit')) return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        if (actionLower.includes('validé') || actionLower.includes('validate')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (actionLower.includes('signé') || actionLower.includes('sign')) return 'bg-slate-900 text-white border-slate-900';
        if (actionLower.includes('rejeté') || actionLower.includes('reject')) return 'bg-rose-50 text-rose-600 border-rose-100';
        if (actionLower.includes('creation')) return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    const getActionIcon = (action) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('soumis') || actionLower.includes('submit')) return 'send';
        if (actionLower.includes('validé') || actionLower.includes('validate')) return 'verified';
        if (actionLower.includes('signé') || actionLower.includes('sign')) return 'history_edu';
        if (actionLower.includes('rejeté') || actionLower.includes('reject')) return 'cancel';
        if (actionLower.includes('creation')) return 'add_circle';
        return 'info';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-900 tracking-widest uppercase">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20">
                        <span className="material-symbols-outlined text-white text-3xl">account_tree</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('timeline')}</h1>
                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-1 italic">{t('institutional_sub')}</p>
                    </div>
                </div>
                <button 
                    onClick={fetchLogs}
                    className="flex items-center gap-3 px-6 py-4 text-[10px] font-black text-slate-900 uppercase tracking-widest bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 active:scale-95 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    Actualiser le flux
                </button>
            </div>

            {/* Timeline Feed */}
            <div className="relative pl-12 space-y-10 before:content-[''] before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-100">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group"
                        >
                            {/* Dot Indicator */}
                            <div className={`absolute -left-[35px] top-2 w-11 h-11 rounded-2xl border border-white shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl z-10 ${getStatusStyles(log.action)}`}>
                                <span className="material-symbols-outlined text-[20px]">{getActionIcon(log.action)}</span>
                            </div>

                            {/* Activity Card */}
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 hover:border-slate-200 transition-all group-hover:shadow-2xl group-hover:shadow-slate-200/50">
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyles(log.action)}`}>
                                                {log.action}
                                            </span>
                                            <span className="text-[11px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-tight">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                {new Date(log.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600">
                                                <span className="material-symbols-outlined text-[18px]">person</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{log.user?.name}</span>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{log.user?.role?.name || 'Utilisateur'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Convention / Dossier</p>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                                {log.convention?.name || 'Projet Institutionnel'}
                                            </h3>
                                        </div>
                                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-100 relative italic">
                                            <span className="material-symbols-outlined absolute -left-3 -top-3 text-slate-500 text-3xl opacity-50">format_quote</span>
                                            <p className="text-sm font-bold text-slate-600 leading-relaxed pl-4">
                                                {log.comment || 'Aucune observation enregistrée pour cette étape.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-white p-24 rounded-[3.5rem] shadow-sm border border-slate-100 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-500 mb-8 border border-slate-100">
                            <span className="material-symbols-outlined text-[60px]">history_toggle_off</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Aucune activité</h3>
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Le flux institutionnel est actuellement vide.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timeline;
