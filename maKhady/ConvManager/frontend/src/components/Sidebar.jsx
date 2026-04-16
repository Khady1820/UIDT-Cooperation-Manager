import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
    const location = useLocation();
    const { t } = useLanguage();
    const { user } = useAuth();

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-card-bg border-r border-outline-variant z-50 flex flex-col transition-all duration-300">
            {/* Branding Section */}
            <div className="p-8 mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#001D3D] rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-[#001D3D]/20">
                            <span className="material-symbols-outlined text-white text-xl">account_balance</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-surface-900 tracking-tight leading-none uppercase">{t('app_name')}</span>
                            <span className="text-[9px] font-bold text-[#8B7355] mt-0.5 uppercase tracking-tighter opacity-80">{t('institutional_sub')}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                {user?.role?.name === 'admin' ? (
                    <>
                        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                            <span className="text-[13px]">{t('admin_portal')}</span>
                        </Link>
                        
                        <Link to="/manage-users" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/manage-users' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">group</span>
                            <span className="text-[13px]">{t('manage_users')}</span>
                        </Link>
                        
                        <Link to="/manage-partners" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/manage-partners' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
                            <span className="text-[13px]">{t('manage_partners')}</span>
                        </Link>

                        <Link to="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/settings' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            <span className="text-[13px]">{t('settings')}</span>
                        </Link>

                        <Link to="/archived" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/archived' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">archive</span>
                            <span className="text-[13px]">{t('archived')}</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                            <span className="text-[13px]">{t('dashboard')}</span>
                        </Link>
                        
                        <Link to="/conventions" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/conventions' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                            <span className="text-[13px]">{t('conventions')}</span>
                        </Link>

                        {(user?.role?.name === 'chef_division' || 
                          user?.role?.name === 'directeur_cooperation' || 
                          user?.role?.name === 'service_juridique' || 
                          user?.role?.name === 'recteur') && (
                            <Link to="/validation" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/validation' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                                <span className="material-symbols-outlined text-[20px]">fact_check</span>
                                <span className="text-[13px]">{t('validation')}</span>
                            </Link>
                        )}

                        <Link to="/indicators" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/indicators' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">insights</span>
                            <span className="text-[13px]">{t('indicators')}</span>
                        </Link>

                        <Link to="/timeline" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/timeline' ? 'bg-surface-100 text-primary font-bold shadow-sm border border-outline-variant' : 'text-surface-500 hover:bg-surface-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">account_tree</span>
                            <span className="text-[13px]">{t('timeline')}</span>
                        </Link>

                        <div className="pt-4 mt-4 border-t border-outline-variant">
                            <Link to="/settings" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-surface-500 hover:bg-surface-100 ${location.pathname === '/settings' ? 'text-primary font-bold' : ''}`}>
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                <span className="text-[13px]">{t('settings')}</span>
                            </Link>
                            <Link to="/archived" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-surface-500 hover:bg-surface-100 ${location.pathname === '/archived' ? 'text-primary font-bold' : ''}`}>
                                <span className="material-symbols-outlined text-[20px]">archive</span>
                                <span className="text-[13px]">{t('archived')}</span>
                            </Link>
                            <Link to="/help" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-surface-500 hover:bg-surface-100 ${location.pathname === '/help' ? 'text-primary font-bold' : ''}`}>
                                <span className="material-symbols-outlined text-[20px]">help_center</span>
                                <span className="text-[13px]">{t('help_center')}</span>
                            </Link>
                        </div>
                    </>
                )}
            </nav>

            {/* Active Session Profile */}
            <div className="p-4 bg-surface-100 m-4 rounded-xl border border-outline-variant">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-card-bg border border-outline-variant p-0.5">
                        <img 
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-md" 
                        />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[11px] font-black text-surface-900 tracking-tight truncate w-32">
                            {user?.name || 'Utilisateur'}
                        </span>
                        <span className="text-[9px] font-bold text-surface-400 uppercase tracking-widest mt-0.5">
                            {user?.role?.name ? t(`role_${user.role.name}`) : t('chief_curator')}
                        </span>
                    </div>
                </div>
                <div className="mt-3 py-1 px-3 bg-card-bg rounded-md text-[9px] font-bold text-surface-900 uppercase tracking-widest flex items-center gap-2 border border-outline-variant">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    {t('active_session')}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
