import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Globe, Moon, Sun, CheckCircle, Camera, Edit2 } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const { darkMode, toggleDarkMode } = useTheme();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');

    useEffect(() => {
        setEditName(user?.name || '');
    }, [user]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [error, setError] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/change-password', passwordData);
            setShowPasswordModal(false);
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.new_password?.[0] || "Une erreur est survenue.");
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const res = await api.post('/update-profile', { name: editName });
            updateUser(res.data.user);
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error("Erreur mise à jour profil", err);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-surface-900 tracking-tight">{t('settings')}</h1>
                <p className="text-surface-500 font-medium italic">Personnalisez votre expérience et sécurisez votre accès.</p>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-24 right-8 z-[100] bg-secondary text-white px-6 py-3 rounded-2xl shadow-premium border border-secondary/20 flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-bold text-sm uppercase tracking-widest italic">Modifications enregistrées !</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
                            onClick={() => setShowPasswordModal(false)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-10 w-full max-w-md overflow-hidden flex flex-col shadow-2xl bg-card-bg border border-outline-variant rounded-3xl transition-colors duration-300"
                        >
                            <div className="p-6 border-b border-surface-100 bg-surface-50/50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-surface-900 leading-none">{t('change_password')}</h2>
                                <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-surface-200 rounded-full transition-colors text-surface-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {error && (
                                <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center italic">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Ancien mot de passe</label>
                                    <input 
                                        type="password"
                                        required
                                        className="premium-input"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Nouveau mot de passe</label>
                                    <input 
                                        type="password"
                                        required
                                        className="premium-input"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Confirmation</label>
                                    <input 
                                        type="password"
                                        required
                                        className="premium-input"
                                        value={passwordData.new_password_confirmation}
                                        onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                                    />
                                </div>
                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        className="premium-button-primary w-full py-4 text-xs font-black uppercase tracking-widest"
                                    >
                                        Mettre à jour la sécurité
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <div className="bg-card-bg rounded-2xl p-8 border border-outline-variant shadow-premium overflow-hidden relative group transition-colors duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center font-outfit">
                            <div className="relative mb-6">
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-primary to-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-primary/20"
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </motion.div>
                                <button className="absolute -bottom-2 -right-2 p-2.5 bg-white border border-surface-100 rounded-2xl shadow-premium text-primary hover:text-indigo-600 hover:scale-110 transition-all">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="w-full">
                                {isEditing ? (
                                    <div className="flex flex-col gap-4 w-full">
                                        <input 
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="premium-input text-center font-bold text-lg"
                                            autoFocus
                                        />
                                        <div className="flex gap-3 justify-center">
                                            <button 
                                                onClick={handleProfileUpdate}
                                                className="px-4 py-1.5 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-secondary/20 transition-all"
                                            >
                                                {t('save')}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditName(user?.name || '');
                                                }}
                                                className="px-4 py-1.5 bg-surface-100 text-surface-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-surface-200 transition-all"
                                            >
                                                {t('cancel')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-2 group/edit cursor-pointer mb-1" onClick={() => setIsEditing(true)}>
                                            <h2 className="text-2xl font-black text-surface-900 tracking-tight">{user?.name}</h2>
                                            <Edit2 className="w-3.5 h-3.5 text-surface-300 opacity-0 group-hover/edit:opacity-100 transition-all" />
                                        </div>
                                        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                                            {user?.role?.name || 'Utilisateur'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="w-full h-px bg-surface-50 my-8"></div>
                            
                            <div className="w-full space-y-6 text-left">
                                <div className="group/field">
                                    <p className="text-[10px] font-black text-surface-300 uppercase tracking-widest mb-1 group-hover/field:text-primary transition-colors">Identité Numérique</p>
                                    <p className="text-sm text-surface-600 font-bold">{user?.email}</p>
                                </div>
                                <div className="group/field">
                                    <p className="text-[10px] font-black text-surface-300 uppercase tracking-widest mb-1 group-hover/field:text-primary transition-colors">Ancienneté</p>
                                    <p className="text-sm text-surface-600 font-bold">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Depuis mars 2024'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Settings Options */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                    <div className="bg-card-bg rounded-2xl p-8 border border-outline-variant shadow-premium group transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">tune</span>
                            </div>
                            <h3 className="text-xl font-bold text-surface-900 tracking-tight">Préférences de l'Interface</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div 
                                onClick={() => setDarkMode(!darkMode)}
                                className="flex items-center justify-between p-5 rounded-2xl border border-surface-50 hover:border-primary/20 hover:bg-surface-50/50 transition-all cursor-pointer group/toggle"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-surface-50 text-surface-400 flex items-center justify-center group-hover/toggle:bg-white group-hover/toggle:text-primary transition-all">
                                        {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-surface-900 uppercase tracking-widest">{t('dark_mode')}</p>
                                        <p className="text-xs text-surface-400 font-medium italic mt-0.5">Basculer le thème visuel globale.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleDarkMode}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${darkMode ? 'bg-primary' : 'bg-surface-200'}`}
                                >
                                    <span className={`${darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`} />
                                </button>
                            </div>

                            <div className="relative">
                                <div className="flex items-center justify-between p-5 rounded-2xl border border-surface-50 hover:border-primary/20 hover:bg-surface-50/50 transition-all group/lang">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-surface-50 text-surface-400 flex items-center justify-center group-hover/lang:bg-white group-hover/lang:text-primary transition-all">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-surface-900 uppercase tracking-widest">{t('language')}</p>
                                            <p className="text-xs text-primary font-bold mt-0.5">{language}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-surface-300 group-hover/lang:text-primary transition-colors">
                                        Changer <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                    </div>
                                    <select 
                                        value={language}
                                        onChange={(e) => {
                                            changeLanguage(e.target.value);
                                            setShowSuccess(true);
                                            setTimeout(() => setShowSuccess(false), 2000);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    >
                                        <option value="Français (France)">Français (France)</option>
                                        <option value="English (US)">English (US)</option>
                                        <option value="Español">Español</option>
                                        <option value="Deutsch">Deutsch</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card-bg rounded-2xl p-8 border border-outline-variant shadow-premium transition-colors duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                <Lock className="w-4 h-4" />
                            </div>
                            <h3 className="text-xl font-bold text-surface-900 tracking-tight">Sécurité & Accès</h3>
                        </div>
                        
                        <div className="p-6 rounded-2xl border-2 border-dashed border-red-100 bg-red-50/20">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 text-center md:text-left">
                                    <p className="text-sm font-bold text-surface-700">Modification du code d'accès</p>
                                    <p className="text-xs text-surface-400 mt-1 italic">Assurez-vous d'utiliser un mot passe complexe pour garantir la sécurité de vos données analytiques.</p>
                                </div>
                                <button 
                                    onClick={() => setShowPasswordModal(true)}
                                    className="premium-button text-xs uppercase font-black tracking-widest whitespace-nowrap px-8 py-3.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-all scale-100 hover:scale-105 active:scale-95 shadow-sm"
                                >
                                    {t('change_password')}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Settings;
