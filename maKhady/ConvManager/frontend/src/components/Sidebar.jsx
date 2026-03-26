import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

import logo from '../assets/logo_convmanager.png';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const isAdmin = user?.role?.name === 'admin';
    const isPartner = user?.role?.name === 'partenaire';

    const menuItems = [
        { icon: 'grid_view', label: t('dashboard'), path: '/' },
        { icon: 'description', label: t('conventions'), path: '/conventions' },
        { icon: 'analytics', label: t('indicators'), path: '/indicators' },
        ...(isAdmin ? [{ icon: 'settings', label: t('settings'), path: '/settings' }] : []),
        ...(isPartner ? [{ icon: 'handshake', label: t('partner_page'), path: '/partenaire' }] : []),
    ];

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-card-bg border-r border-outline-variant z-50 flex flex-col transition-colors duration-300">
            <div className="p-8 mb-4">
                <img src={logo} alt="ConvManager Logo" className="h-10 w-auto object-contain mx-auto" />
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-primary text-white shadow-premium' 
                                : 'text-surface-500 hover:bg-surface-100 hover:text-surface-900'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined text-[22px] leading-none">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {/* Subtle indicator for active state */}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-surface-200">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-surface-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-all duration-200 rounded-xl font-medium"
                >
                    <span className="material-symbols-outlined">logout</span>
                    {t('logout')}
                </button>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-50 mt-4 border border-outline-variant">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-surface-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-surface-500 truncate uppercase font-bold tracking-wider">{user?.role?.name}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
