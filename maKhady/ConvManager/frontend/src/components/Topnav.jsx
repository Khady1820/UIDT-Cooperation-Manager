import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Topnav = () => {
    const { t } = useLanguage();
    const { searchQuery, setSearchQuery } = useSearch();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/conventions');
                let pending = res.data.filter(c => c.status === 'en attente');
                
                // Filter by partner name if not admin
                if (user && user.role?.name !== 'admin') {
                    pending = pending.filter(c => (c.partners || '').includes(user.name));
                }
                
                setNotifications(pending);
            } catch (error) {
                console.error("Erreur de notifications", error);
            }
        };
        fetchNotifications();
    }, [user]);

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
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-card-bg/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8 transition-colors duration-300">
            <div className="flex items-center bg-surface-alt px-4 py-2 rounded-xl w-96 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-card-bg border border-outline-variant focus-within:border-primary/20 transition-all duration-200">
                <span className="material-symbols-outlined text-surface-400 mr-2 text-[20px]">search</span>
                <input 
                    className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 outline-none placeholder:text-surface-400" 
                    placeholder={t('search')} 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (window.location.pathname !== '/conventions') {
                            navigate('/conventions');
                        }
                    }}
                />
            </div>
            
            <div className="flex items-center gap-4 relative">
                <div className="relative">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative p-2.5 rounded-xl transition-all duration-200 ${isOpen ? 'bg-primary/10 text-primary' : 'text-surface-500 hover:bg-surface-alt hover:text-surface-900'}`}
                    >
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 border-2 border-card-bg text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                {notifications.length > 9 ? '9+' : notifications.length}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-80 bg-card-bg rounded-2xl shadow-premium border border-outline-variant overflow-hidden z-50 origin-top-right transition-colors duration-300"
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
                
                <button 
                    onClick={() => setIsHelpOpen(true)}
                    className="w-8 h-8 rounded-full bg-surface-alt border border-outline-variant flex items-center justify-center overflow-hidden hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group"
                >
                   <span className="material-symbols-outlined text-surface-400 group-hover:text-primary text-[18px]">help</span>
                </button>
            </div>

            <AnimatePresence>
                {isHelpOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
                            onClick={() => setIsHelpOpen(false)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-10 w-full max-w-lg overflow-hidden flex flex-col shadow-2xl bg-card-bg border border-outline-variant rounded-3xl transition-colors duration-300"
                        >
                            <div className="p-6 border-b border-outline-variant bg-surface-alt/50 flex justify-between items-center transition-colors duration-300">
                                <h2 className="text-xl font-bold text-surface-900 leading-none">Guide d'utilisation</h2>
                                <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-surface-200 rounded-full transition-colors text-surface-400">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">dashboard</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-surface-900 mb-1 text-sm uppercase tracking-widest">Tableau de bord</h4>
                                            <p className="text-xs text-surface-500 leading-relaxed italic">Suivez en temps réel l'évolution globale des indicateurs clés (KPI) et le statut de vos conventions.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">article</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-surface-900 mb-1 text-sm uppercase tracking-widest">Gestion des Conventions</h4>
                                            <p className="text-xs text-surface-500 leading-relaxed italic">Créez, modifiez et archivez vos contrats de partenariat. Ajoutez des indicateurs de performance pour chaque dossier.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-4 rounded-2xl bg-accent/5 border border-accent/10">
                                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">analytics</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-surface-900 mb-1 text-sm uppercase tracking-widest">Suivi des KPI</h4>
                                            <p className="text-xs text-surface-500 leading-relaxed italic">Mettez à jour les valeurs de vos indicateurs pour générer des rapports analytiques précis et automatiques.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-4 rounded-2xl bg-surface-alt border border-outline-variant">
                                        <div className="w-10 h-10 rounded-xl bg-surface-200 text-surface-600 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-surface-900 mb-1 text-sm uppercase tracking-widest">Recherche Global</h4>
                                            <p className="text-xs text-surface-500 leading-relaxed italic">Utilisez la barre de recherche en haut pour trouver instantanément une convention ou un partenaire.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-surface-50 text-center">
                                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Besoin d'aide supplémentaire ? Contactez l'administrateur système.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
