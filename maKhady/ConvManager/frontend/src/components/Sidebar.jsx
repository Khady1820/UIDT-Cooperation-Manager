import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const { t } = useLanguage();
    const isAdmin = user?.role?.name === 'admin';
    const isPartner = user?.role?.name === 'partenaire';

    const menuItems = [
        { icon: 'dashboard', label: t('dashboard'), path: '/' },
        { icon: 'description', label: t('conventions'), path: '/conventions' },
        { icon: 'analytics', label: t('indicators'), path: '/indicators' },
        ...(isAdmin ? [{ icon: 'settings', label: t('settings'), path: '/settings' }] : []),
        ...(isPartner ? [{ icon: 'handshake', label: t('partner_page'), path: '/partenaire' }] : []),
    ];

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-white dark:bg-slate-900 z-50 flex flex-col py-6">
            <div className="px-6 mb-8">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">ConvManager</span>
            </div>
            
            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 transition-colors ${
                                isActive 
                                ? 'text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="font-inter body-md">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-6 mt-auto">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-slate-800 transition-colors font-inter body-md rounded-lg"
                >
                    <span className="material-symbols-outlined">logout</span>
                    {t('logout')}
                </button>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low mt-4">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-semibold truncate">{user?.name}</p>
                        <p className="text-[10px] text-on-surface-variant truncate uppercase">{user?.role?.name}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
