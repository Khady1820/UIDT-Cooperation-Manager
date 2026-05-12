import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Topnav = ({ onMenuClick }) => {
    const { searchQuery, setSearchQuery } = useSearch();
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const dropdownRef = useRef(null);

    // Live Clock Timer
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on navigation
    useEffect(() => {
        setIsDropdownOpen(false);
    }, [location]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('global-search')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Optional: poll every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Erreur notifications:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.read_at) {
                await api.post(`/notifications/${notification.id}/read`);
                fetchNotifications();
            }
            setIsDropdownOpen(false);
            if (notification.data.convention_id) {
                navigate(`/conventions/${notification.data.convention_id}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.post('/notifications/read-all');
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="no-print h-20 z-40 bg-institutional flex justify-between items-center px-6 lg:px-10 transition-all duration-300 shadow-2xl border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4 lg:gap-8 flex-1">
                {/* Mobile Hamburger */}
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-white/80 hover:text-white transition-all bg-white/5 rounded-xl border border-white/10"
                >
                    <span className="material-symbols-outlined text-[24px]">menu</span>
                </button>

                {/* Global Search Bar - Refined Design (Wider) */}
                <div className="hidden md:flex flex-1 max-w-2xl relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none">
                        <span className="material-symbols-outlined text-white/80 group-focus-within:text-[#F7931E] transition-all duration-300 text-[24px]">search</span>
                        <div className="h-6 w-px bg-white/30 group-focus-within:bg-[#F7931E]/40 transition-colors"></div>
                    </div>
                    
                    <input 
                        type="text" 
                        id="global-search"
                        placeholder="RECHERCHER UN DOSSIER..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/10 hover:bg-white/15 border-2 border-white/15 text-white rounded-[1.2rem] pl-16 pr-16 py-3 text-[11px] font-black uppercase tracking-wide placeholder:text-white/50 focus:outline-none focus:ring-8 focus:ring-[#F7931E]/5 focus:border-[#F7931E]/40 focus:bg-white/20 transition-all duration-300 shadow-xl"
                    />

                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    )}
                </div>

                {/* Institutional Info & Status - New Elements */}
                <div className="hidden xl:flex items-center gap-8 ml-4">
                    {/* Clock */}
                    <div className="flex flex-col items-start leading-none gap-1 px-4 border-l border-white/10">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">TEMPS RÉEL</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-black text-white tracking-widest">
                                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.15em]">SYSTÈME SÉCURISÉ</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleDarkMode}
                        className="p-2.5 text-white/60 hover:text-white transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                        title={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                    >
                        <span className="material-symbols-outlined text-[22px]">
                            {darkMode ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {/* Notification Bell */}
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`p-2 transition-all relative rounded-xl ${isDropdownOpen ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#2E2F7F] shadow-lg">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-4 w-96 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden z-[100] origin-top-right"
                            >
                                <div className="p-6 border-b border-gray-50 dark:border-slate-800 bg-[#FBFBFB] dark:bg-slate-900/50">
                                    <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Alertes Institutionnelles</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[9px] font-black text-secondary uppercase hover:underline">Tout marquer comme lu</button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                                    {notifications.length === 0 ? (
                                        <div className="p-12 text-center text-slate-600 dark:text-slate-400 italic">
                                            <span className="material-symbols-outlined text-4xl block mb-2 opacity-20">notifications_off</span>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Aucune alerte pour l'instant</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div 
                                                key={n.id}
                                                onClick={() => handleNotificationClick(n)}
                                                className={`p-6 border-b border-gray-50 dark:border-slate-800 flex gap-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors relative ${!n.read_at ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}`}
                                            >
                                                {!n.read_at && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm"></div>}
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-[#2E2F7F] dark:text-indigo-400 shrink-0 shadow-sm">
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {n.data.status === 'rejete' || n.data.status === 'brouillon' ? 'cancel' : 
                                                         n.data.status === 'termine' ? 'verified' : 
                                                         n.data.status === 'valide_juridique' ? 'gavel' :
                                                         n.data.status === 'pret_pour_signature' ? 'draw' :
                                                         'assignment'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-[11px] font-bold leading-relaxed ${!n.read_at ? 'text-[#2E2F7F] dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>
                                                        {n.data.message}
                                                    </p>
                                                    <p className="text-[9px] font-black text-[#B68F40] uppercase tracking-tighter truncate w-48">
                                                        {n.data.convention_name}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-4 bg-[#FBFBFB] dark:bg-slate-900/50 border-t border-gray-50 dark:border-slate-800 text-center">
                                    <button onClick={() => navigate('/notifications')} className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] hover:text-[#2E2F7F] dark:hover:text-white transition-colors">Voir toutes les alertes</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={() => navigate('/help')}
                        className="p-2 text-white/85 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-[24px]">help_outline</span>
                    </button>
                </div>

                <div className="h-6 w-px bg-white/10"></div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        {/* Le nom d'utilisateur a été retiré ici pour éviter la répétition avec la barre latérale */}
                        <button 
                            onClick={logout}
                            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[16px]">logout</span>
                            {t('logout')}
                        </button>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center p-0.5 shadow-inner">
                         <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="" className="w-full h-full rounded-full" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topnav;
