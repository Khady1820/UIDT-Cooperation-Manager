import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

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

    if (loading) return <div className="text-on-surface-variant p-8">Chargement...</div>;
    if (!convention) return <div className="text-error p-8">Convention introuvable.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/conventions" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-display-sm font-medium tracking-tight text-on-surface">{convention.name}</h1>
                    <p className="text-body-md text-on-surface-variant mt-1">
                        {format(new Date(convention.start_date), 'dd/MM/yyyy')} - {format(new Date(convention.end_date), 'dd/MM/yyyy')}
                        {convention.partners && ` • Partenaires: ${convention.partners}`}
                    </p>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-glass border border-outline-variant/15 overflow-hidden">
                <div className="p-6 border-b border-outline-variant/15 flex justify-between items-center">
                    <h2 className="text-headline-sm font-semibold text-on-surface">Indicateurs de Performance (KPIs)</h2>
                    <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-container transition-colors text-body-md font-medium shadow-sm">
                        <Plus className="w-4 h-4" /> Ajouter un KPI
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-label-md text-on-surface-variant uppercase tracking-wider">
                                <th className="p-4 font-medium border-b border-outline-variant/15">Nom du KPI</th>
                                <th className="p-4 font-medium border-b border-outline-variant/15">Valeur</th>
                                <th className="p-4 font-medium border-b border-outline-variant/15">Description</th>
                                <th className="p-4 font-medium border-b border-outline-variant/15 text-right flex justify-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-body-md">
                            {(!convention.kpis || convention.kpis.length === 0) ? (
                                <tr><td colSpan="4" className="p-8 text-center text-on-surface-variant">Aucun KPI pour cette convention.</td></tr>
                            ) : (
                                convention.kpis.map(kpi => (
                                    <tr key={kpi.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                                        <td className="p-4 font-medium text-on-surface">{kpi.name}</td>
                                        <td className="p-4 text-primary font-bold">{kpi.value}</td>
                                        <td className="p-4 text-on-surface-variant text-sm truncate max-w-xs">{kpi.description || '-'}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => openModal(kpi)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteKpi(kpi.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm p-4">
                    <div className="bg-surface-container-lowest rounded-xl shadow-glass w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-outline-variant/15">
                            <h2 className="text-headline-sm font-semibold">{editingKpi ? 'Modifier le KPI' : 'Ajouter un KPI'}</h2>
                        </div>
                        <form onSubmit={handleSaveKpi} className="p-6 space-y-4">
                            <div>
                                <label className="block text-label-md uppercase text-on-surface-variant mb-1">Nom du KPI</label>
                                <input required type="text" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Nombre d'inscrits" />
                            </div>
                            <div>
                                <label className="block text-label-md uppercase text-on-surface-variant mb-1">Valeur</label>
                                <input required type="number" step="0.01" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-label-md uppercase text-on-surface-variant mb-1">Description</label>
                                <textarea className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/15">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container-high transition-colors">Annuler</button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-body-md font-medium hover:opacity-90 transition-colors shadow-sm">{editingKpi ? 'Enregistrer' : 'Créer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConventionDetails;
