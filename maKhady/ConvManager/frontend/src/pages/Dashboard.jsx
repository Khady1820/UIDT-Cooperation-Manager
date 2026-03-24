import { useState, useEffect } from 'react';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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

    if (loading) return <div className="p-8 text-on-surface-variant font-medium">{t('loading')}</div>;

    const totalConventions = conventions.length;
    const avgKpis = kpis.length > 0 ? ((kpis.reduce((acc, kpi) => acc + parseFloat(kpi.value || 0), 0)) / kpis.length).toFixed(1) : 0;
    
    // For PieChart
    const enCours = conventions.filter(c => c.status === 'en cours').length;
    const termine = conventions.filter(c => c.status === 'terminé').length;
    const enAttente = conventions.filter(c => c.status === 'en attente').length;
    
    const statusData = [
        { name: 'En cours', value: enCours, color: '#3525cd' },
        { name: 'Terminé', value: termine, color: '#10b981' },
        { name: 'En attente', value: enAttente, color: '#94a3b8' },
    ];

    // For AreaChart (Mocking evolution since we just have lists of KPIs right now)
    const areaData = [
        { name: 'Jan', val: 20 }, { name: 'Fév', val: 35 }, { name: 'Mar', val: 30 },
        { name: 'Avr', val: 55 }, { name: 'Mai', val: 40 }, { name: 'Juin', val: 65 },
        { name: 'Juil', val: 50 }, { name: 'Août', val: 80 }, { name: 'Sep', val: 75 },
        { name: 'Oct', val: 95 }, { name: 'Nov', val: 85 }, { name: 'Déc', val: Math.max(100, kpis.length * 10) }
    ];

    return (
        <div className="p-8 space-y-8">
            {/* Page Title */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-semibold text-on-surface tracking-tight">{t('overview')}</h1>
                    <p className="text-on-surface-variant mt-1">{t('performance_overview')}</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-on-surface text-sm font-medium rounded-lg shadow-sm hover:bg-surface-container-low transition-all">
                        <span className="material-symbols-outlined text-lg">download</span>
                        {t('export')}
                    </button>
                    <Link to="/conventions" className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm hover:bg-primary-container transition-all">
                        <span className="material-symbols-outlined text-lg">add</span>
                        {t('new_convention')}
                    </Link>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden bg-white p-6 rounded-xl shadow-sm group hover:shadow-md transition-shadow">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t('num_conventions')}</p>
                            <h3 className="text-3xl font-bold text-on-surface">{totalConventions}</h3>
                            <p className="text-xs text-tertiary-container font-medium mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +12.5% {t('vs_last_month')}
                            </p>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg text-primary">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
                        <svg className="w-full h-full preserve-3d" viewBox="0 0 400 100">
                            <path d="M0 80 Q 50 20, 100 70 T 200 40 T 300 60 T 400 20" fill="none" stroke="#3525cd" strokeWidth="4"></path>
                        </svg>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-white p-6 rounded-xl shadow-sm group hover:shadow-md transition-shadow">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t('avg_kpi')}</p>
                            <h3 className="text-3xl font-bold text-on-surface">{avgKpis}%</h3>
                            <p className="text-xs text-tertiary-container font-medium mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +3.2% {t('global_performance')}
                            </p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg text-tertiary">
                            <span className="material-symbols-outlined">query_stats</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 100">
                            <path d="M0 50 Q 100 50, 200 50 T 400 20" fill="none" stroke="#005338" strokeWidth="4"></path>
                        </svg>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-white p-6 rounded-xl shadow-sm group hover:shadow-md transition-shadow">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t('active_partners')}</p>
                            <h3 className="text-3xl font-bold text-on-surface">
                                {new Set(conventions.flatMap(c => (c.partners || '').split(',').map(s => s.trim()).filter(Boolean))).size}
                            </h3>
                            <p className="text-xs text-on-surface-variant font-medium mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">group</span>
                                {t('new_this_semester')}
                            </p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-secondary">
                            <span className="material-symbols-outlined">handshake</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 100">
                            <path d="M0 90 L 50 70 L 100 80 L 150 40 L 200 60 L 250 30 L 300 50 L 400 20" fill="none" stroke="#505f76" strokeWidth="4"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-lg font-semibold text-on-surface">{t('kpi_evolution')}</h2>
                            <p className="text-sm text-on-surface-variant">{t('aggregated_performance')}</p>
                        </div>
                        <select className="bg-surface-container-low border-none rounded-lg text-xs font-medium text-on-surface focus:ring-2 focus:ring-primary/20 outline-none">
                            <option>Année 2026</option>
                            <option>Année 2025</option>
                        </select>
                    </div>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3525cd" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3525cd" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#464555', fontSize: 10, textTransform: 'uppercase'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#464555', fontSize: 10}} />
                                <Tooltip contentStyle={{backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="val" stroke="#3525cd" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-lg font-semibold text-on-surface mb-2">{t('convention_status_dist')}</h2>
                    <p className="text-sm text-on-surface-variant mb-6">{t('distribution_by_status')}</p>
                    <div className="relative h-48 w-full mx-auto mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e3e5'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-on-surface">{totalConventions}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase">{t('total')}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {statusData.map(st => {
                            const pct = totalConventions > 0 ? ((st.value / totalConventions) * 100).toFixed(0) : 0;
                            return (
                                <div key={st.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: st.color}}></div>
                                        <span className="text-sm text-on-surface">{st.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-on-surface">{pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Lower Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 bg-indigo-600 rounded-xl p-6 text-white flex flex-col justify-between">
                    <div>
                        <h4 className="font-semibold text-indigo-100 mb-2">{t('q4_objectives')}</h4>
                        <p className="text-2xl font-bold">78/100</p>
                    </div>
                    <div className="mt-4 bg-indigo-500/30 h-2 rounded-full overflow-hidden">
                        <div className="bg-white h-full w-[78%]"></div>
                    </div>
                    <p className="text-[10px] mt-2 text-indigo-200 uppercase tracking-widest">{t('on_track')}</p>
                </div>
                
                <div className="md:col-span-3 bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 flex items-start justify-between overflow-hidden relative">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-error">warning</span>
                            <h4 className="text-lg font-semibold text-on-surface">{t('pending_conventions')}</h4>
                        </div>
                        <div className="space-y-3">
                            {conventions.filter(c => c.status === 'en attente').length > 0 ? (
                                conventions.filter(c => c.status === 'en attente').map(conv => (
                                    <div key={conv.id} className="p-3 bg-white/50 rounded-lg border border-outline-variant/5">
                                        <p className="text-sm font-medium text-on-surface">
                                            {t('pending_attention', { name: conv.name })}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-on-surface-variant italic">
                                    Aucune convention critique n'arrive à échéance dans les prochains jours.
                                </p>
                            )}
                        </div>
                        <Link to="/conventions" className="mt-6 inline-block px-4 py-2 bg-white rounded-lg text-xs font-bold text-on-surface shadow-sm hover:bg-white/80 transition-all border border-outline-variant/10">
                            {t('all_dossiers')}
                        </Link>
                    </div>
                    <div className="hidden lg:block relative z-10 opacity-10">
                        <span className="material-symbols-outlined text-[120px] text-error">notification_important</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
