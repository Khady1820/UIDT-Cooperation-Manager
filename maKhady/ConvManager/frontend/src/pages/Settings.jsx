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
            className="space-y-12 max-w-6xl mx-auto pb-20"
        >
            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-24 right-8 z-[100] bg-[#2E2F7F] text-white px-8 py-4 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-4"
                    >
                        <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <p className="font-black text-[10px] uppercase tracking-[0.2em] dark:text-white">Configuration mise à jour</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Section */}
            <div className="relative p-12 rounded-[3.5rem] bg-[#2E2F7F] text-white overflow-hidden shadow-2xl shadow-[#2E2F7F]/20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F7931E]/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-[80px]"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                            <span className="material-symbols-outlined text-4xl">settings_suggest</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">{t('settings')}</h1>
                            <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[9px] mt-1 italic">Centre de Configuration Institutionnel</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                            <p className="text-[9px] font-black text-[#F7931E] uppercase tracking-widest mb-1">Dernière Connexion</p>
                            <p className="text-xs font-bold">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Profile & Identity */}
                <motion.div variants={itemVariants} className="space-y-10">
                    <div className="premium-card p-10 flex flex-col items-center text-center relative group">
                        <div className="relative mb-8">
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#2E2F7F] to-[#003566] text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-[#2E2F7F]/30 border-4 border-white dark:border-slate-800"
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </motion.div>
                            <button className="absolute -bottom-2 -right-2 w-11 h-11 bg-white border border-gray-100 rounded-2xl shadow-xl text-[#2E2F7F] flex items-center justify-center hover:scale-110 transition-transform dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="w-full space-y-2 mb-10">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <input 
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="uidt-input w-full text-center font-black text-xl bg-gray-50 border-gray-100"
                                        autoFocus
                                    />
                                    <div className="flex gap-3 justify-center">
                                        <button onClick={handleProfileUpdate} className="px-5 py-2 bg-[#2E2F7F] text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">Enregistrer</button>
                                        <button onClick={() => { setIsEditing(false); setEditName(user?.name || ''); }} className="px-5 py-2 bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-xl">Annuler</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center group/edit cursor-pointer" onClick={() => setIsEditing(true)}>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-black text-[#2E2F7F] tracking-tight dark:text-white">{user?.name}</h2>
                                        <Edit2 className="w-4 h-4 text-gray-300 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-[10px] font-black text-[#F7931E] uppercase tracking-[0.2em] mt-1 italic">{user?.role?.name?.replace('_', ' ') || 'Membre Institutionnel'}</p>
                                </div>
                            )}
                        </div>

                        <div className="w-full pt-8 border-t border-gray-50 space-y-6 text-left">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">Adresse de contact</p>
                                <p className="text-sm font-bold text-[#2E2F7F] dark:text-white">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest dark:text-slate-400">Statut du Compte</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <p className="text-sm font-bold text-[#2E2F7F] dark:text-white">Actif & Certifié</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-10 bg-gradient-to-br from-[#F7931E] to-[#A68B6A] text-white">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none">Vérification Institutionnelle</h3>
                        </div>
                        <p className="text-xs font-bold leading-relaxed opacity-90">Votre profil est lié aux registres officiels de la Direction de la Coopération Internationale.</p>
                    </div>
                </motion.div>

                {/* Right Column: Options & Security */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
                    {/* General Preferences */}
                    <div className="premium-card p-12">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-[#2E2F7F]/5 text-[#2E2F7F] flex items-center justify-center dark:bg-white/10 dark:text-white">
                                <span className="material-symbols-outlined text-[24px]">palette</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#2E2F7F] tracking-tight dark:text-white">Préférences d'Interface</h3>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 dark:text-slate-400">Personnalisation de l'environnement</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Theme Toggle */}
                            <div 
                                onClick={toggleDarkMode}
                                className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50 border border-gray-100 hover:border-[#2E2F7F]/10 hover:bg-white transition-all cursor-pointer group/toggle dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${darkMode ? 'bg-slate-900 text-amber-400 shadow-inner' : 'bg-white text-blue-500 shadow-sm'}`}>
                                        {darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[#2E2F7F] uppercase tracking-widest dark:text-white">{t('dark_mode')}</p>
                                        <p className="text-[10px] text-slate-600 font-bold italic mt-0.5 dark:text-slate-400">Optimisation pour le confort visuel nocturne.</p>
                                    </div>
                                </div>
                                <div className={`relative w-14 h-7 rounded-full transition-colors duration-500 p-1 ${darkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-500 ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Language Selector */}
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Langue de l'espace de travail</label>
                                <div className="relative group/lang">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2E2F7F] z-10">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <select 
                                        value={language}
                                        onChange={(e) => {
                                            changeLanguage(e.target.value);
                                            setShowSuccess(true);
                                            setTimeout(() => setShowSuccess(false), 2000);
                                        }}
                                        className="uidt-input pl-16 appearance-none pr-12 cursor-pointer font-black text-[#2E2F7F] bg-gray-50 border-gray-100 py-5 rounded-[2rem] hover:bg-white hover:border-[#2E2F7F]/20 transition-all"
                                    >
                                        <option value="Français (France)">Français (France)</option>
                                        <option value="English (US)">English (US)</option>
                                        <option value="Español">Español</option>
                                        <option value="Deutsch">Deutsch</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="premium-card p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center dark:bg-rose-500/10 dark:text-rose-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#2E2F7F] tracking-tight dark:text-white">Sécurité du Compte</h3>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 dark:text-slate-400">Gestion des accès et mots de passe</p>
                            </div>
                        </div>
                        
                        <div className="bg-rose-50/30 p-8 rounded-[2.5rem] border border-rose-100 border-dashed dark:bg-rose-500/5 dark:border-rose-500/20">
                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm font-black text-[#2E2F7F] uppercase tracking-tight dark:text-white">Code d'Authentification</p>
                                    <p className="text-xs text-slate-600 font-bold leading-relaxed italic dark:text-slate-400">Il est recommandé de changer votre mot de passe tous les 90 jours pour maintenir l'intégrité de vos accès institutionnels.</p>
                                </div>
                                <button 
                                    onClick={() => setShowPasswordModal(true)}
                                    className="px-10 py-5 bg-white border-2 border-rose-500 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10 active:scale-95 dark:bg-slate-900 dark:hover:bg-rose-600"
                                >
                                    {t('change_password')}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#2E2F7F]/60 backdrop-blur-md"
                            onClick={() => setShowPasswordModal(false)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative z-10 w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-[#FBFBFB]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-[#2E2F7F] uppercase tracking-widest">{t('change_password')}</h3>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sécurité renforcée requise</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowPasswordModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-slate-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordChange} className="p-12 space-y-8">
                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Ancien mot de passe</label>
                                        <input type="password" required className="uidt-input w-full bg-gray-50" value={passwordData.current_password} onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Nouveau mot de passe</label>
                                        <input type="password" required className="uidt-input w-full bg-gray-50" value={passwordData.new_password} onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Confirmation du nouveau mot de passe</label>
                                        <input type="password" required className="uidt-input w-full bg-gray-50" value={passwordData.new_password_confirmation} onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})} />
                                    </div>
                                </div>
                                <button type="submit" className="institution-button mt-4">Actualiser la sécurité</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Settings;
