import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Plus, Download, Edit, Trash2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const Conventions = () => {
    const [conventions, setConventions] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', partners: '', start_date: '', end_date: '', status: 'en attente' });

    useEffect(() => {
        fetchConventions();
    }, []);

    const fetchConventions = async () => {
        try {
            const res = await api.get('/conventions');
            setConventions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Nom', 'Partenaires', 'Date de début', 'Date de fin', 'Statut'];
        const csvContent = [
            headers.join(','),
            ...filteredConventions.map(c => [
                c.id, `"${c.name}"`, `"${c.partners || ''}"`, c.start_date, c.end_date, c.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `conventions_${format(new Date(), 'yyyyMMdd')}.csv`;
        link.click();
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/conventions/${editingId}`, formData);
            } else {
                await api.post('/conventions', formData);
            }
            setIsModalOpen(false);
            fetchConventions();
        } catch (err) {
            alert('Erreur: Vérifiez les permissions ou les champs.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette convention ?')) return;
        try {
            await api.delete(`/conventions/${id}`);
            fetchConventions();
        } catch (err) {
            alert('Erreur lors de la suppression.');
        }
    };

    const openModal = (conv = null) => {
        if (conv) {
            setEditingId(conv.id);
            setFormData({ name: conv.name, partners: conv.partners || '', start_date: conv.start_date, end_date: conv.end_date, status: conv.status });
        } else {
            setEditingId(null);
            setFormData({ name: '', partners: '', start_date: '', end_date: '', status: 'en attente' });
        }
        setIsModalOpen(true);
    };

    const filteredConventions = conventions.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        (c.partners && c.partners.toLowerCase().includes(search.toLowerCase()))
    );

    const getStatusBadge = (status) => {
        switch(status) {
            case 'en cours': return <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">En cours</span>;
            case 'terminé': return <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-semibold">Terminé</span>;
            case 'en attente': return <span className="px-2 py-1 bg-outline-variant/30 text-on-surface-variant rounded-full text-xs font-semibold">En attente</span>;
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-display-sm font-medium tracking-tight text-on-surface">Conventions</h1>
                <div className="flex gap-3">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-variant transition-colors text-body-md font-medium shadow-sm">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-container transition-colors text-body-md font-medium shadow-sm">
                        <Plus className="w-4 h-4" /> Nouvelle
                    </button>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-glass border border-outline-variant/15 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-outline-variant/15 flex items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une convention..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-lg pl-10 pr-4 py-2 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-label-md text-on-surface-variant uppercase tracking-wider">
                                <th className="p-4 font-medium border-b border-outline-variant/15">Nom</th>
                                <th className="p-4 font-medium border-b border-outline-variant/15">Partenaires</th>
                                <th className="p-4 font-medium border-b border-outline-variant/15">Période</th>
                                <th className="p-4 font-medium border-b border-outline-variant/15">Statut</th>
                                <th className="p-4 font-medium border-b border-outline-variant/15 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-body-md">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">Chargement...</td></tr>
                            ) : filteredConventions.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">Aucune convention trouvée.</td></tr>
                            ) : (
                                filteredConventions.map(conv => (
                                    <tr key={conv.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                                        <td className="p-4 font-medium text-on-surface">
                                            <Link to={`/conventions/${conv.id}`} className="hover:text-primary transition-colors flex items-center gap-2">
                                                {conv.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-on-surface-variant">{conv.partners || '-'}</td>
                                        <td className="p-4 text-on-surface-variant">
                                            {format(new Date(conv.start_date), 'dd/MM/yyyy')} - {format(new Date(conv.end_date), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="p-4">{getStatusBadge(conv.status)}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => openModal(conv)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(conv.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <Link to={`/conventions/${conv.id}`} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
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
                            <h2 className="text-headline-sm font-semibold">{editingId ? 'Modifier Convention' : 'Nouvelle Convention'}</h2>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-label-md uppercase text-on-surface-variant mb-1">Nom</label>
                                <input required type="text" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-label-md uppercase text-on-surface-variant mb-1">Partenaires</label>
                                <input type="text" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none" value={formData.partners} onChange={e => setFormData({...formData, partners: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-label-md uppercase text-on-surface-variant mb-1">Date début</label>
                                    <input required type="date" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md outline-none" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-label-md uppercase text-on-surface-variant mb-1">Date fin</label>
                                    <input required type="date" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md outline-none" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-label-md uppercase text-on-surface-variant mb-1">Statut</label>
                                <select className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-body-md outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="en attente">En attente</option>
                                    <option value="en cours">En cours</option>
                                    <option value="terminé">Terminé</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/15">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container-high transition-colors">Annuler</button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-body-md font-medium hover:opacity-90 transition-colors shadow-sm">{editingId ? 'Enregistrer' : 'Créer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Conventions;
