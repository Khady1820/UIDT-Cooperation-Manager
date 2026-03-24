import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Handshake, CheckCircle2, Clock, PlayCircle, BarChart3 } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const stats = {
        total: conventions.length,
        active: conventions.filter(c => c.status === 'en cours').length,
        pending: conventions.filter(c => c.status === 'en attente').length,
        completed: conventions.filter(c => c.status === 'terminé').length,
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'en cours': return 'text-primary bg-primary/10 border-primary/20';
            case 'terminé': return 'text-success bg-success/10 border-success/20';
            case 'en attente': return 'text-on-surface-variant bg-surface-container-high border-outline-variant/30';
            default: return 'text-on-surface-variant bg-surface-container-high';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'en cours': return <PlayCircle className="w-4 h-4" />;
            case 'terminé': return <CheckCircle2 className="w-4 h-4" />;
            case 'en attente': return <Clock className="w-4 h-4" />;
            default: return null;
        }
    };

    // Mock KPI data for visualization
    const kpiData = [
        { name: 'Jan', performance: 65 },
        { name: 'Fév', performance: 59 },
        { name: 'Mar', performance: 80 },
        { name: 'Avr', performance: 81 },
        { name: 'Mai', performance: 56 },
        { name: 'Juin', performance: 95 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section with Partner welcome */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-display-sm font-medium tracking-tight text-on-surface">Bonjour, {user?.name}</h1>
                    <p className="text-body-lg text-on-surface-variant mt-1">Bienvenue sur votre espace partenaire dédié.</p>
                </div>
                <div className="relative z-10 px-4 py-2 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-2">
                    <Handshake className="text-primary w-5 h-5" />
                    <span className="text-primary font-medium">{user?.role?.name || 'Partenaire'}</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Conventions', value: stats.total, icon: LayoutDashboard, color: 'bg-primary' },
                    { label: 'En Cours', value: stats.active, icon: PlayCircle, color: 'bg-indigo-500' },
                    { label: 'En Attente', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
                    { label: 'Terminées', value: stats.completed, icon: CheckCircle2, color: 'bg-emerald-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-${stat.color.split('-')[1]}/20 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-label-md uppercase tracking-wider text-on-surface-variant mb-1">{stat.label}</p>
                        <h3 className="text-display-sm font-bold text-on-surface">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Evolution Profile */}
                <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-title-lg font-semibold text-on-surface">Performance de Partenariat</h2>
                            <p className="text-body-sm text-on-surface-variant">Évolution de l'atteinte des KPIs sur le semestre</p>
                        </div>
                        <div className="p-2 bg-surface-container-high rounded-xl">
                            <BarChart3 className="w-5 h-5 text-on-surface-variant" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={kpiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3525cd" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3525cd" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#464555', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#464555', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                    itemStyle={{color: '#3525cd', fontWeight: 'bold'}}
                                />
                                <Area type="monotone" dataKey="performance" stroke="#3525cd" strokeWidth={4} fillOpacity={1} fill="url(#colorPerf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* List of active conventions with KPIs */}
                <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm flex flex-col">
                    <h2 className="text-title-lg font-semibold text-on-surface mb-6">Vos Conventions</h2>
                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
                        {conventions.length === 0 ? (
                            <div className="text-center p-8 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
                                <p className="text-on-surface-variant text-sm">Aucune convention associée.</p>
                            </div>
                        ) : (
                            conventions.map(conv => (
                                <div key={conv.id} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors">{conv.name}</h4>
                                        <div className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${getStatusColor(conv.status)}`}>
                                            {getStatusIcon(conv.status)}
                                            {conv.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-on-surface-variant">
                                        <BarChart3 className="w-3 h-3" />
                                        <span className="text-[11px] font-medium italic">
                                            {conv.kpis && conv.kpis.length > 0 
                                                ? `${conv.kpis.length} KPIs suivis` 
                                                : "Aucun KPI défini"}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-[11px] text-on-surface-variant font-medium">
                                        <span>Début: {new Date(conv.start_date).toLocaleDateString()}</span>
                                        <span>Fin: {new Date(conv.end_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerDashboard;
