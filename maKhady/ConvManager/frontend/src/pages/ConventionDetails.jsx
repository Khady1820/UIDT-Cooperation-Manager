import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Plus, Edit, Trash2, X, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ConventionDetails = () => {
    const { id } = useParams();
    const [convention, setConvention] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKpi, setEditingKpi] = useState(null);
    const [formData, setFormData] = useState({ name: '', value: '', description: '' });

    useEffect(() => {
        fetchConvention();
    }, [id]);

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

    const handleSaveKpi = async (e) => {
        e.preventDefault();
        try {
            if (editingKpi) {
                await api.put(`/kpis/${editingKpi.id}`, formData);
            } else {
                await api.post('/kpis', { ...formData, convention_id: id });
            }
            setIsModalOpen(false);
            fetchConvention(); // refresh to get new kpis
        } catch (err) {
            alert('Erreur lors de l\'enregistrement.');
        }
    };

    const handleDeleteKpi = async (kpiId) => {
        if (!window.confirm('Supprimer ce KPI ?')) return;
        try {
            await api.delete(`/kpis/${kpiId}`);
            fetchConvention();
        } catch (err) {
            alert('Erreur: permission refusée.');
        }
    };

    const openModal = (kpi = null) => {
        if (kpi) {
            setEditingKpi(kpi);
            setFormData({ name: kpi.name, value: kpi.value, description: kpi.description || '' });
        } else {
            setEditingKpi(null);
            setFormData({ name: '', value: '', description: '' });
        }
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-surface-500 font-bold uppercase tracking-widest text-[10px]">Chargement du dossier...</p>
            </div>
        </div>
    );
    
    if (!convention) return (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-500 font-bold">Convention introuvable.</p>
            <Link to="/conventions" className="text-sm text-red-600 hover:underline mt-2 inline-block">Retour à la liste</Link>
        </div>
    );

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
            <div className="flex flex-col sm:flex-row items-start gap-6">
                <Link to="/conventions" className="p-3 bg-card-bg border border-outline-variant text-surface-400 hover:text-primary hover:border-primary/30 rounded-xl transition-all shadow-premium group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10">Convention #{id}</span>
                        {convention.status && (
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                                convention.status === 'en cours' ? 'bg-indigo-50 text-indigo-500 border-indigo-100' : 
                                convention.status === 'terminé' ? 'bg-secondary/10 text-secondary border-secondary/10' : 
                                'bg-surface-100 text-surface-500 border-surface-200'
                            }`}>
                                {convention.status}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight leading-tight">{convention.name}</h1>
                    <p className="text-surface-500 mt-2 font-medium flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            {format(new Date(convention.start_date), 'dd MMM yyyy')} — {format(new Date(convention.end_date), 'dd MMM yyyy')}
                        </span>
                        {convention.partners && (
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">handshake</span>
                                {convention.partners}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                    <div className="bg-card-bg p-7 rounded-2xl shadow-premium border border-outline-variant relative overflow-hidden group transition-colors duration-300">
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Total KPIs</p>
                            <h3 className="text-4xl font-black text-surface-900 leading-none">{(convention.kpis || []).length}</h3>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
                             <ClipboardCheck className="w-20 h-20" />
                        </div>
                    </div>

                    <div className="bg-primary p-7 rounded-2xl shadow-premium relative overflow-hidden group">
                        <div className="relative z-10 text-white">
                            <p className="text-[10px] font-bold text-primary-100 uppercase tracking-widest mb-1">Performance</p>
                            <h3 className="text-4xl font-black leading-none">
                                {convention.kpis?.length > 0 
                                    ? (convention.kpis.reduce((acc, k) => acc + parseFloat(k.value || 0), 0) / convention.kpis.length).toFixed(1)
                                    : '0'}%
                            </h3>
                            <p className="text-[10px] font-medium text-primary-100 mt-3 uppercase tracking-tighter italic">Moyenne calculée</p>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 text-white">
                             <span className="material-symbols-outlined text-[80px]">trending_up</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main KPI Table */}
                <motion.div variants={itemVariants} className="lg:col-span-3 bg-card-bg rounded-2xl shadow-premium border border-outline-variant overflow-hidden flex flex-col transition-colors duration-300">
                    <div className="p-6 border-b border-outline-variant bg-surface-alt/30 flex justify-between items-center transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">analytics</span>
                            </div>
                            <h2 className="text-xl font-bold text-surface-900 leading-none">Indicateurs de Performance</h2>
                        </div>
                        <button onClick={() => openModal()} className="premium-button-primary flex items-center gap-2 text-xs">
                            <Plus className="w-4 h-4" /> Ajouter un KPI
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-50/50 text-[10px] text-surface-400 uppercase font-black tracking-widest">
                                    <th className="p-6 border-b border-surface-100">Nom du KPI</th>
                                    <th className="p-6 border-b border-surface-100">Valeur actuelle</th>
                                    <th className="p-6 border-b border-surface-100">Description / Détails</th>
                                    <th className="p-6 border-b border-surface-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {(!convention.kpis || convention.kpis.length === 0) ? (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <ClipboardCheck className="w-12 h-12" />
                                                <p className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">Aucun KPI défini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {convention.kpis.map((kpi, idx) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={kpi.id} 
                                                className="border-b border-outline-variant hover:bg-surface-alt/50 transition-all group"
                                            >
                                                <td className="p-6">
                                                    <span className="font-bold text-surface-900 flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:scale-150 transition-transform"></div>
                                                        {kpi.name}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="inline-flex items-center px-3 py-1 bg-surface-50 rounded-lg border border-surface-100">
                                                        <span className="text-primary font-black text-lg leading-none">{kpi.value}</span>
                                                        <span className="text-[10px] text-surface-400 font-bold ml-1 uppercase">%</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-surface-500 font-medium text-xs max-w-xs leading-relaxed italic line-clamp-2">
                                                        {kpi.description || '—'}
                                                    </p>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-end gap-1">
                                                        <button onClick={() => openModal(kpi)} className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteKpi(kpi.id)} className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card relative z-10 w-full max-w-lg overflow-hidden flex flex-col shadow-2xl bg-card-bg border border-outline-variant rounded-3xl transition-colors duration-300"
                        >
                            <div className="p-6 border-b border-outline-variant bg-surface-alt/50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-surface-900 leading-none">{editingKpi ? 'Modifier le KPI' : 'Ajouter un indicateur'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-200 rounded-full transition-colors text-surface-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveKpi} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Nom de l'indicateur</label>
                                    <input required type="text" className="premium-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Taux de réalisation" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Valeur (%)</label>
                                    <div className="relative">
                                        <input required type="number" step="0.01" className="premium-input pr-10" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="0.00" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 font-bold">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Description / Objectifs</label>
                                    <textarea className="premium-input min-h-[120px] resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Détails sur le mode de calcul ou les cibles..." />
                                </div>
                                <div className="pt-6 flex justify-end gap-4 border-t border-surface-50">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-surface-600 hover:bg-surface-50 transition-all uppercase tracking-widest">Annuler</button>
                                    <button type="submit" className="premium-button-primary px-8 py-2.5 text-sm uppercase tracking-widest leading-none">{editingKpi ? 'Mettre à jour' : 'Ajouter au dossier'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ConventionDetails;
