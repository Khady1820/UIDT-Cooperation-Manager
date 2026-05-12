import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const STATUS_COLORS = {
    'brouillon': '#94a3b8',
    'soumis': '#3b82f6',
    'en attente': '#F7931E',
    'en cours': '#8b5cf6',
    'valide_dir_initial': '#6366f1',
    'valide_juridique': '#06b6d4',
    'pret_pour_signature': '#F7931E',
    'signe_recteur': '#059669',
    'archive': '#64748b',
    'rejete': '#ef4444',
    'termine': '#2E2F7F',
    'valide_chef_division': '#6366f1'
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const navigate = useNavigate();

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
            <div className="w-8 h-8 border-4 border-[#2E2F7F]/20 border-t-[#2E2F7F] dark:border-white/20 dark:border-t-white rounded-full animate-spin"></div>
        </div>
    );

    const pieData = stats.status_distribution?.map(item => ({
        name: t(`status_${item.status.replace(/ /g, '_')}`) || item.status.replace('_', ' ').toUpperCase(),
        value: item.count,
        color: STATUS_COLORS[item.status] || '#CBD5E1'
    })) || [];

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
                    <h1 className="text-xl font-black text-[#2E2F7F] dark:text-white tracking-tight text-balance">Portail Administration</h1>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">Supervision Système • {new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }).toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-4">

                    <button 
                        onClick={handleBackup}
                        className="flex items-center gap-3 px-8 py-4 bg-[#F7931E] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#d87a1a] transition-all shadow-xl shadow-[#F7931E]/20 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">database</span>
                        Sauvegarder BD
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Utilisateurs', value: stats.total_users, sub: 'Comptes', icon: 'group', path: '/manage-users' },
                    { label: 'Partenaires', value: stats.total_partners, sub: 'Institutions', icon: 'corporate_fare', path: '/manage-partners' },
                    { label: 'Conventions', value: stats.total_conventions, sub: 'Projets', icon: 'folder_managed', path: '/conventions' }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(item.path)}
                        className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-[#2E2F7F]/10 dark:hover:shadow-black/20 transition-all duration-500 cursor-pointer"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#2E2F7F] rounded-r-full opacity-80"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{item.label}</h3>
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">{item.icon}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-[#2E2F7F] dark:text-white">{item.value}</span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.sub}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Distribution Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-[#F7931E]">pie_chart</span>
                        Distribution des Conventions par Statut
                    </h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height={400} minWidth={0} minHeight={0}>
                            <PieChart margin={{ left: 20 }}>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                        borderRadius: '20px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase'
                                    }} 
                                />
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle"
                                    formatter={(value) => <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-3">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px] text-[#F7931E]">dns</span>
                        Récapitulatif des Accès
                    </h3>
                    <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {stats.roles_distribution?.map((role, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => navigate('/manage-users')}
                                className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:border-[#2E2F7F]/20 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#2E2F7F] dark:text-white font-black text-xs shadow-sm">
                                        {role.count}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rôle Système</span>
                                        <span className="text-sm font-black text-[#2E2F7F] dark:text-slate-300 uppercase tracking-tight">{t(`role_${role.name}`) || role.name.replace('_', ' ').toUpperCase()}</span>
                                        {role.last_login && (
                                            <span className="text-[8px] font-bold text-[#F7931E] uppercase tracking-tighter mt-1 italic">
                                                Activité : {format(new Date(role.last_login), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-[#F7931E] group-hover:scale-150 transition-transform"></div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
