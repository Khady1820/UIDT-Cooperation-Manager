import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Topnav = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
        <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-20 z-40 bg-institutional flex justify-between items-center px-10 transition-all duration-300 shadow-2xl border-b border-white/10">
            <div className="flex items-center gap-8">
                <h2 className="text-lg font-black text-white tracking-tight uppercase">{t('app_name')}</h2>
                
                <div className="flex items-center bg-white/10 px-6 py-3 rounded-2xl w-80 border border-white/10 focus-within:border-white/30 focus-within:bg-white/20 focus-within:shadow-xl focus-within:shadow-black/5 transition-all duration-300">
                    <span className="material-symbols-outlined text-white/60 mr-3 text-[20px]">search</span>
                    <input 
                        className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 outline-none placeholder:text-white/40 font-bold text-white" 
                        placeholder={t('search')} 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 relative">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleDarkMode}
                        className="p-2 text-white/80 hover:text-white transition-all rounded-xl hover:bg-white/10"
                        title={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                    >
                        <span className="material-symbols-outlined text-[24px]">
                            {darkMode ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {/* Notification Bell */}
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`p-2 transition-all relative rounded-xl ${isDropdownOpen ? 'bg-surface-100 text-primary' : 'text-surface-400 hover:text-primary'}`}
                    >
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#001D3D] shadow-lg">
                                {unreadCount > 9 ? '9+' : unreadCount}
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
                                className="absolute top-full right-0 mt-4 w-96 bg-card-bg border border-outline-variant shadow-2xl rounded-[2rem] overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-6 border-b border-outline-variant bg-surface-50">
                                    <h3 className="text-[11px] font-black text-surface-900 uppercase tracking-widest">Alertes Institutionnelles</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[9px] font-black text-secondary uppercase hover:underline">Tout marquer comme lu</button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                                    {notifications.length === 0 ? (
                                        <div className="p-12 text-center text-slate-600 italic">
                                            <span className="material-symbols-outlined text-4xl block mb-2 opacity-20">notifications_off</span>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Aucune alerte pour l'instant</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div 
                                                key={n.id}
                                                onClick={() => handleNotificationClick(n)}
                                                className={`p-6 border-b border-gray-50 flex gap-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${!n.read_at ? 'bg-blue-50/20' : ''}`}
                                            >
                                                {!n.read_at && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm"></div>}
                                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#001D3D] shrink-0 shadow-sm">
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {n.data.status === 'rejete' ? 'cancel' : n.data.status === 'termine' ? 'verified' : 'assignment'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-[11px] font-bold leading-relaxed ${!n.read_at ? 'text-[#001D3D]' : 'text-gray-500'}`}>
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
                                <div className="p-4 bg-surface-50 border-t border-outline-variant text-center">
                                    <button onClick={() => navigate('/notifications')} className="text-[9px] font-black text-surface-400 uppercase tracking-[0.2em] hover:text-primary transition-colors">Voir toutes les alertes</button>
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
                    <div className="text-right">
                        <p className="text-[11px] font-black text-white uppercase tracking-wider">{user?.role?.name === 'admin' ? t('chief_curator') : user?.name}</p>
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
