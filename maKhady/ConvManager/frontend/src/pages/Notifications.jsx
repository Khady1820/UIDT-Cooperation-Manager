import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Erreur fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read_at: new Date() } : n
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.post('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date() })));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case 'soumis': return 'assignment';
            case 'valide_chef_division': return 'fact_check';
            case 'valide_dir_initial': return 'task_alt';
            case 'valide_juridique': return 'gavel';
            case 'pret_pour_signature': return 'draw';
            case 'termine': return 'verified';
            case 'brouillon': return 'error_outline';
            case 'rejete': return 'cancel';
            default: return 'notifications';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'soumis': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'valide_chef_division': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
            case 'valide_dir_initial': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
            case 'valide_juridique': return 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20';
            case 'pret_pour_signature': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
            case 'termine': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
            case 'brouillon':
            case 'rejete': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20';
            default: return 'text-gray-500 bg-gray-50 dark:bg-slate-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
                    <p className="text-xs font-black text-[#2E2F7F] dark:text-white tracking-widest uppercase">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#2E2F7F] to-[#003566] dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center shadow-xl shadow-[#2E2F7F]/20 dark:shadow-black/20">
                        <span className="material-symbols-outlined text-white text-3xl">notifications_active</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#2E2F7F] dark:text-white tracking-tight">Alertes Institutionnelles</h1>
                        <p className="text-[11px] font-bold text-[#F7931E] uppercase tracking-[0.3em] mt-1 ml-0.5 dark:text-amber-400/80">Centre de Notification UIDT</p>
                    </div>
                </div>
                
                {notifications.some(n => !n.read_at) && (
                    <button 
                        onClick={markAllRead}
                        className="px-6 py-3 bg-[#F1F3F5] dark:bg-slate-800 hover:bg-[#E9ECEF] dark:hover:bg-slate-700 text-[#2E2F7F] dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-gray-100 dark:border-slate-700 shadow-sm"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {/* Notifications list */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-20 border-dashed border-gray-200 dark:border-slate-700 text-center space-y-4 rounded-[2.5rem]">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-slate-600">notifications_off</span>
                        </div>
                        <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Aucune notification archivée</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notifications.map((n, index) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group relative bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:shadow-[#2E2F7F]/5 dark:hover:shadow-black/20 hover:border-[#2E2F7F]/10 transition-all duration-300 ${!n.read_at ? 'ring-2 ring-blue-500/5' : 'grayscale-[0.5] opacity-80'}`}
                            >
                                <div className="flex gap-6 items-start">
                                    {/* Icon Column */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-white/50 dark:border-white/10 ${getStatusColor(n.data.status)}`}>
                                        <span className="material-symbols-outlined text-2xl font-bold">
                                            {getIcon(n.data.status)}
                                        </span>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B68F40]">Alerte Système</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                                                    </span>
                                                </div>
                                                <h3 className={`text-lg font-black leading-tight ${!n.read_at ? 'text-[#2E2F7F] dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                                                    {n.data.message}
                                                </h3>
                                            </div>
                                            
                                            {!n.read_at && (
                                                <button 
                                                    onClick={() => markAsRead(n.id)}
                                                    className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Marquer comme lu"
                                                >
                                                    <span className="material-symbols-outlined text-lg">done_all</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-50 dark:border-slate-700">
                                            <div className="flex items-center gap-3 bg-gray-50/80 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-700">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400 dark:text-slate-500">description</span>
                                                <span className="text-[10px] font-black text-[#2E2F7F] dark:text-indigo-300 uppercase tracking-tighter truncate max-w-[200px]">
                                                    {n.data.convention_name}
                                                </span>
                                            </div>

                                            <button 
                                                onClick={() => navigate(`/conventions/${n.data.convention_id}`)}
                                                className="flex items-center gap-2 text-[10px] font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest hover:translate-x-1 transition-transform group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                            >
                                                Accéder au dossier 
                                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {!n.read_at && (
                                    <div className="absolute top-8 right-8 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Notifications;
