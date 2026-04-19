import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Simple Alert/Toast component for feedback
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={onClose}
            className={`fixed bottom-10 right-10 z-[110] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-all ${
                type === 'success' ? 'bg-[#001D3D] text-white' : 'bg-red-500 text-white'
            }`}
        >
            <span className="material-symbols-outlined text-2xl">{type === 'success' ? 'check_circle' : 'error'}</span>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{type === 'success' ? 'Succès' : 'Attention'}</span>
                <span className="text-xs font-bold uppercase tracking-wider leading-tight">{message}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="opacity-30 hover:opacity-100 transition-opacity ml-4">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </motion.div>
    );
};

const Conventions = () => {
    const [conventions, setConventions] = useState([]);
    const { searchQuery, setSearchQuery } = useSearch();
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ open: false, type: '', id: null, title: '' });
    const [toast, setToast] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('new') === 'true') {
            openModal();
        }
    }, [location]);

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
        valeur_reference: '',
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
        
        // Auto-calculate duration if start_date or end_date changes
        if (field === 'start_date' || field === 'end_date') {
            const startVal = field === 'start_date' ? value : formData.start_date;
            const endVal = field === 'end_date' ? value : formData.end_date;
            
            if (startVal && endVal) {
                const start = new Date(startVal);
                const end = new Date(endVal);
                
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    let years = end.getFullYear() - start.getFullYear();
                    let months = end.getMonth() - start.getMonth();
                    let days = end.getDate() - start.getDate();

                    if (days < 0) {
                        months -= 1;
                        const lastDayOfMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
                        days += lastDayOfMonth;
                    }
                    if (months < 0) {
                        years -= 1;
                        months += 12;
                    }

                    let duration = '';
                    if (years > 0) duration += `${years} an${years > 1 ? 's' : ''}`;
                    if (months > 0) duration += `${duration ? ' ' : ''}${months} mois`;
                    if (years === 0 && months === 0 && days >= 0) duration = `${days} jour${days > 1 ? 's' : ''}`;
                    
                    newFormData.duration = duration;
                }
            }
        }
        
        setFormData(newFormData);
    };


    const handleNext = () => {
        // Validation avant de passer à l'étape suivante
        if (currentStep === 1) {
            if (!formData.name || !formData.partners) {
                setToast({ message: 'Veuillez remplir le nom et le partenaire institutionnel.', type: 'error' });
                return;
            }
        } else if (currentStep === 2) {
            if (!formData.start_date || !formData.end_date) {
                setToast({ message: 'Veuillez renseigner les dates de début et de fin.', type: 'error' });
                return;
            }
        }
        
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const finalData = { ...formData };
        if (currentStep === 5) {
            finalData.status = 'soumis';
        }

        const payload = new FormData();
        Object.keys(finalData).forEach(key => {
            if (finalData[key] !== null && finalData[key] !== undefined && finalData[key] !== '') {
                payload.append(key, finalData[key]);
            }
        });
        
        if (selectedFile) {
            payload.append('file', selectedFile);
        }

        setLoading(true);
        try {
            let res;
            if (editingId) {
                // Laravel workaround: use POST with _method=PUT for FormData with files
                payload.append('_method', 'PUT');
                res = await api.post(`/conventions/${editingId}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                res = await api.post('/conventions', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setToast({ message: editingId ? 'Projet mis à jour avec succès' : 'Projet soumis avec succès', type: 'success' });
            setIsModalOpen(false);
            setSelectedFile(null);
            
            // Refresh list without automatic redirection
            fetchConventions();
        } catch (err) {
            console.error("Erreur de soumission:", err.response?.data || err.message);
            const errorMsg = err.response?.data?.message || 'Erreur technique. Veuillez vérifier vos accès et les données saisies.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setConfirmConfig({
            open: true,
            type: 'delete',
            id: id,
            title: 'Suppression Définitive',
            message: 'Attention : Cette action est irréversible. Toutes les données liées à cette convention seront perdues.'
        });
    };

    const handleArchive = (id) => {
        setConfirmConfig({
            open: true,
            type: 'archive',
            id: id,
            title: 'Archivage du Dossier',
            message: 'Ce projet sera déplacé vers la section Archives. Il ne sera plus visible dans la liste active mais pourra être restauré.'
        });
    };

    const executeConfirmedAction = async () => {
        const { type, id } = confirmConfig;
        setConfirmConfig({ ...confirmConfig, open: false });
        
        try {
            if (type === 'delete') {
                await api.delete(`/conventions/${id}`);
                setToast({ message: 'Projet supprimé avec succès', type: 'success' });
            } else if (type === 'archive') {
                await api.put(`/conventions/${id}`, { status: 'archive' });
                setToast({ message: 'Projet déplacé vers les archives', type: 'success' });
            }
            fetchConventions();
        } catch (err) {
            setToast({ message: 'Une erreur est survenue', type: 'error' });
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
        setCurrentStep(1);
        setIsModalOpen(true);
    };

    const filteredConventions = conventions.filter(c => 
        c.status !== 'archive'
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
                    <p className="text-sm font-bold text-slate-600 mt-1 uppercase tracking-wider">{t('institutional_sub')} • Répertoire des Projets</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => fetchConventions()} className="p-4 bg-white border border-gray-100 rounded-2xl text-[#001D3D] hover:bg-gray-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px] block">refresh</span>
                    </button>
                    {(user?.role?.name === 'porteur_projet' || user?.role?.name === 'admin') && (
                        <button onClick={() => openModal()} className="px-8 py-4 bg-[#001D3D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#002b5c] transition-all shadow-[0_20px_40px_rgba(0,29,61,0.15)] flex items-center gap-3 active:scale-95">
                            {t('nouvelle_convention')}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Card with Horizontal Scroll */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50 bg-[#FBFBFB]/50 flex items-center justify-between">
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#001D3D] transition-colors text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder={t('search')} 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-100 text-[#001D3D] rounded-2xl pl-14 pr-6 py-4 text-xs font-bold placeholder:text-slate-500 focus:outline-none focus:ring-8 focus:ring-[#001D3D]/5 focus:border-[#001D3D]/10 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {filteredConventions.length} Projets Identifiés
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse table-fixed min-w-[2000px]">
                        <thead>
                            <tr className="bg-[#F1F3F5]/30 text-[11px] text-slate-600 uppercase font-black tracking-widest border-b border-gray-100">
                                <th className="px-8 py-6 w-40">{t('num_dossier')}</th>
                                <th className="px-8 py-6 w-80">{t('project_title_short')}</th>
                                <th className="px-8 py-6 w-32">{t('cooperation_type')}</th>
                                <th className="px-8 py-6 w-48">{t('status_label')}</th>
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
                                            <td className="px-8 py-7 text-[11px] font-black text-[#001D3D] bg-[#001D3D]/5 border-r border-gray-50">{conv.num_dossier || conv.id}</td>
                                            <td className="px-8 py-7">
                                                <Link to={`/conventions/${conv.id}`} className="font-black text-[#001D3D] tracking-tight group-hover:text-[#8B7355] transition-colors line-clamp-1 text-sm block">
                                                    {conv.name}
                                                </Link>
                                            </td>
                                            <td className="px-8 py-7">
                                                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                     conv.type === 'international' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
                                                     conv.type === 'national' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                     'bg-teal-50 text-teal-600 border border-teal-100'
                                                 }`}>
                                                     {conv.type === 'national' ? 'Nationale' : conv.type === 'international' ? 'Internationale' : 'Régionale'}
                                                 </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm transition-all ${
                                                    conv.status === 'termine' ? 'bg-green-50 text-green-600 border-green-100 shadow-green-100/50' :
                                                    conv.status === 'soumis' || conv.status === 'en attente' ? 'bg-amber-50 text-amber-500 border-amber-100 shadow-amber-100/50' : 
                                                    conv.status === 'valide_dir_initial' ? 'bg-purple-50 text-purple-600 border-purple-100 shadow-purple-100/50' :
                                                    conv.status === 'valide_juridique' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/50' :
                                                    conv.status === 'pret_pour_signature' || conv.status === 'en cours' ? 'bg-blue-50 text-blue-500 border-blue-100 shadow-blue-100/50' : 
                                                    'bg-gray-50 text-slate-600 border-gray-100'
                                                }`}>
                                                    {conv.status === 'termine' ? 'SIGNÉ / ACTIF' : 
                                                     conv.status === 'soumis' || conv.status === 'en attente' ? 'En Attente Direction' :
                                                     conv.status === 'valide_dir_initial' ? 'Visé / Attente Juridique' :
                                                     conv.status === 'valide_juridique' ? 'Visa Juridique Accordé' :
                                                     conv.status === 'pret_pour_signature' || conv.status === 'en cours' ? 'Validé / Signature' : 
                                                     (conv.status || 'Brouillon').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7 text-xs font-bold text-gray-500">{conv.partner_type || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-[#001D3D] uppercase tracking-tighter">{conv.partners || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-bold text-slate-600">{conv.year || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-medium text-slate-600 line-clamp-1">{conv.objectives || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-bold text-[#8B7355]">{conv.duration || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-[#001D3D] opacity-70 italic">{conv.indicator || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-slate-500">{conv.target || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-black text-[#001D3D]">{conv.actual_value || '-'}</td>
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                                                        <div className="h-full bg-[#001D3D]" style={{ width: `${Math.min(conv.completion_rate || 0, 100)}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-[#001D3D]">{conv.completion_rate || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7 text-xs font-medium text-slate-600 italic line-clamp-1">{conv.observations || '-'}</td>
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
                                                 {(user?.role?.name === 'porteur_projet' || user?.role?.name === 'admin') && (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => openModal(conv)} title="Modifier" className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-600 hover:text-[#001D3D] hover:shadow-lg hover:shadow-[#001D3D]/10 rounded-xl transition-all">
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleArchive(conv.id)} 
                                                            title="Archiver"
                                                            className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-600 hover:text-amber-600 hover:shadow-lg rounded-xl transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">archive</span>
                                                        </button>
                                                        <button onClick={() => handleDelete(conv.id)} title="Supprimer" className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-slate-600 hover:text-red-500 hover:shadow-lg hover:shadow-red-500/10 rounded-xl transition-all">
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </div>
                                                 )}
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
                            className="absolute inset-0 bg-[#001D3D]/20 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative z-[110] w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden"
                        >
                            {/* Modal Header with Stepper */}
                            <div className="p-10 border-b border-gray-50 bg-[#FBFBFB]">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#001D3D] tracking-tight uppercase">
                                            {editingId ? 'MISE À JOUR REGISTRE' : 'NOUVELLE ACCRÉDITATION'}
                                        </h2>
                                        <p className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.3em] mt-1">Étape {currentStep} sur 5</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-slate-500 border border-gray-100 shadow-sm">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                {/* Stepper Visual */}
                                <div className="flex items-center justify-between px-10 relative">
                                    <div className="absolute top-1/2 left-20 right-20 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
                                    <div 
                                        className="absolute top-1/2 left-20 h-0.5 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                                        style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                                    ></div>

                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${
                                                currentStep > step ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 
                                                currentStep === step ? 'bg-[#001D3D] text-white shadow-lg' : 
                                                'bg-white border-2 border-gray-100 text-slate-500'
                                            }`}>
                                                {currentStep > step ? <span className="material-symbols-outlined text-sm">check</span> : step}
                                            </div>
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${currentStep >= step ? (currentStep > step ? 'text-green-600' : 'text-[#001D3D]') : 'text-slate-500'}`}>
                                                {step === 1 ? 'Identité' : step === 2 ? 'Planification' : step === 3 ? 'Performance' : step === 4 ? 'Dépôt de dossier' : 'Validation'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="p-12 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar bg-white">
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8B7355] ml-1">{t('project_title_short')}</label>
                                                <input required type="text" className="uidt-input w-full" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Nom de la convention..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8B7355] ml-1">{t('cooperation_type')}</label>
                                                <select className="uidt-input w-full appearance-none cursor-pointer" value={formData.type} onChange={e => handleInputChange('type', e.target.value)}>
                                                    <option value="national">Nationale</option>
                                                    <option value="international">Internationale</option>
                                                    <option value="regional">Régionale</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('partner_type')}</label>
                                                <input 
                                                    list="partner_types" 
                                                    type="text" 
                                                    className="uidt-input w-full" 
                                                    value={formData.partner_type} 
                                                    onChange={e => handleInputChange('partner_type', e.target.value)} 
                                                    placeholder="Banque, ONG, Université..." 
                                                />
                                                <datalist id="partner_types">
                                                    <option value="Banque" />
                                                    <option value="Organisation" />
                                                    <option value="Centre de recherche" />
                                                    <option value="Administration/Urbanis" />
                                                </datalist>
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('partner_institution')}</label>
                                                <input type="text" className="uidt-input w-full" value={formData.partners} onChange={e => handleInputChange('partners', e.target.value)} placeholder="Signataires partenaires..." />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('year')}</label>
                                                <input type="number" className="uidt-input w-full" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('duration')}</label>
                                                <input readOnly type="text" className="uidt-input w-full bg-slate-50 font-bold text-[#001D3D]" value={formData.duration} placeholder="Calculé selon les dates..." />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('institutional_objectives')}</label>
                                                <textarea className="uidt-input w-full min-h-[100px] py-4" value={formData.objectives} onChange={e => handleInputChange('objectives', e.target.value)} placeholder="Description synthétique..." />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('observations')}</label>
                                                <textarea className="uidt-input w-full min-h-[80px] py-4 border-amber-100" value={formData.observations} onChange={e => handleInputChange('observations', e.target.value)} placeholder="Remarques..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8B7355] ml-1">Date de Début</label>
                                                <input required type="date" className="uidt-input w-full" value={formData.start_date} onChange={e => handleInputChange('start_date', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#8B7355] ml-1">Date de Fin</label>
                                                <input required type="date" className="uidt-input w-full" value={formData.end_date} onChange={e => handleInputChange('end_date', e.target.value)} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="md:col-span-3 space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('indicator_performance')}</label>
                                                <input type="text" className="uidt-input w-full" value={formData.indicator} onChange={e => handleInputChange('indicator', e.target.value)} placeholder="Nom de l'indicateur..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Valeur de Référence</label>
                                                <input type="number" className="uidt-input w-full" value={formData.valeur_reference} onChange={e => handleInputChange('valeur_reference', e.target.value)} placeholder="0.00" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('target')}</label>
                                                <input type="number" className="uidt-input w-full" value={formData.target} onChange={e => handleInputChange('target', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('actual_value')}</label>
                                                <input type="number" className="uidt-input w-full font-black text-[#001D3D]" value={formData.actual_value} onChange={e => handleInputChange('actual_value', e.target.value)} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-6 group cursor-pointer hover:bg-white hover:border-[#001D3D]/20 transition-all" onClick={() => fileInputRef.current.click()}>
                                            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${selectedFile ? 'bg-green-500 text-white shadow-green-200' : 'bg-[#001D3D] text-white shadow-[#001D3D]/20'}`}>
                                                <span className="material-symbols-outlined text-4xl">{selectedFile ? 'task' : 'upload_file'}</span>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-sm font-black text-[#001D3D] uppercase tracking-widest">{selectedFile ? selectedFile.name : 'DÉPOSER LE DOCUMENT (FACULTATIF)'}</h3>
                                                <p className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Formats acceptés : PDF, JPG, PNG (Max 10Mo)</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 5 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="bg-blue-50/50 p-10 rounded-[2.5rem] border border-blue-100/50">
                                            <div className="flex items-start gap-5">
                                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                                                    <span className="material-symbols-outlined">info</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-[#001D3D] uppercase tracking-widest mb-2">Récapitulatif de soumission</h4>
                                                    <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-wider">En soumettant ce dossier, il sera transmis à la Direction de la Coopération pour instruction. Vous pourrez suivre l'avancement dans votre tableau de bord.</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {selectedFile && (
                                            <div className="flex items-center gap-4 p-6 bg-green-50 rounded-3xl border border-green-100">
                                                <span className="material-symbols-outlined text-green-500">attach_file</span>
                                                <span className="text-xs font-black text-[#001D3D] uppercase tracking-widest">{selectedFile.name}</span>
                                                <span className="text-[10px] font-bold text-green-600 ml-auto uppercase tracking-widest">Prêt pour envoi</span>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Modal Footer with Navigation */}
                                <div className="pt-10 flex justify-between items-center border-t border-gray-50">
                                    <button 
                                        type="button" 
                                        onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsModalOpen(false)}
                                        className="px-8 py-4 text-[10px] font-black text-slate-600 hover:text-[#001D3D] uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        {currentStep === 1 ? 'Annuler' : 'Précédent'}
                                    </button>
                                    
                                    <div className="flex gap-4">
                                        {currentStep < 5 ? (
                                            <button 
                                                type="button" 
                                                onClick={handleNext}
                                                className="px-12 py-5 bg-[#001D3D] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#001D3D]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                            >
                                                {currentStep === 4 ? 'Passer à la Validation Finale' : currentStep === 3 ? 'Dernière Étape' : 'Étape Suivante'}
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </button>
                                        ) : (
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className={`px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl transition-all flex items-center gap-3 ${
                                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white shadow-green-600/20 hover:scale-105 active:scale-95'
                                                }`}
                                            >
                                                {loading ? 'Envoi en cours...' : 'Finaliser et Soumettre'}
                                                <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>
                                                    {loading ? 'progress_activity' : 'verified'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
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

            {/* Premium Confirmation Modal */}
            <AnimatePresence>
                {confirmConfig.open && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmConfig({ ...confirmConfig, open: false })}
                            className="absolute inset-0 bg-[#001D3D]/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-8 text-center"
                        >
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                                confirmConfig.type === 'delete' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                            }`}>
                                <span className="material-symbols-outlined text-4xl">
                                    {confirmConfig.type === 'delete' ? 'delete_forever' : 'archive'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-[#001D3D] mb-2 uppercase tracking-tight">{confirmConfig.title}</h3>
                            <p className="text-xs font-bold text-slate-600 leading-relaxed mb-8">{confirmConfig.message}</p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setConfirmConfig({ ...confirmConfig, open: false })}
                                    className="flex-1 px-6 py-4 bg-gray-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={executeConfirmedAction}
                                    className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${
                                        confirmConfig.type === 'delete' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                                    }`}
                                >
                                    Confirmer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {toast && (
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Conventions;

