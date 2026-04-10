import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { useLanguage } from '../context/LanguageContext';

const Conventions = () => {
    const [conventions, setConventions] = useState([]);
    const { searchQuery, setSearchQuery } = useSearch();
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        type: 'national',
        partner_type: '',
        description: '',
        objectives: '',
        partners: '', 
        year: new Date().getFullYear(),
        duration: '',
        indicator: '',
        target: '',
        actual_value: '',
        completion_rate: '',
        observations: '',
        start_date: '', 
        end_date: '', 
        status: 'brouillon' 
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchConventions();
    }, []);

    const fetchConventions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/conventions');
            setConventions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        const newFormData = { ...formData, [field]: value };
        
        // Auto-calculate completion rate
        if (field === 'target' || field === 'actual_value') {
            const target = parseFloat(field === 'target' ? value : formData.target);
            const actual = parseFloat(field === 'actual_value' ? value : formData.actual_value);
            if (target && actual && target > 0) {
                newFormData.completion_rate = ((actual / target) * 100).toFixed(2);
            }
        }
        
        setFormData(newFormData);
    };


    const handleSave = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        Object.keys(formData).forEach(key => {
            // Clean data: avoid sending empty strings for numeric/optional fields
            if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                payload.append(key, formData[key]);
            }
        });
        
        if (selectedFile) {
            payload.append('file', selectedFile);
        }

        try {
            if (editingId) {
                // Laravel workaround: use POST with _method=PUT for FormData with files
                payload.append('_method', 'PUT');
                await api.post(`/conventions/${editingId}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/conventions', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            setSelectedFile(null);
            fetchConventions();
        } catch (err) {
            console.error("Erreur de soumission:", err.response?.data || err.message);
            const errorMsg = err.response?.data?.message || 'Erreur technique. Veuillez vérifier vos accès et les données saisies.';
            alert(errorMsg);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce dossier ?')) return;
        try {
            await api.delete(`/conventions/${id}`);
            fetchConventions();
        } catch (err) {
            alert('Suppression impossible.');
        }
    };

    const openModal = (conv = null) => {
        if (conv) {
            setEditingId(conv.id);
            setFormData({ 
                name: conv.name || '', 
                type: conv.type || 'national',
                partner_type: conv.partner_type || '',
                description: conv.description || '',
                objectives: conv.objectives || '',
                partners: conv.partners || '', 
                year: conv.year || new Date().getFullYear(),
                duration: conv.duration || '',
                indicator: conv.indicator || '',
                target: conv.target || '',
                actual_value: conv.actual_value || '',
                completion_rate: conv.completion_rate || '',
                observations: conv.observations || '',
                start_date: conv.start_date || '', 
                end_date: conv.end_date || '', 
                status: conv.status || 'brouillon' 
            });
        } else {
            setEditingId(null);
            setFormData({ 
                name: '', 
                type: 'national',
                partner_type: '',
                description: '',
                objectives: '',
                partners: '', 
                year: new Date().getFullYear(),
                duration: '',
                indicator: '',
                target: '',
                actual_value: '',
                completion_rate: '',
                observations: '',
                start_date: '', 
                end_date: '', 
                status: 'brouillon' 
            });
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const filteredConventions = conventions.filter(c => 
        c.status !== 'termine' && c.status !== 'archived'
    ).filter(c => 
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.partners || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.partner_type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#001D3D] tracking-tight">{t('conventions')}</h1>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{t('institutional_sub')} • Répertoire des Projets</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => fetchConventions()} className="p-4 bg-white border border-gray-100 rounded-2xl text-[#001D3D] hover:bg-gray-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px] block">refresh</span>
                    </button>
                    <button onClick={() => openModal()} className="px-8 py-4 bg-[#001D3D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#002b5c] transition-all shadow-[0_20px_40px_rgba(0,29,61,0.15)] flex items-center gap-3 active:scale-95">
                        {t('nouvelle_convention')}
                    </button>
                </div>
            </div>

            {/* Main Content Card with Horizontal Scroll */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50 bg-[#FBFBFB]/50 flex items-center justify-between">
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#001D3D] transition-colors text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder={t('search')} 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 text-[#001D3D] rounded-2xl pl-14 pr-6 py-4 text-xs font-bold placeholder:text-gray-300 focus:outline-none focus:ring-8 focus:ring-[#001D3D]/5 focus:border-[#001D3D]/10 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {filteredConventions.length} Dossiers Actifs
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse table-fixed min-w-[1800px]">
                        <thead>
                            <tr className="bg-[#F1F3F5]/30 text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-6 w-20">{t('num_short')}</th>
                                <th className="px-8 py-6 w-80">{t('project_title_short')}</th>
                                <th className="px-8 py-6 w-40">{t('cooperation_type')}</th>
                                <th className="px-8 py-6 w-48">{t('partner_type')}</th>
                                <th className="px-8 py-6 w-64">{t('partner_institution')}</th>
                                <th className="px-8 py-6 w-24">{t('year')}</th>
                                <th className="px-8 py-6 w-64">{t('institutional_objectives')}</th>
                                <th className="px-8 py-6 w-32">{t('duration')}</th>
                                <th className="px-8 py-6 w-64">{t('indicator_performance')}</th>
                                <th className="px-8 py-6 w-28">{t('target')}</th>
                                <th className="px-8 py-6 w-28">{t('actual_value')}</th>
                                <th className="px-8 py-6 w-48">{t('completion_rate')}</th>
                                <th className="px-8 py-6 w-64">{t('observations')}</th>
                                <th className="px-8 py-6 w-24">Doc.</th>
                                <th className="px-8 py-6 w-32 text-right sticky right-0 bg-[#FBFBFB] shadow-[-10px_0_20px_rgba(0,0,0,0.02)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="14" className="p-32 text-center bg-white">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-[#001D3D]/10 border-t-[#001D3D] rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-[#001D3D] uppercase tracking-widest opacity-40">Synchronisation des bases de données...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredConventions.length === 0 ? (
                                <tr>
                                    <td colSpan="14" className="p-32 text-center bg-white">
                                        <div className="flex flex-col items-center gap-6 opacity-20 grayscale">
                                            <span className="material-symbols-outlined text-7xl">inventory_2</span>
                                            <p className="text-xs font-black uppercase tracking-widest">Aucune convention institutionnelle enregistrée</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {filteredConventions.map((conv, index) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            key={conv.id} 
                                            className="hover:bg-[#F8F9FA]/80 transition-all group"
                                        >
                                            <td className="px-8 py-7 text-[11px] font-black text-gray-300">#{conv.id}</td>
                                            <td className="px-8 py-7">
                                                <Link to={`/conventions/${conv.id}`} className="font-black text-[#001D3D] tracking-tight group-hover:text-[#8B7355] transition-colors line-clamp-1 text-sm block">
                                                    {conv.name}
                                                </Link>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${conv.type === 'international' ? 'bg-indigo-50 text-indigo-500 border-indigo-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                                                    {conv.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7 text-xs font-bold text-gray-500">{conv.partner_type || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-[#001D3D] uppercase tracking-tighter">{conv.partners || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-bold text-gray-400">{conv.year || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-medium text-gray-400 line-clamp-1">{conv.objectives || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-bold text-[#8B7355]">{conv.duration || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-[#001D3D] opacity-70 italic">{conv.indicator || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-gray-300">{conv.target || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-[#001D3D]">{conv.actual_value || '-'}</td>
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                                                        <div className="h-full bg-[#001D3D]" style={{ width: `${Math.min(conv.completion_rate || 0, 100)}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#001D3D]">{conv.completion_rate || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-xs font-medium text-gray-400 italic line-clamp-1">{conv.observations || '-'}</td>
                                            <td className="px-8 py-7">
                                                {conv.file_path ? (
                                                    <a 
                                                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${conv.file_path}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 flex items-center justify-center bg-[#001D3D]/5 text-[#001D3D] rounded-xl hover:bg-[#001D3D] hover:text-white transition-all"
                                                        title="Voir le document"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">description</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-200 material-symbols-outlined text-[18px]">block</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-7 text-right sticky right-0 bg-white/95 backdrop-blur-sm group-hover:bg-[#F8F9FA]/90 transition-colors shadow-[-10px_0_20px_rgba(0,0,0,0.02)]">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openModal(conv)} title="Modifier" className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-[#001D3D] hover:shadow-lg hover:shadow-[#001D3D]/10 rounded-xl transition-all">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    {(conv.status === 'signe_recteur') && (
                                                        <button 
                                                            onClick={async () => {
                                                                await api.put(`/conventions/${conv.id}`, { status: 'termine' });
                                                                fetchConventions();
                                                            }} 
                                                            title="Archiver"
                                                            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-amber-600 hover:shadow-lg rounded-xl transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">archive</span>
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(conv.id)} title="Supprimer" className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:shadow-lg hover:shadow-red-500/10 rounded-xl transition-all">
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
            </div>

            {/* Modal Form Overhaul */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#001D3D]/40 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        ></motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative z-[110] w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden"
                        >
                            <div className="p-12 border-b border-gray-50 flex justify-between items-center bg-[#FBFBFB]">
                                <div>
                                    <h2 className="text-3xl font-black text-[#001D3D] tracking-tight">{editingId ? 'MISE À JOUR REGISTRE' : 'NOUVELLE ACCRÉDITATION'}</h2>
                                    <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.3em] mt-2">Format Rapport Stratégique Institutionnel</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-gray-300 border border-gray-100 shadow-sm active:scale-95">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-12 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    {/* Section 1: Identity */}
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8B7355] ml-1">{t('project_title_short')}</label>
                                        <input required type="text" className="uidt-input w-full" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Dénomination complète de la convention..." />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8B7355] ml-1">{t('cooperation_type')}</label>
                                        <select className="uidt-input w-full appearance-none cursor-pointer" value={formData.type} onChange={e => handleInputChange('type', e.target.value)}>
                                            <option value="national">Nationale</option>
                                            <option value="international">Internationale</option>
                                        </select>
                                    </div>

                                    {/* Section 2: Partner */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('partner_type')}</label>
                                        <input type="text" className="uidt-input w-full" value={formData.partner_type} onChange={e => handleInputChange('partner_type', e.target.value)} placeholder="Banque, ONG, Université..." />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('partner_institution')}</label>
                                        <input type="text" className="uidt-input w-full" value={formData.partners} onChange={e => handleInputChange('partners', e.target.value)} placeholder="Entités signataires partenaires..." />
                                    </div>

                                    {/* Section 3: Metrics */}
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('year')}</label>
                                        <input type="number" className="uidt-input w-full" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('duration')}</label>
                                        <input type="text" className="uidt-input w-full" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} placeholder="Ex: 5 ans, 12 mois..." />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#001D3D] ml-1">{t('status_badge') || 'Statut Activité'}</label>
                                        <select className="uidt-input w-full appearance-none cursor-pointer border-indigo-100" value={formData.status} onChange={e => handleInputChange('status', e.target.value)}>
                                            <option value="brouillon">Brouillon</option>
                                            <option value="soumis">Soumis</option>
                                            <option value="en cours">En Cours d'Exécution</option>
                                            <option value="termine">Terminé / Clos</option>
                                        </select>
                                    </div>

                                    {/* Section 4: Performance Indicator */}
                                    <div className="md:col-span-3 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-8">
                                        <div className="md:col-span-4">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#001D3D] mb-4">Mesure de la Performance Institutionnelle</label>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('indicator_performance')}</label>
                                            <input type="text" className="uidt-input w-full bg-white" value={formData.indicator} onChange={e => handleInputChange('indicator', e.target.value)} placeholder="Nom de l'indicateur (ex: Taux de formation en %)..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('target')}</label>
                                            <input type="number" className="uidt-input w-full bg-white" value={formData.target} onChange={e => handleInputChange('target', e.target.value)} placeholder="Cible 100%..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('actual_value')}</label>
                                            <input type="number" className="uidt-input w-full bg-white font-black text-[#001D3D]" value={formData.actual_value} onChange={e => handleInputChange('actual_value', e.target.value)} placeholder="Valeur atteinte..." />
                                        </div>
                                        <div className="md:col-span-4 flex items-center justify-between bg-[#001D3D] p-6 rounded-2xl text-white shadow-xl shadow-[#001D3D]/20">
                                            <div className="flex items-center gap-4">
                                                <span className="material-symbols-outlined text-[24px] text-[#8B7355]">analytics</span>
                                                <p className="text-[11px] font-black uppercase tracking-[0.2em]">{t('completion_rate')}</p>
                                            </div>
                                            <p className="text-3xl font-black">{formData.completion_rate || '0.00'} %</p>
                                        </div>
                                    </div>

                                    {/* Section 5: Text Metadata */}
                                    <div className="md:col-span-3 space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('institutional_objectives')}</label>
                                        <textarea className="uidt-input w-full min-h-[100px] py-4" value={formData.objectives} onChange={e => handleInputChange('objectives', e.target.value)} placeholder="Description synthétique des objectifs à atteindre..." />
                                    </div>
                                    <div className="md:col-span-3 space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{t('observations')}</label>
                                        <textarea className="uidt-input w-full min-h-[100px] py-4 border-amber-100" value={formData.observations} onChange={e => handleInputChange('observations', e.target.value)} placeholder="Notes, remarques particulières, blocages éventuels..." />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Début</label>
                                        <input required type="date" className="uidt-input w-full" value={formData.start_date} onChange={e => handleInputChange('start_date', e.target.value)} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Fin</label>
                                        <input required type="date" className="uidt-input w-full" value={formData.end_date} onChange={e => handleInputChange('end_date', e.target.value)} />
                                    </div>

                                    {/* Section 6: File Upload Zone */}
                                    <div className="md:col-span-3 pt-6">
                                        <div 
                                            className={`relative border-4 border-dashed rounded-[2.5rem] p-12 transition-all flex flex-col items-center justify-center gap-6 group cursor-pointer ${selectedFile ? 'border-green-400 bg-green-50/30' : 'border-gray-100 bg-[#FBFBFB] hover:border-[#001D3D]/20 hover:bg-white'}`}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
                                            }}
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <input 
                                                ref={fileInputRef}
                                                type="file" 
                                                className="hidden" 
                                                accept=".pdf,.jpg,.png,.docx"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                            />
                                            
                                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${selectedFile ? 'bg-green-500 text-white shadow-green-200' : 'bg-[#001D3D] text-white shadow-[#001D3D]/20'}`}>
                                                <span className="material-symbols-outlined text-4xl">
                                                    {selectedFile ? 'task' : 'upload_file'}
                                                </span>
                                            </div>

                                            <div className="text-center">
                                                <h3 className="text-sm font-black text-[#001D3D] uppercase tracking-widest leading-loose">
                                                    {selectedFile ? selectedFile.name : 'DÉPOSER LES DOCUMENTS (PDF/SIGNÉS)'}
                                                </h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Cliquez ou glissez-déposez vos fichiers ici'}
                                                </p>
                                            </div>

                                            {selectedFile && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFile(null);
                                                    }}
                                                    className="absolute top-6 right-6 w-10 h-10 bg-white border border-gray-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-all shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-12 flex justify-end gap-6 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 text-[11px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all active:scale-95">{t('cancel')}</button>
                                    <button type="submit" className="px-16 py-5 bg-[#001D3D] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#002b5c] shadow-[0_20px_40px_rgba(0,29,61,0.2)] transition-all active:scale-95 flex items-center gap-4">
                                        <span className="material-symbols-outlined text-[18px]">verified</span>
                                        {editingId ? 'Mettre à jour le dossier' : 'Soumettre à la Direction'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .uidt-input {
                    background-color: #F8F9FA;
                    border: 2px solid #F1F3F5;
                    border-radius: 1.25rem;
                    padding: 1rem 1.5rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #001D3D;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .uidt-input:focus {
                    border-color: #001D3D20;
                    background-color: white;
                    box-shadow: 0 0 0 10px #001D3D05;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F8F9FA;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #001D3D10;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #001D3D20;
                }
            `}} />
        </div>
    );
};

export default Conventions;
