import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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

    return (
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-8 shadow-sm dark:shadow-none">
            <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 outline-none" placeholder={t('search')} type="text"/>
            </div>
            
            <div className="flex items-center gap-6 relative">
                <div className="relative">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative p-2 text-on-surface-variant hover:text-indigo-500 transition-colors rounded-full hover:bg-surface-container-low"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-[10px] text-white font-bold flex items-center justify-center rounded-full animate-pulse">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-glass border border-outline-variant/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low/50">
                                <h3 className="text-sm font-semibold text-on-surface uppercase tracking-wider">{t('notifications')}</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <span className="material-symbols-outlined text-on-surface-variant opacity-20 text-4xl mb-2">notifications_off</span>
                                        <p className="text-xs text-on-surface-variant">{t('no_notifications')}</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <Link 
                                            key={notif.id} 
                                            to={`/conventions/${notif.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors group"
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-sm">warning</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">
                                                        Convention <span className="font-bold">"{notif.name}"</span> en attente.
                                                    </p>
                                                    <p className="text-[10px] text-on-surface-variant mt-1 italic">Nécessite votre validation</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                            <div className="p-3 bg-surface-container-low/30 text-center border-t border-outline-variant/10">
                                <Link to="/conventions" onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-primary uppercase hover:underline">
                                    Voir tous les dossiers
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-[1px] bg-outline-variant"></div>
                <span className="font-inter label-md uppercase tracking-wider text-slate-500">ConvManager</span>
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
