import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Plus, Download, Edit, Trash2, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';

const Conventions = () => {
    const [conventions, setConventions] = useState([]);
    const { searchQuery, setSearchQuery } = useSearch();
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
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.partners || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch(status) {
            case 'en cours': return <span className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/10">En cours</span>;
            case 'terminé': return <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest border border-secondary/10">Terminé</span>;
            case 'en attente': return <span className="px-3 py-1 bg-surface-100 text-surface-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-surface-200">En attente</span>;
            default: return status;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Conventions</h1>
                    <p className="text-surface-500 mt-1 font-medium italic">Liste complète des dossiers et contrats.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-5 py-2.5 bg-card-bg text-surface-700 text-sm font-bold rounded-xl shadow-premium border border-outline-variant hover:bg-surface-50 transition-colors duration-300">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={() => openModal()} className="premium-button-primary flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4" /> Nouvelle convention
                    </button>
                </div>
            </div>

            <div className="bg-card-bg rounded-2xl shadow-premium border border-outline-variant overflow-hidden flex flex-col transition-colors duration-300">
                <div className="p-6 border-b border-outline-variant bg-surface-alt/30 flex flex-col sm:flex-row items-center gap-4 transition-colors duration-300">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom ou partenaire..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-alt border border-outline-variant text-on-surface rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                        />
                    </div>
                    {/* Add more filters here if needed */}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-alt/50 text-[10px] text-surface-400 uppercase font-black tracking-widest transition-colors duration-300">
                                <th className="p-6 border-b border-outline-variant">Nom de la convention</th>
                                <th className="p-6 border-b border-outline-variant">Partenaires</th>
                                <th className="p-6 border-b border-outline-variant">Période d'exécution</th>
                                <th className="p-6 border-b border-outline-variant text-center">Statut</th>
                                <th className="p-6 border-b border-outline-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm transition-colors duration-300">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            <p className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">Chargement des données...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredConventions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 grayscale opacity-40">
                                            <Search className="w-12 h-12" />
                                            <p className="text-surface-400 font-bold uppercase tracking-widest text-[10px]">Aucune convention trouvée.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {filteredConventions.map((conv, index) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={conv.id} 
                                            className="border-b border-outline-variant hover:bg-surface-alt/50 transition-all group"
                                        >
                                            <td className="p-6">
                                                <Link to={`/conventions/${conv.id}`} className="font-bold text-surface-900 group-hover:text-primary transition-colors flex items-center gap-3">
                                                   <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-surface-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                       <span className="material-symbols-outlined text-[18px]">article</span>
                                                   </div>
                                                    {conv.name}
                                                </Link>
                                            </td>
                                            <td className="p-6 text-surface-500 font-medium">{conv.partners || '-'}</td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-surface-900 font-bold">{format(new Date(conv.start_date), 'dd MMM yyyy')}</span>
                                                    <span className="text-[10px] text-surface-400 font-black uppercase tracking-tighter">Jusqu'au {format(new Date(conv.end_date), 'dd MMM yyyy')}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">{getStatusBadge(conv.status)}</td>
                                            <td className="p-6">
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => openModal(conv)} className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Modifier">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(conv.id)} className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Supprimer">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <Link to={`/conventions/${conv.id}`} className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Détails">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>
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
                            className="relative z-10 w-full max-w-lg overflow-hidden flex flex-col shadow-2xl bg-card-bg border border-outline-variant rounded-3xl transition-colors duration-300"
                        >
                            <div className="p-6 border-b border-outline-variant bg-surface-alt/30 flex justify-between items-center transition-colors duration-300">
                                <h2 className="text-xl font-bold text-surface-900 leading-none">{editingId ? 'Modifier la convention' : 'Nouvelle Convention'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-200 rounded-full transition-colors text-surface-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Nom de la convention</label>
                                    <input required type="text" className="premium-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Partenariat Technologique Q3" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Partenaires concernés</label>
                                    <input type="text" className="premium-input" value={formData.partners} onChange={e => setFormData({...formData, partners: e.target.value})} placeholder="Ex: Google, AWS" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Date de début</label>
                                        <input required type="date" className="premium-input" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Date de fin</label>
                                        <input required type="date" className="premium-input" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1">Statut actuel</label>
                                    <select className="premium-input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="en attente">En attente</option>
                                        <option value="en cours">En cours</option>
                                        <option value="terminé">Terminé</option>
                                    </select>
                                </div>
                                <div className="pt-6 flex justify-end gap-4 border-t border-surface-50">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-surface-600 hover:bg-surface-50 transition-all uppercase tracking-widest">Annuler</button>
                                    <button type="submit" className="premium-button-primary px-8 py-2.5 text-sm uppercase tracking-widest leading-none">{editingId ? 'Enregistrer' : 'Créer le dossier'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Conventions;
