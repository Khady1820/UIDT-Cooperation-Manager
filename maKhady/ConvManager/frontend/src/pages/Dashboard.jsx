import { useState, useEffect } from 'react';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { t } = useLanguage();
    const [conventions, setConventions] = useState([]);
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [convRes, kpiRes] = await Promise.all([
                    api.get('/conventions'),
                    api.get('/kpis')
                ]);
                setConventions(convRes.data);
                setKpis(kpiRes.data);
            } catch (error) {
                console.error("Erreur de chargement des données", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-surface-500 font-bold uppercase tracking-widest text-[10px]">{t('loading')}</p>
            </div>
        </div>
    );

    const totalConventions = conventions.length;
    const avgKpis = kpis.length > 0 ? ((kpis.reduce((acc, kpi) => acc + parseFloat(kpi.value || 0), 0)) / kpis.length).toFixed(1) : 0;
    
    // For PieChart
    const enCours = conventions.filter(c => c.status === 'en cours').length;
    const termine = conventions.filter(c => c.status === 'terminé').length;
    const enAttente = conventions.filter(c => c.status === 'en attente').length;
    
    const statusData = [
        { name: 'En cours', value: enCours, color: '#4f46e5' }, // primary
        { name: 'Terminé', value: termine, color: '#10b981' }, // secondary
        { name: 'En attente', value: enAttente, color: '#94a3b8' }, // surface-400
    ];

    // For AreaChart
    const areaData = [
        { name: 'Jan', val: 20 }, { name: 'Fév', val: 35 }, { name: 'Mar', val: 30 },
        { name: 'Avr', val: 55 }, { name: 'Mai', val: 40 }, { name: 'Juin', val: 65 },
        { name: 'Juil', val: 50 }, { name: 'Août', val: 80 }, { name: 'Sep', val: 75 },
        { name: 'Oct', val: 95 }, { name: 'Nov', val: 85 }, { name: 'Déc', val: Math.max(100, kpis.length * 10) }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
            className="space-y-8"
        >
            {/* Page Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">{t('overview')}</h1>
                    <p className="text-surface-500 mt-1 font-medium">{t('performance_overview')}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-card-bg text-surface-700 text-sm font-bold rounded-xl shadow-premium border border-outline-variant hover:bg-surface-50 transition-all transition-colors duration-300">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        {t('export')}
                    </button>
                    <Link to="/conventions" className="premium-button-primary flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        {t('new_convention')}
                    </Link>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="bg-card-bg p-7 rounded-2xl shadow-premium border border-outline-variant flex flex-col justify-between h-44 relative overflow-hidden group transition-colors duration-300">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary mb-4">
                                <span className="material-symbols-outlined text-[24px]">description</span>
                            </div>
                            <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-lg">+12.5%</span>
                        </div>
                        <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest leading-none mb-1">{t('num_conventions')}</p>
                        <h3 className="text-3xl font-bold text-surface-900 leading-none">{totalConventions}</h3>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[100px]">description</span>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-card-bg p-7 rounded-2xl shadow-premium border border-outline-variant flex flex-col justify-between h-44 relative overflow-hidden group transition-colors duration-300">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-secondary/10 rounded-xl text-secondary mb-4">
                                <span className="material-symbols-outlined text-[24px]">query_stats</span>
                            </div>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">+3.2%</span>
                        </div>
                        <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest leading-none mb-1">{t('avg_kpi')}</p>
                        <h3 className="text-3xl font-bold text-surface-900 leading-none">{avgKpis}%</h3>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[100px]">query_stats</span>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-card-bg p-7 rounded-2xl shadow-premium border border-outline-variant flex flex-col justify-between h-44 relative overflow-hidden group transition-colors duration-300">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-accent/10 rounded-xl text-accent mb-4">
                                <span className="material-symbols-outlined text-[24px]">handshake</span>
                            </div>
                        </div>
                        <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest leading-none mb-1">{t('active_partners')}</p>
                        <h3 className="text-3xl font-bold text-surface-900 leading-none">
                            {new Set(conventions.flatMap(c => (c.partners || '').split(',').map(s => s.trim()).filter(Boolean))).size}
                        </h3>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[100px]">handshake</span>
                    </div>
                </motion.div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-card-bg rounded-2xl shadow-premium border border-outline-variant p-8 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-surface-900">{t('kpi_evolution')}</h2>
                            <p className="text-xs text-surface-500 font-medium">{t('aggregated_performance')}</p>
                        </div>
                        <select className="bg-surface-100 border border-outline-variant rounded-xl px-3 py-1.5 text-[11px] font-bold text-surface-600 focus:ring-2 focus:ring-primary/20 outline-none transition-colors duration-300">
                            <option>Année 2026</option>
                            <option>Année 2025</option>
                        </select>
                    </div>
                    <div className="h-72 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: 'var(--surface)', borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '12px'}} 
                                    itemStyle={{fontSize: '12px', fontWeight: '700', color: 'var(--text-main)'}}
                                    labelStyle={{fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px'}}
                                />
                                <Area type="monotone" dataKey="val" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-card-bg rounded-2xl shadow-premium border border-outline-variant p-8 flex flex-col transition-colors duration-300">
                    <h2 className="text-lg font-bold text-surface-900 mb-1">{t('convention_status_dist')}</h2>
                    <p className="text-xs text-surface-500 font-medium mb-8">{t('distribution_by_status')}</p>
                    <div className="relative h-56 w-full mx-auto mb-8 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationDuration={1500}
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{backgroundColor: 'var(--surface)', borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)'}}
                                    itemStyle={{fontSize: '11px', fontWeight: '700', color: 'var(--text-main)'}}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-surface-900 leading-none">{totalConventions}</span>
                            <span className="text-[10px] text-surface-400 font-bold uppercase tracking-widest mt-1">{t('total')}</span>
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-outline-variant">
                        {statusData.map(st => {
                            const pct = totalConventions > 0 ? ((st.value / totalConventions) * 100).toFixed(0) : 0;
                            return (
                                <div key={st.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: st.color}}></div>
                                        <span className="text-xs font-bold text-surface-600">{st.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-surface-900">{pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Lower Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <motion.div variants={itemVariants} className="md:col-span-1 bg-primary rounded-2xl p-8 text-white flex flex-col justify-between shadow-premium-hover relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="font-bold text-primary-100 uppercase tracking-widest text-[10px] mb-4">{t('q4_objectives')}</h4>
                        <p className="text-4xl font-black mb-1">78</p>
                        <p className="text-[10px] font-bold text-primary-100 uppercase tracking-widest leading-none">Indicateurs cibles</p>
                    </div>
                    <div className="relative z-10 mt-8">
                        <div className="bg-white/20 h-2 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "78%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="bg-white h-full"
                            ></motion.div>
                        </div>
                        <p className="text-[10px] mt-3 font-bold text-indigo-100 uppercase tracking-widest leading-none">{t('on_track')}</p>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
                        <span className="material-symbols-outlined text-[120px]">rocket_launch</span>
                    </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="md:col-span-3 bg-card-bg border border-outline-variant rounded-2xl p-8 shadow-premium flex items-start justify-between relative overflow-hidden transition-colors duration-300">
                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">notification_important</span>
                            </div>
                            <h4 className="text-xl font-bold text-surface-900">{t('pending_conventions')}</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {conventions.filter(c => c.status === 'en attente').length > 0 ? (
                                conventions.filter(c => c.status === 'en attente').slice(0, 4).map(conv => (
                                    <div key={conv.id} className="p-4 bg-surface-100 rounded-xl border border-outline-variant group hover:border-primary/20 transition-all transition-colors duration-300">
                                        <p className="text-xs font-bold text-surface-900 group-hover:text-primary transition-colors">
                                            {conv.name}
                                        </p>
                                        <p className="text-[10px] text-surface-400 font-bold uppercase tracking-tighter mt-1">Nécessite votre attention</p>
                                    </div>
                                ))
                            ) : (
                                <div className="sm:col-span-2 py-4">
                                    <p className="text-sm text-surface-500 italic font-medium">
                                        Aucune convention critique n'arrive à échéance dans les prochains jours.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-8">
                            <Link to="/conventions" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                                {t('all_dossiers')} →
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
