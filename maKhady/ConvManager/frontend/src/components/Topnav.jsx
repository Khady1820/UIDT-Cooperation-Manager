import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Topnav = () => {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/conventions');
                const pending = res.data.filter(c => c.status === 'en attente');
                setNotifications(pending);
            } catch (error) {
                console.error("Erreur de notifications", error);
            }
        };
        fetchNotifications();
    }, []);

    const handleNotificationClick = async (id) => {
        try {
            await api.put(`/conventions/${id}`, { status: 'en cours' });
            setNotifications(notifications.filter(n => n.id !== id));
            setIsOpen(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la notification", error);
            setIsOpen(false);
        }
    };

    return (
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/80 backdrop-blur-md border-b border-surface-200 flex justify-between items-center px-8">
            <div className="flex items-center bg-surface-100 px-4 py-2 rounded-xl w-96 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white border border-transparent focus-within:border-primary/20 transition-all duration-200">
                <span className="material-symbols-outlined text-surface-400 mr-2 text-[20px]">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 outline-none placeholder:text-surface-400" placeholder={t('search')} type="text"/>
            </div>
            
            <div className="flex items-center gap-4 relative">
                <div className="relative">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative p-2.5 rounded-xl transition-all duration-200 ${isOpen ? 'bg-primary/10 text-primary' : 'text-surface-500 hover:bg-surface-100 hover:text-surface-900'}`}
                    >
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-premium border border-surface-200 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-4 border-b border-surface-100 bg-surface-50/50">
                                    <h3 className="text-sm font-bold text-surface-900 uppercase tracking-widest leading-none">{t('notifications')}</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-10 text-center">
                                            <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="material-symbols-outlined text-surface-400">notifications_off</span>
                                            </div>
                                            <p className="text-xs text-surface-500">{t('no_notifications')}</p>
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <Link 
                                                key={notif.id} 
                                                to={`/conventions/${notif.id}`}
                                                onClick={() => handleNotificationClick(notif.id)}
                                                className="block p-4 border-b border-surface-50 hover:bg-surface-50 transition-colors group"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined text-[18px]">priority_high</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-surface-900 leading-tight group-hover:text-primary transition-colors">
                                                            Convention <span className="text-primary font-bold">"{notif.name}"</span>
                                                        </p>
                                                        <p className="text-[10px] text-surface-500 mt-1 uppercase font-bold tracking-tighter">En attente de validation</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                                <div className="p-3 bg-surface-50 text-center border-t border-surface-100">
                                    <Link to="/conventions" onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                                        Voir tous les dossiers
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-6 w-px bg-surface-200 mx-1"></div>
                
                {/* Language or other quick actions can go here */}
                {/* Example placeholder for better visual balance */}
                <div className="w-8 h-8 rounded-full bg-surface-100 border border-surface-200 flex items-center justify-center overflow-hidden">
                   <span className="material-symbols-outlined text-surface-400 text-[18px]">help</span>
                </div>
            </div>

            {/* Backdrop for closing dropdown */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </header>
    );
};

export default Topnav;
