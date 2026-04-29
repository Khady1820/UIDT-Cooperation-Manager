import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ConventionSummary = () => {
    const { id } = useParams();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [convention, setConvention] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConvention = async () => {
            try {
                const res = await api.get(`/conventions/${id}`);
                setConvention(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConvention();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
        </div>
    );

    if (!convention) return (
        <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-400">
            Dossier introuvable.
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-20"
        >
            {/* Header Navigation */}
            <div className="flex items-center justify-between no-print">
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-[#2E2F7F] dark:group-hover:text-white transition-colors">arrow_back</span>
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest group-hover:text-[#2E2F7F] dark:group-hover:text-white transition-colors">Retour à la liste</span>
                </button>
                <div className="flex gap-4">
                    <button 
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">print</span>
                        Imprimer Fiche
                    </button>
                    <Link 
                        to={`/conventions/${id}`}
                        className="px-6 py-2 bg-[#2E2F7F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#F7931E] transition-all shadow-lg flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">folder_open</span>
                        Voir Dossier Complet
                    </Link>
                </div>
            </div>

            {/* Technical Sheet Title */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800 bg-gradient-to-br from-white dark:from-slate-900 to-gray-50/50 dark:to-slate-800/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <span className="px-4 py-1.5 bg-[#2E2F7F]/10 dark:bg-white/5 text-[#2E2F7F] dark:text-indigo-300 text-[10px] font-black rounded-lg uppercase tracking-widest border border-[#2E2F7F]/20 dark:border-white/10">
                            Fiche Technique de Coopération
                        </span>
                        <h1 className="text-xl font-black text-[#2E2F7F] dark:text-white tracking-tight uppercase leading-tight mt-1">{convention.name}</h1>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">DOSSIER REF: {convention.num_dossier || convention.id}</p>
                    </div>
                    <div className="bg-[#2E2F7F] dark:bg-slate-800 text-white px-8 py-4 rounded-3xl text-center shadow-xl shadow-[#2E2F7F]/20 dark:shadow-black/20">
                        <p className="text-[9px] font-black opacity-50 uppercase tracking-[0.2em] mb-1">Statut Finalisé</p>
                        <p className="text-xs font-black uppercase tracking-widest">{convention.status.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            {/* Technical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Classification', value: convention.type?.toUpperCase(), icon: 'public' },
                    { label: 'Type Partenaire', value: convention.partner_type || 'Non spécifié', icon: 'business_center' },
                    { label: 'Année de Signature', value: convention.year || '2024', icon: 'calendar_today' },
                    { label: 'Durée Prévue', value: convention.duration || 'À déterminer', icon: 'schedule' }
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#2E2F7F] dark:text-white">
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-black text-[#2E2F7F] dark:text-indigo-300">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Partners & Objectives */}
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="material-symbols-outlined">handshake</span>
                                Institution Partenaire
                            </h3>
                            <p className="text-sm font-black text-[#F7931E] uppercase tracking-tight">{convention.partners || '—'}</p>
                        </div>
                        
                        <div className="h-px bg-gray-50 dark:bg-slate-800"></div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="material-symbols-outlined">target</span>
                                Objectifs du Tableau de Bord
                            </h3>
                            <div className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-medium italic bg-gray-50/50 dark:bg-white/5 p-8 rounded-[2rem] border border-gray-50 dark:border-slate-800 whitespace-pre-wrap">
                                {convention.objectives || 'Aucun objectif spécifié.'}
                            </div>
                        </div>
                    </div>

                    {/* Observations */}
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
                        <h3 className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                            <span className="material-symbols-outlined">notes</span>
                            Observations Complémentaires
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed italic border-l-4 border-[#F7931E] pl-6">
                            {convention.observations || 'Aucune observation enregistrée.'}
                        </p>
                    </div>
                </div>

                {/* Sidebar Performance */}
                <div className="space-y-8">
                    <div className="bg-[#2E2F7F] dark:bg-slate-800 p-10 rounded-[3rem] text-white shadow-xl shadow-[#2E2F7F]/10 dark:shadow-black/20 relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <span className="material-symbols-outlined text-[#F7931E]">analytics</span>
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Suivi de Performance</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black opacity-40 uppercase">Indicateur de Mesure</p>
                                    <p className="text-sm font-black leading-tight italic">"{convention.indicator || 'Indicateur global'}"</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <p className="text-[8px] font-black opacity-40 uppercase mb-1">Valeur Cible</p>
                                        <p className="text-xl font-black">{convention.target || 0}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <p className="text-[8px] font-black opacity-40 uppercase mb-1">Valeur Atteinte</p>
                                        <p className="text-xl font-black">{convention.actual_value || 0}</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[9px] font-black text-[#F7931E] uppercase">Taux de Réalisation</p>
                                        <p className="text-2xl font-black text-[#F7931E]">{parseFloat(convention.completion_rate || 0).toFixed(1)}%</p>
                                    </div>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, convention.completion_rate || 0)}%` }}
                                            className="h-full bg-[#F7931E]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ConventionSummary;
