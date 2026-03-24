import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    RadialBarChart, RadialBar, Legend, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

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

    if (loading) return <div className="p-8 text-on-surface-variant font-medium">{t('loading')}</div>;

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

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-display-md font-medium tracking-tight text-on-surface">{t('indicators')}</h1>
                <p className="text-body-lg text-on-surface-variant">Analyse détaillée des performances et objectifs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart for Overall Balance */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-glass border border-outline-variant/10">
                    <h3 className="text-lg font-bold text-on-surface mb-6 italic uppercase tracking-widest text-primary/70">Équilibre des Performances</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                    name="Performance"
                                    dataKey="A"
                                    stroke="#3525cd"
                                    fill="#3525cd"
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vertical Bar Chart for Comparison */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-glass border border-outline-variant/10">
                    <h3 className="text-lg font-bold text-on-surface mb-6 italic uppercase tracking-widest text-primary/70">Comparatif par Objectif</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 10}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3525cd' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-glass border border-outline-variant/10 overflow-hidden">
                <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/30">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Liste détaillée des indicateurs</h3>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{kpis.length} Actifs</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Indicateur</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Convention</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Progression</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Valeur</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                            {kpis.map(k => (
                                <tr key={k.id} className="hover:bg-surface-container-low/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-on-surface">{k.name}</p>
                                        <p className="text-[10px] text-on-surface-variant truncate max-w-[200px]">{k.description}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-primary">
                                        {k.convention?.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-32 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-1000"
                                                style={{ width: `${k.value}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-sm font-bold ${k.value >= 75 ? 'text-success' : k.value >= 50 ? 'text-warning' : 'text-error'}`}>
                                            {k.value}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Indicators;
