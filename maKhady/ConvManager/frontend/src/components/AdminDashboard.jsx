import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const STATUS_COLORS = {
    'brouillon': '#94a3b8',
    'soumis': '#3b82f6',
    'en attente': '#f59e0b',
    'en cours': '#8b5cf6',
    'valide_dir_initial': '#6366f1',
    'valide_juridique': '#06b6d4',
    'pret_pour_signature': '#10b981',
    'signe_recteur': '#059669',
    'archive': '#64748b',
    'rejete': '#ef4444',
    'termine': '#1e293b'
};

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

    const handleBackup = async () => {
        try {
            const response = await api.get('/admin/backup', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `coopmanager_backup_${new Date().toISOString().slice(0, 10)}.sql`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde", error);
            alert("Erreur lors de la génération de la sauvegarde.");
        }
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
                    <h1 className="text-3xl font-black text-institutional tracking-tight text-balance">Portail Administration</h1>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">Supervision Système • {new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }).toUpperCase()}</p>
                </div>
                <button 
                    onClick={handleBackup}
                    className="flex items-center gap-3 px-8 py-4 bg-[#8B7355] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#7a654a] transition-all shadow-xl shadow-[#8B7355]/20 active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">database</span>
                    Sauvegarder BD
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Total Users */}
                <motion.div variants={itemVariants} className="premium-card p-8 bg-white border-l-[12px] border-l-[#0F172A] flex flex-col justify-between h-48 group shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Utilisateurs</h3>
                            <span className="material-symbols-outlined text-slate-500">group</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-institutional">{stats.total_users}</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Comptes</span>
                        </div>
                    </div>
                </motion.div>

                {/* Total Partners */}
                <motion.div variants={itemVariants} className="premium-card p-8 bg-white border-l-[12px] border-l-[#8B7355] flex flex-col justify-between h-48 group shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Partenaires</h3>
                            <span className="material-symbols-outlined text-[#8B7355]/30">handshake</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-[#0F172A]">{stats.total_partners}</span>
                            <span className="text-xs font-bold text-slate-600">Institutions</span>
                        </div>
                    </div>
                </motion.div>

                {/* Total Archives */}
                <motion.div variants={itemVariants} className="premium-card p-8 bg-white border-l-[12px] border-l-slate-200 flex flex-col justify-between h-48 group shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Archives</h3>
                            <span className="material-symbols-outlined text-slate-500">inventory_2</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-[#0F172A]">{stats.total_archives}</span>
                            <span className="text-xs font-bold text-slate-600">Dossiers</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Expiration Alerts */}
            <motion.div variants={itemVariants} className="mb-10">
                <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <span className="material-symbols-outlined text-3xl">notification_important</span>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-black text-amber-900 uppercase tracking-tight">Vigilance : Conventions à Échéance</h2>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-1">Supervision des fins de contrats imminentes (sous 90 jours).</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {stats.upcoming_deadlines && stats.upcoming_deadlines.length > 0 ? (
                            stats.upcoming_deadlines.map((conv, idx) => (
                                <div 
                                    key={`deadline-${conv.id || idx}`} 
                                    className="px-6 py-3 bg-white border border-amber-200 rounded-xl text-[10px] font-black text-amber-900 uppercase tracking-widest shadow-sm flex items-center gap-2"
                                >
                                    {conv.name.substring(0, 20)}...
                                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md">{new Date(conv.end_date).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-3 bg-white/50 border border-amber-200/50 border-dashed rounded-xl text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                                Aucun dossier en alerte
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Status Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 premium-card p-10">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-xl font-black text-[#001D3D]">État Global des Dossiers</h2>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Répartition par Statut</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.status_distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {stats.status_distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#CBD5E1'} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(value, name) => [value, name.toUpperCase()]}
                                />
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle"
                                    formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-[#001D3D]">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* System Stats or Mini info */}
                <motion.div variants={itemVariants} className="premium-card p-10 bg-[#001D3D] text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-8">Résumé Système</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-[10px] font-bold text-white/85 uppercase">Dossiers Archivés</span>
                                <span className="text-xl font-black">{stats.total_archives}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-[10px] font-bold text-white/85 uppercase">Partenaires Actifs</span>
                                <span className="text-xl font-black">{stats.total_partners}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-widest mb-1">Santé du Système</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs font-bold">Tous les services sont opérationnels</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Logins Table */}
            <motion.div variants={itemVariants} className="premium-card p-10">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-xl font-black text-[#001D3D]">Connexions Récentes</h2>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Activité en Temps Réel</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em] border-b border-gray-50">
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4 text-right">Dernière Connexion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats.recent_logins.map((user, index) => (
                                <tr key={`login-${user.id || index}`} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#001D3D]/5 flex items-center justify-center text-[#001D3D] font-black text-xs uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#001D3D] tracking-tight">{user.name}</p>
                                                <p className="text-[10px] font-bold text-slate-600">{user.email}</p>
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
                                        <p className="text-[10px] font-bold text-slate-600 uppercase">
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
