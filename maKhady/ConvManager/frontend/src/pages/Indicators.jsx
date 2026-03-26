import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    RadialBarChart, RadialBar, Legend, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { motion } from 'framer-motion';

const Indicators = () => {
    const { t } = useLanguage();
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                const res = await api.get('/kpis');
                setKpis(res.data);
            } catch (error) {
                console.error("Erreur KPIs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKpis();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-surface-500 font-bold uppercase tracking-widest text-[10px]">{t('loading')}</p>
            </div>
        </div>
    );

    // Aggregate data for visualization
    const radarData = kpis.slice(0, 5).map(k => ({
        subject: k.name.length > 10 ? k.name.substring(0, 10) + '...' : k.name,
        A: k.value,
        fullMark: 100,
    }));

    const barData = kpis.map(k => ({
        name: k.name,
        value: k.value,
        convention: k.convention?.name || 'N/A'
    }));

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
            className="space-y-8"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-surface-900 tracking-tight">{t('indicators')}</h1>
                <p className="text-surface-500 font-medium italic">Analyse détaillée des performances et objectifs par convention.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <motion.div variants={itemVariants} className="bg-card-bg p-8 rounded-2xl shadow-premium border border-outline-variant flex flex-col transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">hub</span>
                        </div>
                        <h3 className="text-lg font-bold text-surface-900">Équilibre des Performances</h3>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="var(--border)" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 8}} />
                                <Radar
                                    name="Performance"
                                    dataKey="A"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    fill="#4f46e5"
                                    fillOpacity={0.4}
                                    animationDuration={1500}
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: 'var(--surface)', borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)'}}
                                    itemStyle={{color: 'var(--text-main)'}}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Vertical Bar Chart */}
                <motion.div variants={itemVariants} className="bg-card-bg p-8 rounded-2xl shadow-premium border border-outline-variant flex flex-col transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                        </div>
                        <h3 className="text-lg font-bold text-surface-900">Comparatif par Objectif</h3>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'var(--surface-alt)'}}
                                    contentStyle={{backgroundColor: 'var(--surface)', borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)'}}
                                    itemStyle={{color: 'var(--text-main)'}}
                                />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1500}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Detailed Table */}
            <motion.div variants={itemVariants} className="bg-card-bg rounded-2xl shadow-premium border border-outline-variant overflow-hidden transition-colors duration-300">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-100/30">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">list_alt</span>
                        </div>
                        <h3 className="text-sm font-black text-surface-900 uppercase tracking-widest leading-none">Liste détaillée des indicateurs</h3>
                    </div>
                    <span className="text-[10px] bg-primary text-white px-3 py-1 rounded-lg font-black uppercase tracking-widest">{kpis.length} Actifs</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-100/50">
                                <th className="p-6 text-[10px] font-black text-surface-400 uppercase tracking-widest border-b border-outline-variant">Indicateur</th>
                                <th className="p-6 text-[10px] font-black text-surface-400 uppercase tracking-widest border-b border-outline-variant">Convention</th>
                                <th className="p-6 text-[10px] font-black text-surface-400 uppercase tracking-widest border-b border-outline-variant">Progression</th>
                                <th className="p-6 text-[10px] font-black text-surface-400 uppercase tracking-widest border-b border-outline-variant text-right">Valeur</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {kpis.map((k, idx) => (
                                <tr key={k.id} className="border-b border-outline-variant hover:bg-surface-100/50 transition-all group">
                                    <td className="p-6">
                                        <p className="text-sm font-bold text-surface-900 group-hover:text-primary transition-colors">{k.name}</p>
                                        <p className="text-[10px] text-surface-400 font-medium truncate max-w-[200px] mt-0.5">{k.description}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xs font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-1 rounded-md">
                                            {k.convention?.name}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-2 bg-surface-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${k.value}%` }}
                                                    transition={{ duration: 1, delay: 0.2 + (idx * 0.05) }}
                                                    viewport={{ once: true }}
                                                    className="h-full bg-primary"
                                                ></motion.div>
                                            </div>
                                            <span className="text-[10px] font-black text-surface-400">{k.value}%</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className={`text-sm font-black ${k.value >= 75 ? 'text-secondary' : k.value >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                            {k.value}%
                                        </span>
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

export default Indicators;
