import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AdminDashboard from '../components/AdminDashboard';
import StatusBadge from '../components/StatusBadge';
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

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { t } = useLanguage();

    // Check if the user is an admin
    const isAdmin = user?.role?.name === 'admin';

    useEffect(() => {
        // If user is admin, we don't necessarily need to fetch the standard stats here
        // as the AdminDashboard component has its own fetch logic.
        // However, we'll keep the logic if we want to toggle views later.
        if (isAdmin) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Erreur de chargement des statistiques", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [isAdmin]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-[#001D3D]/20 border-t-[#001D3D] dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
        </div>
    );

    // Render Admin Dashboard if user is admin
    if (isAdmin) {
        return <AdminDashboard />;
    }

    if (!stats) return null;

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#001D3D] dark:text-white tracking-tight">{t('dashboard')}</h1>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('institutional_sub')} • {new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }).toUpperCase()}</p>
                </div>
                <div className="flex gap-4 no-print">
                    <button 
                        onClick={() => window.print()}
                        className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-[11px] font-black text-[#001D3D] dark:text-white uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        Exporter Rapport
                    </button>
                    {(user?.role?.name === 'porteur_projet' || user?.role?.name === 'admin') && (
                        <Link to="/conventions" className="px-6 py-2.5 bg-[#001D3D] dark:bg-indigo-600 border border-[#001D3D] dark:border-indigo-600 rounded-xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-[#002b5c] dark:hover:bg-indigo-700 transition-all shadow-xl shadow-[#001D3D]/20 dark:shadow-indigo-600/20 flex items-center gap-2">
                            NOUVEAU PROJET
                            <span className="material-symbols-outlined text-[16px]">add</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Active Conventions */}
                <motion.div variants={itemVariants} className="premium-card p-8 bg-white border-l-[12px] border-l-[#0F172A] flex flex-col justify-between h-48 group shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Conventions Actives</h3>
                            <span className="material-symbols-outlined text-slate-500">folder_open</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-institutional">{stats.active_conventions}</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total</span>
                        </div>
                    </div>
                </motion.div>

                {/* Efficiency Index */}
                <motion.div variants={itemVariants} className="premium-card p-8 border-l-[12px] border-l-emerald-500 flex flex-col justify-between h-48 group shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Efficacité</h3>
                            <span className="material-symbols-outlined text-emerald-300">trending_up</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-institutional">{stats.efficiency_index}%</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Performance</span>
                        </div>
                    </div>
                </motion.div>

                {/* Pending Actions */}
                <motion.div variants={itemVariants} className="premium-card p-8 border-l-[12px] border-l-rose-500 flex flex-col justify-between h-48 group shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Urgences</h3>
                            <span className="material-symbols-outlined text-rose-300">error_outline</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-institutional">{stats.pending_validations}</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Dossiers</span>
                        </div>
                    </div>
                    <div>
                         <Link to="/validation" className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 hover:underline">
                            Traiter <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Expiration Alerts */}
            {stats.upcoming_deadlines && stats.upcoming_deadlines.length > 0 && (
                <motion.div variants={itemVariants} className="mb-10">
                    <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8 flex items-center gap-6 shadow-sm">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <span className="material-symbols-outlined text-3xl">notification_important</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-black text-amber-900 uppercase tracking-tight">Alertes d'Échéance (Moins de 90 jours)</h2>
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-1">Les conventions suivantes arrivent bientôt à terme. Veuillez anticiper les renouvellements.</p>
                        </div>
                        <div className="flex gap-3">
                            {stats.upcoming_deadlines.map((conv, idx) => (
                                <Link 
                                    key={idx} 
                                    to={`/conventions/${conv.id}`}
                                    className="px-6 py-3 bg-white border border-amber-200 rounded-xl text-[10px] font-black text-amber-900 uppercase tracking-widest hover:bg-amber-100 transition-all shadow-sm flex items-center gap-2"
                                >
                                    {conv.name.substring(0, 15)}...
                                    <span className="text-red-500">{new Date(conv.end_date).toLocaleDateString()}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                {/* Status Distribution Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 premium-card p-10 bg-white shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Répartition par Statut</h2>
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-1">Cycle de Vie</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-500 uppercase">Live</span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.status_distribution}
                                    cx="40%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="status"
                                    stroke="none"
                                >
                                    {stats.status_distribution.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={STATUS_COLORS[entry.status] || '#CBD5E1'} 
                                            className="hover:opacity-80 transition-opacity cursor-pointer shadow-xl"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '1.5rem', 
                                        border: '1px solid #f1f5f9', 
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)', 
                                        fontSize: '11px', 
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        padding: '15px'
                                    }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value, entry) => (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">
                                            {value} <span className="text-slate-500 ml-1">({entry.payload.count})</span>
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Types of Cooperation */}
                <motion.div variants={itemVariants} className="lg:col-span-1 premium-card p-10 bg-white shadow-sm border border-slate-100">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-xl font-black text-[#0F172A]">Types</h2>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Classification</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {stats.cooperation_types.map((type, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            type.type === 'international' ? 'bg-indigo-50 text-indigo-500' : 
                                            (type.type === 'national' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500')
                                        }`}>
                                            <span className="material-symbols-outlined text-lg">
                                                {type.type === 'international' ? 'public' : (type.type === 'national' ? 'flag' : 'location_on')}
                                            </span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">{type.type}</h4>
                                    </div>
                                    <span className="text-lg font-black text-[#0F172A]">{type.count}</span>
                                </div>
                                <div className="w-full bg-slate-50 h-[6px] rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            type.type === 'international' ? 'bg-indigo-500' : 
                                            (type.type === 'national' ? 'bg-emerald-500' : 'bg-amber-500')
                                        }`} 
                                        style={{ width: `${(type.count / stats.total_conventions) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 text-center">Volume Global</p>
                        <p className="text-2xl font-black text-[#0F172A] text-center">{stats.total_conventions}</p>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                {/* Recent Activity / Flux de Suivi */}
                <motion.div variants={itemVariants} className="lg:col-span-2 premium-card p-10 flex flex-col">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-xl font-black text-[#001D3D]">Flux de Suivi</h2>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Dernières étapes franchies</p>
                        </div>
                        <Link to="/timeline" className="text-[10px] font-black text-[#8B7355] hover:text-[#001D3D] uppercase tracking-[0.2em] flex items-center gap-1 transition-colors">
                            Journal Complet <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="space-y-8 relative flex-1">
                        <div className="absolute left-[23px] top-2 bottom-0 w-[1px] bg-gray-100"></div>
                        
                        {stats.recent_activity.slice(0, 5).map((act, index) => (
                            <div key={index} className="relative pl-14 group">
                                <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all z-10">
                                    <span className="material-symbols-outlined text-[#001D3D] text-[20px]">
                                        {act.action === 'creation' ? 'add' : act.action.includes('valide') ? 'verified' : 'history_edu'}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[12px] font-black text-[#0F172A] uppercase tracking-wider line-clamp-1">{act.convention?.name}</h4>
                                    <p className="text-[11px] font-bold text-slate-500 italic">"{act.comment || 'Mise à jour du statut'}"</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-[10px] font-black text-[#8B7355] uppercase bg-[#8B7355]/5 px-2 py-0.5 rounded-md">
                                            {new Date(act.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Par {act.user?.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tâches Urgentes Mini-view or something else */}
                <motion.div variants={itemVariants} className="premium-card p-10">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-xl font-black text-[#001D3D]">Urgences</h2>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Priorité</span>
                    </div>
                    <div className="space-y-4">
                        {stats.pending_actions && stats.pending_actions.slice(0, 3).map((task, index) => (
                            <Link to={`/conventions/${task.id}`} key={index} className="flex items-center gap-4 p-4 bg-[#FBFBFB] rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-gray-50">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <span className="material-symbols-outlined text-[#8B7355] text-xl">priority_high</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="text-[12px] font-black text-[#0F172A] truncate">{task.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate">{task.status}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tâches Urgentes */}
            <motion.div variants={itemVariants} className="premium-card p-10">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-xl font-black text-[#001D3D]">Actions Urgentes</h2>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border border-gray-100 px-3 py-1 rounded-full">
                        {user?.role?.name === 'directeur_cooperation' ? 'Vue Direction' : 
                         user?.role?.name === 'service_juridique' ? 'Vue Juridique' :
                         user?.role?.name === 'recteur' ? 'Vue Rectorat' : 'Vue Admin'}
                    </span>
                </div>

                <div className="space-y-4">
                    {stats.pending_actions && stats.pending_actions.length > 0 ? (
                        stats.pending_actions.map((task, index) => (
                            <Link to={`/conventions/${task.id}`} key={index} className="flex items-center gap-6 p-6 border border-gray-50 bg-[#FBFBFB] hover:bg-white hover:shadow-xl transition-all rounded-3xl group">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-[#8B7355] text-3xl opacity-60 group-hover:scale-110 transition-transform">
                                        {task.status === 'soumis' ? 'account_balance' : 
                                         task.status === 'valide_dir_initial' ? 'gavel' : 
                                         task.status === 'valide_juridique' ? 'verified_user' : 'ink_pen'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-black text-[#001D3D] line-clamp-1">{task.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                                        {task.status === 'soumis' ? 'EN ATTENTE D’INSTRUCTION (DIRECTION)' : 
                                         task.status === 'valide_dir_initial' ? 'EN ATTENTE DE VISA JURIDIQUE' :
                                         task.status === 'valide_juridique' ? 'EN ATTENTE DE CONTRÔLE FINAL' :
                                         task.status === 'pret_pour_signature' ? 'EN ATTENTE DE SIGNATURE RECTORALE' : 'TRAITEMENT EN COURS'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-8 py-3 bg-[#001D3D] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#002b5c] transition-all shadow-lg shadow-[#001D3D]/10">
                                        EXAMINER
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-10 text-center bg-[#FBFBFB] rounded-3xl border border-dashed border-gray-200">
                             <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Aucune action urgente en attente</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Print Only Report Template */}
            <div className="hidden print-only fixed inset-0 bg-white z-[100] p-10 font-sans text-[#001D3D]">
                <div className="flex justify-between items-start border-b-2 border-[#001D3D] pb-10 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#001D3D] text-white flex items-center justify-center rounded-2xl shadow-xl">
                            <span className="material-symbols-outlined text-5xl">account_balance</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter leading-tight">UNIVERSITÉ IBA DER THIAM<br/>DE THIÈS (UIDT)</h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B7355] mt-2">Direction de la Coopération Institutionnelle</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Rapport de Situation</p>
                        <p className="text-sm font-black mt-1">GÉNÉRÉ LE {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-[#8B7355] mt-1">REF: DCI/RPT/2026-Q4/001</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-12">
                    <div className="space-y-6">
                        <h2 className="text-lg font-black uppercase tracking-widest border-l-4 border-[#8B7355] pl-4">Résumé des Métriques</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 italic">
                                <span className="text-sm text-slate-700">Conventions Actives :</span>
                                <span className="text-lg font-black text-[#001D3D]">{stats.active_conventions}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 italic">
                                <span className="text-sm text-slate-700">Dossiers en Attente :</span>
                                <span className="text-lg font-black text-red-600">{stats.pending_validations}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 italic">
                                <span className="text-sm text-slate-700">Indice d'Efficacité Globale :</span>
                                <span className="text-lg font-black text-green-600">{stats.efficiency_index}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-black uppercase tracking-widest border-l-4 border-[#001D3D] pl-4">Types de Coopération</h2>
                        <div className="space-y-3">
                            {stats.cooperation_types.map((type) => (
                                <div key={type.type} className="flex justify-between text-sm py-1">
                                    <span className="font-bold text-gray-600 capitalize">{type.type}</span>
                                    <span className="font-black">{type.count} Projets</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-lg font-black uppercase tracking-widest border-l-4 border-[#001D3D] pl-4 mb-6">Activité Récente du Portefeuille</h2>
                    <table className="w-full text-left border-collapse border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-600 tracking-widest">Événement</th>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-600 tracking-widest">Description</th>
                                <th className="p-4 text-[10px] font-black uppercase text-slate-600 tracking-widest">Horodatage</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] font-medium text-gray-600">
                            {stats.recent_activity.map((act, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="p-4 font-black text-[#001D3D] uppercase">{act.action}</td>
                                    <td className="p-4 group-hover:text-[#8B7355]">{act.comment} - {act.convention.name}</td>
                                    <td className="p-4 font-black">{new Date(act.created_at).toLocaleDateString('fr-FR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end border-t border-gray-100 pt-10">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#8B7355]">Certifié Conforme par la Direction de la Coopération</p>
                        <p className="text-[8px] font-medium text-slate-600">© 2026 CoopManager UIDT - Système de Gestion du Patrimoine Conventionnel</p>
                    </div>
                    <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center text-slate-500 text-[10px] font-black uppercase rotate-[-15deg]">
                        Cachet Institutionnel
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
