import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LayoutDashboard, Handshake, CheckCircle2, Clock, PlayCircle, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PartnerDashboard = () => {
    const { user } = useAuth();
    const [conventions, setConventions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                const res = await api.get('/conventions');
                setConventions(res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données partenaire", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPartnerData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-surface-500 font-bold uppercase tracking-widest text-[10px]">Chargement de votre espace...</p>
            </div>
        </div>
    );

    const stats = {
        total: conventions.length,
        active: conventions.filter(c => c.status === 'termine').length,
        completed: conventions.filter(c => c.status === 'termine').length,
        archived: conventions.filter(c => c.status === 'archive').length,
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'termine': return 'text-green-500 bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20';
            case 'archive': return 'text-surface-400 bg-surface-50 dark:bg-surface-800 border-surface-100 dark:border-surface-700';
            default: return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'termine': return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'archive': return <Clock className="w-3.5 h-3.5" />;
            default: return <Handshake className="w-3.5 h-3.5" />;
        }
    };

    const kpiData = [
        { name: 'Jan', performance: 65 },
        { name: 'Fév', performance: 59 },
        { name: 'Mar', performance: 80 },
        { name: 'Avr', performance: 81 },
        { name: 'Mai', performance: 56 },
        { name: 'Juin', performance: 95 },
    ];

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
            className="space-y-8 font-outfit"
        >
            {/* Hero Welcome Section */}
            <motion.div variants={itemVariants} className="bg-card-bg p-10 rounded-3xl shadow-premium border border-outline-variant relative overflow-hidden group transition-colors duration-300">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-primary/10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Espace Partenaire</span>
                        </div>
                        <h1 className="text-4xl font-black text-surface-900 tracking-tight leading-none">Bonjour, <span className="text-primary">{user?.name}</span></h1>
                        <p className="text-surface-500 font-medium italic mt-3 max-w-md">Suivez en temps réel l'évolution de vos conventions et l'atteinte de vos objectifs stratégiques.</p>
                    </div>
                    <div className="px-6 py-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 scale-100 hover:scale-105 transition-transform cursor-default">
                        <Handshake className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-widest">{user?.role?.name || 'Partenaire Externe'}</span>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Conventions', value: stats.total, icon: LayoutDashboard, color: 'bg-primary' },
                    { label: 'Signées / Actives', value: stats.active, icon: CheckCircle2, color: 'bg-green-500' },
                    { label: 'Terminées', value: stats.completed, icon: PlayCircle, color: 'bg-indigo-500' },
                    { label: 'Archivées', value: stats.archived, icon: Clock, color: 'bg-surface-400' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i} 
                        variants={itemVariants}
                        className="bg-card-bg p-7 rounded-3xl shadow-premium border border-outline-variant hover:border-primary/20 transition-all hover:-translate-y-1 group transition-colors duration-300"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3.5 rounded-2xl ${stat.color} text-white shadow-xl group-hover:rotate-6 transition-transform`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-surface-200 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black text-surface-900 leading-none">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-card-bg p-8 rounded-3xl shadow-premium border border-outline-variant flex flex-col transition-colors duration-300">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-surface-900 tracking-tight leading-none uppercase tracking-tighter">Indicateurs de Performance</h2>
                                <p className="text-[11px] text-surface-400 font-bold uppercase tracking-widest mt-1">Évolution de l'atteinte des cibles</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={kpiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: 'var(--surface)', borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)'}} 
                                    itemStyle={{color: '#4f46e5', fontWeight: '900', fontSize: '12px'}}
                                />
                                <Area type="monotone" dataKey="performance" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorPerf)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Conventions List */}
                <motion.div variants={itemVariants} className="bg-card-bg p-8 rounded-3xl shadow-premium border border-outline-variant flex flex-col transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-surface-900 tracking-tight leading-none uppercase tracking-tighter">Mes Dossiers</h2>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {conventions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-30">
                                <Handshake className="w-16 h-16 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">Aucun dossier actif</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {conventions.map((conv, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={conv.id} 
                                        className="p-5 rounded-2xl border border-outline-variant bg-surface-100/50 hover:bg-card-bg hover:shadow-premium hover:border-primary/20 transition-all group cursor-pointer transition-colors duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-black text-sm text-surface-900 group-hover:text-primary transition-colors leading-snug">{conv.name}</h4>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1.5 border ${getStatusStyles(conv.status)} uppercase tracking-widest`}>
                                                {getStatusIcon(conv.status)}
                                                {conv.status.replace('_', ' ')}
                                            </div>
                                            {conv.kpis?.length > 0 && (
                                                <div className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-surface-100 text-surface-500 border border-surface-200 uppercase tracking-widest">
                                                    {conv.kpis.length} KPIs
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] font-bold text-surface-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(conv.end_date).toLocaleDateString()}
                                            </span>
                                            <span className="text-primary group-hover:translate-x-1 transition-transform material-symbols-outlined text-[16px]">arrow_forward</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PartnerDashboard;
