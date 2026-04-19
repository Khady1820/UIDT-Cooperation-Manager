import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
    const location = useLocation();
    const { t } = useLanguage();
    const { user } = useAuth();

    return (
        <aside className="h-screen w-72 fixed left-0 top-0 bg-institutional z-50 flex flex-col transition-all duration-300 shadow-[20px_0_50px_rgba(0,0,0,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            {/* Branding Section */}
            <div className="p-8 mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#001D3D] rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-[#001D3D]/20">
                            <span className="material-symbols-outlined text-white text-xl">account_balance</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-black text-white tracking-tight leading-none uppercase">{t('app_name')}</span>
                            <span className="text-[11px] font-black text-amber-400 mt-1.5 uppercase tracking-wide">{t('institutional_sub')}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                {user?.role?.name === 'admin' ? (
                    <>
                        <Link to="/" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">admin_panel_settings</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('admin_portal')}</span>
                        </Link>
                        
                        <Link to="/manage-users" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/manage-users' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/manage-users' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">group</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('manage_users')}</span>
                        </Link>
                        
                        <Link to="/manage-partners" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/manage-partners' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/manage-partners' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">corporate_fare</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('manage_partners')}</span>
                        </Link>

                        <Link to="/settings" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/settings' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/settings' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">settings</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('settings')}</span>
                        </Link>

                        <Link to="/archived" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/archived' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/archived' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">archive</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('archived')}</span>
                        </Link>

                        <Link to="/timeline" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/timeline' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/timeline' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">account_tree</span>
                            <span className="relative z-10 text-[15px] font-bold">Fil d'Activité</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">dashboard</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('dashboard')}</span>
                        </Link>
                        
                        <Link to="/conventions" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/conventions' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/conventions' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">folder_shared</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('conventions')}</span>
                        </Link>

                        {(user?.role?.name === 'porteur_projet' ||
                          user?.role?.name === 'chef_division' || 
                          user?.role?.name === 'directeur_cooperation' || 
                          user?.role?.name === 'service_juridique' || 
                          user?.role?.name === 'recteur') && (
                            <Link to="/validation" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/validation' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                                {location.pathname === '/validation' && (
                                    <motion.div 
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 material-symbols-outlined text-[20px]">fact_check</span>
                                <span className="relative z-10 text-[15px] font-bold">
                                    {user?.role?.name === 'porteur_projet' ? 'Suivi des Dossiers' : t('validation')}
                                </span>
                            </Link>
                        )}

                        <Link to="/indicators" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/indicators' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/indicators' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">insights</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('indicators')}</span>
                        </Link>

                        <Link to="/timeline" className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${location.pathname === '/timeline' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                            {location.pathname === '/timeline' && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 material-symbols-outlined text-[20px]">account_tree</span>
                            <span className="relative z-10 text-[15px] font-bold">{t('timeline')}</span>
                        </Link>

                        <div className="pt-4 mt-4 border-t border-white/10 space-y-1.5">
                            <Link to="/settings" className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 group ${location.pathname === '/settings' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                                {location.pathname === '/settings' && (
                                    <motion.div 
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 material-symbols-outlined text-[20px]">settings</span>
                                <span className="relative z-10 text-[15px] font-bold">{t('settings')}</span>
                            </Link>
                            <Link to="/archived" className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 group ${location.pathname === '/archived' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                                {location.pathname === '/archived' && (
                                    <motion.div 
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 material-symbols-outlined text-[20px]">archive</span>
                                <span className="relative z-10 text-[15px] font-bold">{t('archived')}</span>
                            </Link>
                            <Link to="/help" className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 group ${location.pathname === '/help' ? 'text-[#001D3D] font-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                                {location.pathname === '/help' && (
                                    <motion.div 
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-white rounded-2xl shadow-2xl shadow-white/20"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 material-symbols-outlined text-[20px]">help_center</span>
                                <span className="relative z-10 text-[15px] font-bold">{t('help_center')}</span>
                            </Link>
                        </div>
                    </>
                )}
            </nav>

            {/* Active Session Profile */}
            <div className="p-6 bg-white/5 m-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/20 p-1">
                        <img 
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-lg" 
                        />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[14px] font-black text-white tracking-tight truncate w-36">
                            {user?.name || 'Utilisateur'}
                        </span>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mt-0.5">
                            {user?.role?.name ? t(`role_${user.role.name}`) : t('chief_curator')}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
