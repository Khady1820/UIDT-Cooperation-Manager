import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Indicators = () => {
    const { t } = useLanguage();
    const [kpis, setKpis] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredKpis = kpis.filter(k => 
        (k.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.convention?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.responsable || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredKpis.length / itemsPerPage);
    const paginatedKpis = filteredKpis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
                <p className="text-[#2E2F7F] dark:text-white font-black uppercase tracking-widest text-sm">{t('loading')}</p>
            </div>
        </div>
    );

    const radarData = filteredKpis
        .filter(k => k.valeur_cible > 0) // Only need target > 0 to calculate %
        .slice(0, 12) // Show up to 12 main indicators
        .map(k => ({
            subject: k.name.length > 20 ? k.name.substring(0, 20) + '...' : k.name,
            A: Math.min(100, Math.round((parseFloat(k.valeur_atteinte) / parseFloat(k.valeur_cible)) * 100)),
            fullMark: 100,
        }));

    const barData = filteredKpis
        .filter(k => k.valeur_cible > 0)
        .map(k => ({
            name: k.name.length > 25 ? k.name.substring(0, 25) + '...' : k.name,
            value: Math.min(100, Math.round((parseFloat(k.valeur_atteinte) / parseFloat(k.valeur_cible)) * 100)),
            realValue: k.valeur_atteinte,
            target: k.valeur_cible,
            convention: k.convention?.name || 'N/A'
        }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-xl font-black text-[#2E2F7F] dark:text-white tracking-tight">{t('indicators')}</h1>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('institutional_sub')} • Pilotage Stratégique</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Radar Chart */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 flex flex-col">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#2E2F7F]/5 dark:bg-white/5 text-[#2E2F7F] dark:text-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">hub</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#2E2F7F] dark:text-white tracking-tight">Performance Multidimensionnelle</h3>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Taux d'atteinte des objectifs (%)</p>
                        </div>
                    </div>
                    <div className="h-[360px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={1}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 8}} />
                                <Radar
                                    name="Performance"
                                    dataKey="A"
                                    stroke="#2E2F7F"
                                    strokeWidth={3}
                                    fill="#2E2F7F"
                                    fillOpacity={0.15}
                                    animationDuration={1500}
                                />
                                <Tooltip 
                                    formatter={(value) => [`${value}%`, 'Atteinte']}
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}}
                                    itemStyle={{color: '#2E2F7F', fontWeight: 900, fontSize: '11px'}}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">
                            <span className="text-[#2E2F7F] dark:text-indigo-400 font-black mr-2">Interprétation :</span>
                            Ce radar compare le taux de succès de vos 12 indicateurs principaux. Une zone étendue vers les bords (100%) indique que les objectifs stratégiques de ces axes sont quasiment atteints.
                        </p>
                    </div>
                </motion.div>

                {/* Vertical Bar Chart */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-[0_20px_50_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 flex flex-col">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#F7931E]/10 dark:bg-[#F7931E]/20 text-[#F7931E] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">bar_chart</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#2E2F7F] dark:text-white tracking-tight">Analyse Comparative</h3>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Atteinte des objectifs par indicateur</p>
                        </div>
                    </div>
                    <div className="h-[360px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={1}>
                            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    formatter={(value, name, props) => [
                                        `${value}% (${props.payload.realValue} / ${props.payload.target})`, 
                                        'Progression'
                                    ]}
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}}
                                    itemStyle={{color: '#2E2F7F', fontWeight: 900, fontSize: '11px'}}
                                />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={28} animationDuration={1500}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2E2F7F' : '#F7931E'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">
                            <span className="text-[#F7931E] font-black mr-2">Interprétation :</span>
                            Chaque barre représente la progression d'un indicateur spécifique. Les barres sombres et dorées alternées permettent de visualiser l'écart restant jusqu'à la cible de 100%.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Detailed Table */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#FBFBFB] dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#2E2F7F] text-white flex items-center justify-center shadow-lg shadow-[#2E2F7F]/20">
                            <span className="material-symbols-outlined text-[20px]">analytics</span>
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest leading-none">Registre des Indicateurs</h3>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-1.5">Données auditées en temps réel</p>
                        </div>
                    </div>
                    
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#2E2F7F] dark:group-focus-within:text-white transition-colors text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom, projet ou responsable..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-slate-700 text-[#2E2F7F] dark:text-white rounded-2xl pl-14 pr-6 py-4 text-sm font-black placeholder:text-gray-200 dark:placeholder:text-slate-500 focus:outline-none focus:ring-8 focus:ring-[#2E2F7F]/5 focus:border-[#2E2F7F]/10 transition-all shadow-sm"
                        />
                    </div>

                    <span className="text-sm bg-[#2E2F7F] text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-md whitespace-nowrap">{filteredKpis.length} Identifiés</span>
                </div>
                <div className="overflow-x-auto max-h-[550px] overflow-y-auto custom-scrollbar relative">
                    <table className="w-full text-left min-w-[1200px]">
                        <thead>
                            <tr className="sticky top-0 z-10 bg-[#F1F3F5] dark:bg-slate-800 shadow-sm">
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">Indicateur</th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">Projet</th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">Réf.</th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">Cible</th>
                                <th className="px-4 py-3 text-xs font-black text-[#F7931E] uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">Atteint</th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">Fréquence</th>
                                <th className="px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest border-b border-gray-100 dark:border-slate-700">Responsable</th>
                            </tr>
                        </thead>
                        <tbody className="text-base">
                            <AnimatePresence mode="wait">
                                {paginatedKpis.map((k, idx) => (
                                    <motion.tr 
                                        key={k.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-black text-[#2E2F7F] dark:text-white group-hover:text-[#F7931E] transition-colors">{k.name}</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold truncate max-w-[200px] mt-0.5 italic leading-none">{k.description}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-black text-[#2E2F7F] dark:text-indigo-300 uppercase tracking-tight bg-[#2E2F7F]/5 dark:bg-indigo-900/20 px-2 py-0.5 rounded-lg w-fit border border-[#2E2F7F]/10 dark:border-indigo-800 block">
                                                {k.convention?.num_dossier || 'N/A'} - {k.convention?.name?.substring(0, 30)}...
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400">{k.valeur_reference || '0'}</td>
                                        <td className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400">{k.valeur_cible || '0'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-black text-[#F7931E] bg-[#F7931E]/5 dark:bg-[#F7931E]/20 px-2 py-0.5 rounded-lg">{k.valeur_atteinte || '0'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                             <span className="text-xs font-black text-[#2E2F7F] dark:text-white uppercase border border-gray-100 dark:border-slate-700 px-2 py-0.5 rounded-md">{k.frequence_mesure || 'Annuel'}</span>
                                        </td>
                                        <td className="px-8 py-7 text-sm font-black text-[#2E2F7F] dark:text-slate-400 opacity-60">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base">person</span>
                                                {k.responsable || 'Non assigné'}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="p-8 border-t border-gray-50 bg-[#FBFBFB]/50 flex items-center justify-between">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                            Page {currentPage} sur {totalPages} • {filteredKpis.length} Indicateurs
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-5 py-3 rounded-xl bg-white border border-gray-100 text-[#2E2F7F] text-xs font-black uppercase tracking-widest hover:bg-[#2E2F7F] hover:text-white disabled:opacity-30 transition-all shadow-sm flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">chevron_left</span>
                                Précédent
                            </button>
                            <div className="flex gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                                            currentPage === i + 1 
                                            ? 'bg-[#2E2F7F] text-white shadow-lg' 
                                            : 'bg-white border border-gray-100 text-slate-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-5 py-3 rounded-xl bg-white border border-gray-100 text-[#2E2F7F] text-xs font-black uppercase tracking-widest hover:bg-[#2E2F7F] hover:text-white disabled:opacity-30 transition-all shadow-sm flex items-center gap-2"
                            >
                                Suivant
                                <span className="material-symbols-outlined text-base">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Indicators;
