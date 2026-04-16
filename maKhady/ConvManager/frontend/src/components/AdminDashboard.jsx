import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const res = await api.get('/admin/dashboard-stats');
                setStats(res.data);
            } catch (error) {
                console.error("Erreur de chargement des statistiques admin", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    if (loading || !stats) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-[#001D3D]/20 border-t-[#001D3D] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#001D3D] tracking-tight text-balance">Portail Administration</h1>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">Supervision Système • {new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }).toUpperCase()}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Total Users */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border-l-[6px] border-l-[#001D3D] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between h-52 group hover:shadow-xl transition-all">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Utilisateurs</h3>
                            <span className="material-symbols-outlined text-[#001D3D] opacity-20">group</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-[#001D3D]">{stats.total_users}</span>
                            <span className="text-sm font-bold text-gray-400">Comptes Actifs</span>
                        </div>
                    </div>
                </motion.div>

                {/* Total Partners */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border-l-[6px] border-l-[#8B7355] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between h-52 group hover:shadow-xl transition-all">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Partenaires</h3>
                            <span className="material-symbols-outlined text-[#8B7355] opacity-20">handshake</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-[#001D3D]">{stats.total_partners}</span>
                            <span className="text-sm font-bold text-gray-400">Institutions</span>
                        </div>
                    </div>
                </motion.div>

                {/* Total Archives */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border-l-[6px] border-l-[#E8E3D9] shadow-[0_20_50px_rgba(0,0,0,0.03)] flex flex-col justify-between h-52 group hover:shadow-xl transition-all">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Archives</h3>
                            <span className="material-symbols-outlined text-gray-400 opacity-20">inventory_2</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-[#001D3D]">{stats.total_archives}</span>
                            <span className="text-sm font-bold text-gray-400">Dossiers Classés</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Logins Table */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-xl font-black text-[#001D3D]">Connexions Récentes</h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Activité en Temps Réel</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] border-b border-gray-50">
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4 text-right">Dernière Connexion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recent_logins.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#001D3D]/5 flex items-center justify-center text-[#001D3D] font-black text-xs uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#001D3D] tracking-tight">{user.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            user.role?.name === 'admin' ? 'bg-[#001D3D] text-white' : 'bg-[#E8E3D9] text-[#8B7355]'
                                        }`}>
                                            {user.role?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <p className="text-xs font-black text-[#001D3D]">
                                            {new Date(user.last_login_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                                            {new Date(user.last_login_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
