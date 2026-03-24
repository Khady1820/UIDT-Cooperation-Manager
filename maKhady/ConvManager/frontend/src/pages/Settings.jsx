import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-glass border border-outline-variant/10 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-on-surface">{t('change_password')}</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error text-sm rounded-2xl flex items-center gap-3 italic">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase ml-2">Mot de passe actuel</label>
                                <input 
                                    type="password"
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase ml-2">Nouveau mot de passe</label>
                                <input 
                                    type="password"
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant uppercase ml-2">Confirmer le nouveau mot de passe</label>
                                <input 
                                    type="password"
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={passwordData.new_password_confirmation}
                                    onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-4 mt-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                            >
                                Mettre à jour
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <h1 className="text-display-md font-medium tracking-tight text-on-surface">{t('settings')}</h1>
                <p className="text-body-lg text-on-surface-variant">Gérez vos préférences et les informations de votre compte.</p>
            </div>

            {showSuccess && (
                <div className="fixed top-4 right-4 z-[100] bg-primary text-white px-6 py-3 rounded-2xl shadow-lg border border-primary-container animate-in slide-in-from-top-full duration-300 flex items-center gap-3">
                    <span className="material-symbols-outlined">check_circle</span>
                    <p className="font-medium">Action enregistrée avec succès !</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10 shadow-glass overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center text-display-sm font-bold mb-6 shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute bottom-6 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-md text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                </button>
                            </div>

                            <div className="flex flex-col items-center w-full">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        <input 
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="text-center bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-2 py-1 font-semibold text-on-surface"
                                            autoFocus
                                        />
                                        <div className="flex gap-2 justify-center">
                                            <button 
                                                onClick={handleProfileUpdate}
                                                className="text-[10px] font-bold uppercase text-success bg-success/10 px-3 py-1 rounded-full hover:bg-success/20 transition-all"
                                            >
                                                {t('save')}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditName(user?.name || '');
                                                }}
                                                className="text-[10px] font-bold uppercase text-error bg-error/10 px-3 py-1 rounded-full hover:bg-error/20 transition-all"
                                            >
                                                {t('cancel')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 group/edit">
                                            <h2 className="text-headline-sm font-semibold text-on-surface">{user?.name}</h2>
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="p-1 text-on-surface-variant opacity-0 group-hover/edit:opacity-100 hover:text-primary transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                        </div>
                                        <p className="text-label-lg text-primary uppercase tracking-widest mt-1">{user?.role?.name}</p>
                                    </>
                                )}
                            </div>
                            
                            <div className="w-full h-px bg-outline-variant/20 my-6"></div>
                            
                            <div className="w-full space-y-4 text-left">
                                <div>
                                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-body-md text-on-surface font-medium">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Membre depuis</p>
                                    <p className="text-body-md text-on-surface font-medium">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Options */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
                        <h3 className="text-title-lg font-semibold text-on-surface mb-6">Préférences de l'Interface</h3>
                        
                        <div className="space-y-6">
                            <div 
                                onClick={() => setDarkMode(!darkMode)}
                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-secondary-container/30 text-secondary">
                                        <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                                    </div>
                                    <div>
                                        <p className="text-body-lg font-medium text-on-surface">{t('dark_mode')}</p>
                                        <p className="text-body-sm text-on-surface-variant">Basculer entre le mode clair et sombre.</p>
                                    </div>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${darkMode ? 'bg-primary' : 'bg-outline-variant/30'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${darkMode ? 'left-7' : 'left-1'}`}></div>
                                </div>
                            </div>

                            <div className="relative group/lang">
                                <div 
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-tertiary-container/30 text-tertiary">
                                            <span className="material-symbols-outlined">language</span>
                                        </div>
                                        <div>
                                            <p className="text-body-lg font-medium text-on-surface">{t('language')}</p>
                                            <p className="text-body-sm text-on-surface-variant">{language}</p>
                                        </div>
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
                                    <span className="material-symbols-outlined text-on-surface-variant group-hover/lang:translate-x-1 transition-transform">chevron_right</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-sm">
                        <h3 className="text-title-lg font-semibold text-on-surface mb-6">Sécurité</h3>
                        
                        <div className="space-y-4">
                            <button 
                                onClick={() => setShowPasswordModal(true)}
                                className="flex w-full items-center justify-between p-4 rounded-2xl bg-primary text-white hover:opacity-90 transition-all shadow-md active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined">lock</span>
                                    <span className="font-medium">{t('change_password')}</span>
                                </div>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
