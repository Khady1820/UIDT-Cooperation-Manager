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

    const filteredKpis = kpis.filter(k => 
        (k.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.convention?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.responsable || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#001D3D]/10 border-t-[#001D3D] rounded-full animate-spin"></div>
                <p className="text-[#001D3D] font-black uppercase tracking-widest text-[10px]">{t('loading')}</p>
            </div>
        </div>
    );

    const radarData = filteredKpis.slice(0, 6).map(k => ({
        subject: k.name.length > 15 ? k.name.substring(0, 15) + '...' : k.name,
        A: parseFloat(k.valeur_atteinte) || k.value || 0,
        fullMark: 100,
    }));

    const barData = filteredKpis.map(k => ({
        name: k.name,
        value: parseFloat(k.valeur_atteinte) || k.value || 0,
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
                <h1 className="text-3xl font-black text-[#001D3D] tracking-tight">{t('indicators')}</h1>
                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{t('institutional_sub')} • Pilotage Stratégique</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Radar Chart */}
                <motion.div variants={itemVariants} className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#001D3D]/5 text-[#001D3D] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">hub</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#001D3D] tracking-tight">Performance Multidimensionnelle</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Équilibre des axes stratégiques</p>
                        </div>
                    </div>
                    <div className="h-[360px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 8}} />
                                <Radar
                                    name="Performance"
                                    dataKey="A"
                                    stroke="#001D3D"
                                    strokeWidth={3}
                                    fill="#001D3D"
                                    fillOpacity={0.15}
                                    animationDuration={1500}
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}}
                                    itemStyle={{color: '#001D3D', fontWeight: 900, fontSize: '11px'}}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Vertical Bar Chart */}
                <motion.div variants={itemVariants} className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#8B7355]/10 text-[#8B7355] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">bar_chart</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#001D3D] tracking-tight">Analyse Comparative</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Atteinte des objectifs par indicateur</p>
                        </div>
                    </div>
                    <div className="h-[360px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}}
                                    itemStyle={{color: '#001D3D', fontWeight: 900, fontSize: '11px'}}
                                />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={28} animationDuration={1500}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#001D3D' : '#8B7355'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Detailed Table */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#FBFBFB]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#001D3D] text-white flex items-center justify-center shadow-lg shadow-[#001D3D]/20">
                            <span className="material-symbols-outlined text-[20px]">analytics</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#001D3D] uppercase tracking-widest leading-none">Registre des Indicateurs</h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Données auditées en temps réel</p>
                        </div>
                    </div>
                    
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#001D3D] transition-colors text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom, projet ou responsable..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 text-[#001D3D] rounded-2xl pl-14 pr-6 py-4 text-[10px] font-black placeholder:text-gray-200 focus:outline-none focus:ring-8 focus:ring-[#001D3D]/5 focus:border-[#001D3D]/10 transition-all shadow-sm"
                        />
                    </div>

                    <span className="text-[10px] bg-[#001D3D] text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-md whitespace-nowrap">{filteredKpis.length} Identifiés</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1200px]">
                        <thead>
                            <tr className="bg-[#F1F3F5]/30">
                                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Indicateur</th>
                                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Projet</th>
                                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Réf.</th>
                                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Cible</th>
                                <th className="px-8 py-6 text-[9px] font-black text-[#8B7355] uppercase tracking-widest border-b border-gray-100">Atteint</th>
                                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Fréquence</th>
                                <th className="px-8 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Responsable</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredKpis.map((k, idx) => (
                                <tr key={k.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-7">
                                        <p className="text-[11px] font-black text-[#001D3D] group-hover:text-[#8B7355] transition-colors">{k.name}</p>
                                        <p className="text-[9px] text-gray-400 font-bold truncate max-w-[200px] mt-1 italic leading-none">{k.description}</p>
                                    </td>
                                    <td className="px-8 py-7">
                                        <span className="text-[9px] font-black text-[#001D3D] uppercase tracking-tight bg-[#001D3D]/5 px-3 py-1 rounded-lg w-fit border border-[#001D3D]/10 block">
                                            {k.convention?.num_dossier || 'N/A'} - {k.convention?.name?.substring(0, 30)}...
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 text-[11px] font-bold text-gray-400">{k.valeur_reference || '0'}</td>
                                    <td className="px-8 py-7 text-[11px] font-bold text-gray-400">{k.valeur_cible || '0'}</td>
                                    <td className="px-8 py-7">
                                        <span className="text-[11px] font-black text-[#8B7355] bg-[#8B7355]/5 px-3 py-1 rounded-lg">{k.valeur_atteinte || '0'}</span>
                                    </td>
                                    <td className="px-8 py-7">
                                         <span className="text-[9px] font-black text-[#001D3D] uppercase border border-gray-100 px-2 py-1 rounded-md">{k.frequence_mesure || 'Annuel'}</span>
                                    </td>
                                    <td className="px-8 py-7 text-[11px] font-black text-[#001D3D] opacity-60">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">person</span>
                                            {k.responsable || 'Non assigné'}
                                        </div>
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
