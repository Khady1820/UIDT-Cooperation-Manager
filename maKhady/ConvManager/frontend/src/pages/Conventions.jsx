import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Simple Alert/Toast component for feedback
// Enhanced Toast component with countdown and Undo action
const Toast = ({ message, type, onClose, onUndo, duration = 5000 }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 100) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 100;
            });
        }, 100);

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onClose, duration]);

    // Progress circle calculations
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (timeLeft / duration) * circumference;

    return (
        <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            className={`fixed bottom-10 right-10 z-[150] px-6 py-4 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-white/10 backdrop-blur-md ${
                type === 'success' ? 'bg-[#2E2F7F] text-white' : 
                type === 'warning' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
            }`}
        >
            {/* Feedback Icon or Circular Countdown */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                {type === 'error' ? (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">error</span>
                    </div>
                ) : type === 'success' ? (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">check_circle</span>
                    </div>
                ) : (
                    <>
                        <svg className="w-10 h-10 transform -rotate-90">
                            <circle 
                                cx="20" cy="20" r={radius} 
                                stroke="currentColor" strokeWidth="2.5" 
                                fill="transparent" className="opacity-20" 
                            />
                            <motion.circle 
                                cx="20" cy="20" r={radius} 
                                stroke="currentColor" strokeWidth="2.5" 
                                fill="transparent" 
                                strokeDasharray={circumference}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 0.1, ease: "linear" }}
                                strokeLinecap="round" 
                            />
                        </svg>
                        <span className="absolute text-[10px] font-black">{Math.ceil(timeLeft / 1000)}s</span>
                    </>
                )}
            </div>

            <div className="flex flex-col min-w-[150px]">
                <span className="text-sm font-black uppercase tracking-widest opacity-60">
                    {type === 'success' ? 'Succès' : type === 'warning' ? 'Attention' : 'Erreur'}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider leading-tight">{message}</span>
            </div>

            {onUndo && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onUndo(); }}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-black tracking-widest transition-all hover:scale-105 active:scale-95"
                >
                    ANNULER
                </button>
            )}

            {!onUndo && (
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="opacity-40 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            )}
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

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

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
        valeur_reference: 100,
        target: 100,
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
        let finalValue = value;
        
        // Ensure percentage fields do not exceed 100
        if (['valeur_reference', 'target', 'actual_value'].includes(field)) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                if (numValue > 100) finalValue = 100;
                if (numValue < 0) finalValue = 0;
            }
        }

        const newFormData = { ...formData, [field]: finalValue };
        
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
        } else if (currentStep === 4) {
            if (!selectedFile && !formData.file_path) {
                setToast({ message: 'Le dépôt du document (PDF/Image) est obligatoire.', type: 'error' });
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
            
            // Redirect project lead to the tracking page (Validation) after submission
            if (user?.role?.name === 'porteur_projet') {
                setTimeout(() => {
                    navigate('/validation');
                }, 2000);
            } else {
                fetchConventions();
            }
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

    const pendingDeleteRef = useRef(null);

    const executeConfirmedAction = async () => {
        const { type, id } = confirmConfig;
        setConfirmConfig({ ...confirmConfig, open: false });
        
        if (type === 'delete') {
            // Store original list for potential undo
            const originalList = [...conventions];
            
            // Optimistically update UI
            setConventions(prev => prev.filter(c => c.id !== id));
            pendingDeleteRef.current = id;

            setToast({ 
                message: 'Dossier supprimé', 
                type: 'warning', 
                onUndo: () => {
                    pendingDeleteRef.current = null;
                    setConventions(originalList);
                    setToast(null);
                },
                onClose: async () => {
                    // Only delete if undo wasn't clicked
                    if (pendingDeleteRef.current === id) {
                        try {
                            await api.delete(`/conventions/${id}`);
                            pendingDeleteRef.current = null;
                        } catch (err) {
                            // Restore if server delete fails
                            setConventions(originalList);
                            setToast({ message: 'Erreur lors de la suppression réelle', type: 'error' });
                        }
                    }
                }
            });
        } else if (type === 'archive') {
            try {
                await api.put(`/conventions/${id}`, { status: 'archive' });
                setToast({ message: 'Projet déplacé vers les archives', type: 'success' });
                fetchConventions();
            } catch (err) {
                setToast({ message: 'Une erreur est survenue lors de l\'archivage', type: 'error' });
            }
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
    ).sort((a, b) => {
        const valA = String(a.num_dossier || a.id);
        const valB = String(b.num_dossier || b.id);
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
    });

    const totalPages = Math.ceil(filteredConventions.length / itemsPerPage);
    const paginatedConventions = filteredConventions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleExport = () => {
        if (conventions.length === 0) return;
        
        // CSV Header
        const headers = ["Nom", "Type", "Partenaires", "Statut", "Date Debut", "Date Fin", "Taux de Realisation (%)"];
        
        // CSV Rows (replacing accents for CSV compatibility)
        const rows = conventions.map(c => [
            c.name.replace(/,/g, " "),
            c.type,
            (c.partners || "").replace(/,/g, " "),
            c.status,
            c.start_date,
            c.end_date,
            c.completion_rate ? parseFloat(c.completion_rate).toFixed(1) : "0"
        ]);
        
        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `conventions_uidt_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 mb-2">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-150 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[#2E2F7F] dark:text-white group-hover:scale-110 transition-transform duration-150 text-sm">arrow_back</span>
                            <span className="text-[9px] font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest">Retour</span>
                        </button>
                        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                        <h1 className="text-xl font-black text-[#2E2F7F] dark:text-white tracking-tight uppercase tracking-widest">{t('conventions')}</h1>
                    </div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">{t('institutional_sub')} • Répertoire des Projets</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleExport}
                        className="px-6 py-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-[#2E2F7F] dark:text-white text-sm font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2"
                        title="Exporter en CSV"
                    >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Exporter
                    </button>
                    <button onClick={() => fetchConventions()} className="p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-[#2E2F7F] dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px] block">refresh</span>
                    </button>
                    {user?.role?.name === 'porteur_projet' && (
                        <button onClick={() => openModal()} className="px-8 py-4 bg-[#2E2F7F] text-white rounded-2xl text-base font-black uppercase tracking-widest hover:bg-[#002b5c] transition-all shadow-[0_20px_40px_rgba(0,29,61,0.15)] flex items-center gap-3 active:scale-95">
                            {t('nouvelle_convention')}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Card with Horizontal Scroll */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="p-10 border-b border-gray-50 dark:border-slate-800 bg-[#FBFBFB]/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#2E2F7F] dark:group-focus-within:text-white transition-colors text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder={t('search')} 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-slate-700 text-[#2E2F7F] dark:text-white rounded-2xl pl-14 pr-6 py-4 text-base font-bold placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:ring-8 focus:ring-[#2E2F7F]/5 focus:border-[#2E2F7F]/10 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-full border border-gray-100 dark:border-white/10">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {filteredConventions.length} Projets Identifiés
                    </div>
                </div>

                <div className="max-h-[650px] overflow-y-auto custom-scrollbar relative">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA]/50 dark:bg-slate-800 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700">
                            <tr className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                                <th className="px-4 py-6 text-left w-40 whitespace-nowrap">N° DOSSIER</th>
                                <th className="px-4 py-6 text-left">TITRE DU PROJET / CONVENTION</th>
                                <th className="px-4 py-6 text-left">TYPE DE COOPÉRATION</th>
                                <th className="px-4 py-6 text-left">INSTITUTION PARTENAIRE</th>
                                <th className="px-4 py-6 text-left whitespace-nowrap">ANNÉE</th>
                                <th className="px-4 py-6 text-left whitespace-nowrap">STATUT FINAL</th>
                                <th className="px-4 py-6 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-32 text-center bg-white dark:bg-slate-900">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
                                            <p className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest opacity-40">Synchronisation des bases de données...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredConventions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-32 text-center bg-white dark:bg-slate-900">
                                        <div className="flex flex-col items-center gap-6 opacity-20 grayscale dark:invert">
                                            <span className="material-symbols-outlined text-7xl text-slate-600 dark:text-slate-400">inventory_2</span>
                                            <p className="text-base font-black uppercase tracking-widest text-slate-900 dark:text-white">Aucune convention institutionnelle enregistrée</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedConventions.map((conv) => (
                                    <tr 
                                        key={conv.id} 
                                        onClick={() => navigate(`/conventions/${conv.id}/summary`)}
                                        className="hover:bg-white dark:hover:bg-white/5 transition-all duration-150 group cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative z-10"
                                    >
                                        <td className="px-4 py-4 text-[11px] font-black text-[#2E2F7F] dark:text-indigo-300 bg-[#2E2F7F]/5 dark:bg-indigo-900/20 border-r border-gray-50 dark:border-slate-800 whitespace-nowrap">{conv.num_dossier || conv.id}</td>
                                        <td className="px-4 py-4">
                                            <Link to={`/conventions/${conv.id}/summary`} className="font-black text-[#2E2F7F] dark:text-white tracking-tight group-hover:text-[#F7931E] transition-colors line-clamp-1 text-xs block uppercase">
                                                {conv.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4">
                                             <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                 conv.type === 'international' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900' : 
                                                 conv.type === 'national' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900' :
                                                 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900'
                                             }`}>
                                                 {conv.type === 'national' ? 'National' : conv.type === 'international' ? 'International' : 'Régional'}
                                             </span>
                                        </td>
                                        <td className="px-4 py-4 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                            <div className="line-clamp-1">{conv.partners || '-'}</div>
                                        </td>
                                        <td className="px-4 py-4 text-[11px] font-black text-slate-500 dark:text-slate-500 whitespace-nowrap">
                                            {conv.year || new Date(conv.created_at).getFullYear()}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all whitespace-nowrap ${
                                                conv.status === 'termine' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900 shadow-green-100/50' :
                                                conv.status === 'soumis' || conv.status === 'en attente' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 border-amber-100 dark:border-amber-900 shadow-amber-100/50' : 
                                                conv.status === 'valide_dir_initial' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900 shadow-purple-100/50' :
                                                conv.status === 'valide_juridique' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900 shadow-indigo-100/50' :
                                                conv.status === 'pret_pour_signature' || conv.status === 'en cours' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-900 shadow-blue-100/50' : 
                                                'bg-gray-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-gray-100 dark:border-slate-800'
                                            }`}>
                                                {conv.status === 'termine' ? 'SIGNÉE & ARCHIVÉE' : 
                                                 conv.status === 'soumis' || conv.status === 'en attente' ? 'En Attente Direction' :
                                                 conv.status === 'valide_dir_initial' ? 'Visé / Attente Juridique' :
                                                 conv.status === 'valide_juridique' ? 'Visa Juridique Accordé' :
                                                 conv.status === 'pret_pour_signature' || conv.status === 'en cours' ? 'Validé / Signature' : 
                                                 (conv.status || 'Brouillon').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link 
                                                    to={`/conventions/${conv.id}/summary`} 
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Voir les détails"
                                                    className="w-8 h-8 flex items-center justify-center bg-[#2E2F7F] text-white rounded-lg hover:bg-[#F7931E] transition-all shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                </Link>
                                                {(user?.role?.name === 'porteur_projet' || user?.role?.name === 'admin') && (
                                                    <div className="flex items-center gap-1.5 ml-1.5 border-l border-gray-100 dark:border-slate-800 pl-1.5">
                                                        <button onClick={(e) => { e.stopPropagation(); openModal(conv); }} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#2E2F7F] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-all">
                                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="p-8 border-t border-gray-50 dark:border-slate-800 bg-[#FBFBFB]/50 dark:bg-slate-900/50 flex items-center justify-between">
                        <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            Page {currentPage} sur {totalPages} • {filteredConventions.length} Dossiers au total
                        </p>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2E2F7F] disabled:opacity-20 hover:gap-3 transition-all"
                            >
                                <span className="material-symbols-outlined text-base">chevron_left</span>
                                Précédent
                            </button>
                            <div className="flex gap-1.5 px-4 border-x border-gray-100">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                                            currentPage === i + 1 
                                            ? 'bg-[#2E2F7F] text-white shadow-lg' 
                                            : 'text-slate-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#2E2F7F] disabled:opacity-20 hover:gap-3 transition-all"
                            >
                                Suivant
                                <span className="material-symbols-outlined text-base">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form Overhaul */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#2E2F7F]/20 backdrop-blur-sm"
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
                                        <h2 className="text-2xl font-black text-[#2E2F7F] tracking-tight uppercase">
                                            {editingId ? 'MISE À JOUR REGISTRE' : 'NOUVELLE ACCRÉDITATION'}
                                        </h2>
                                        <p className="text-sm font-black text-[#F7931E] uppercase tracking-[0.3em] mt-1">Étape {currentStep} sur 5</p>
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
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-all duration-500 ${
                                                currentStep > step ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 
                                                currentStep === step ? 'bg-[#2E2F7F] text-white shadow-lg' : 
                                                'bg-white border-2 border-gray-100 text-slate-500'
                                            }`}>
                                                {currentStep > step ? <span className="material-symbols-outlined text-base">check</span> : step}
                                            </div>
                                            <span className={`text-sm font-black uppercase tracking-widest ${currentStep >= step ? (currentStep > step ? 'text-green-600' : 'text-[#2E2F7F]') : 'text-slate-500'}`}>
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
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-[#F7931E] ml-1">{t('project_title_short')}</label>
                                                <input required type="text" className="uidt-input w-full" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Nom de la convention..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-[#F7931E] ml-1">{t('cooperation_type')}</label>
                                                <select className="uidt-input w-full appearance-none cursor-pointer" value={formData.type} onChange={e => handleInputChange('type', e.target.value)}>
                                                    <option value="national">Nationale</option>
                                                    <option value="international">Internationale</option>
                                                    <option value="regional">Régionale</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('partner_type')}</label>
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
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('partner_institution')}</label>
                                                <input type="text" className="uidt-input w-full" value={formData.partners} onChange={e => handleInputChange('partners', e.target.value)} placeholder="Signataires partenaires..." />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('year')}</label>
                                                <input type="number" className="uidt-input w-full" value={formData.year} onChange={e => handleInputChange('year', e.target.value)} />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('institutional_objectives')}</label>
                                                <textarea className="uidt-input w-full min-h-[100px] py-4" value={formData.objectives} onChange={e => handleInputChange('objectives', e.target.value)} placeholder="Description synthétique..." />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('observations')}</label>
                                                <textarea className="uidt-input w-full min-h-[80px] py-4 border-amber-100" value={formData.observations} onChange={e => handleInputChange('observations', e.target.value)} placeholder="Remarques..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-[#F7931E] ml-1">Date de Début</label>
                                                <input required type="date" className="uidt-input w-full" value={formData.start_date} onChange={e => handleInputChange('start_date', e.target.value)} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-[#F7931E] ml-1">Date de Fin</label>
                                                <input required type="date" className="uidt-input w-full" value={formData.end_date} onChange={e => handleInputChange('end_date', e.target.value)} />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('duration')}</label>
                                                <input readOnly type="text" className="uidt-input w-full bg-slate-50 font-bold text-[#2E2F7F]" value={formData.duration} placeholder="Calculé selon les dates..." />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="md:col-span-3 space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('indicator_performance')}</label>
                                                <input type="text" className="uidt-input w-full" value={formData.indicator} onChange={e => handleInputChange('indicator', e.target.value)} placeholder="Nom de l'indicateur..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Valeur de Référence</label>
                                                <div className="uidt-input w-full flex items-center justify-between group focus-within:border-[#2E2F7F40] focus-within:bg-white focus-within:shadow-[0_0_0_10px_#2E2F7F05] transition-all duration-75 relative">
                                                    <div className="flex items-center">
                                                        <input type="number" min="0" max="100" className="bg-transparent border-none outline-none p-0 w-7 text-left font-bold text-[#2E2F7F] hide-spinner" value={formData.valeur_reference} onChange={e => handleInputChange('valeur_reference', e.target.value)} placeholder="100" />
                                                        <span className={`transition-all duration-300 font-bold ${formData.valeur_reference ? 'text-[#2E2F7F] opacity-100' : 'text-[#2E2F7F] opacity-40'}`}>%</span>
                                                    </div>
                                                    <div className="flex flex-col border-l border-gray-100 pl-3 gap-0 transition-all duration-75">
                                                        <button type="button" onClick={() => handleInputChange('valeur_reference', Math.min(100, (parseInt(formData.valeur_reference) || 0) + 1))} className="text-[#2E2F7F] hover:bg-slate-50 active:scale-95 flex items-center justify-center h-4 w-6 rounded transition-all duration-75">
                                                            <span className="material-symbols-outlined text-[14px] font-black">arrow_drop_up</span>
                                                        </button>
                                                        <button type="button" onClick={() => handleInputChange('valeur_reference', Math.max(0, (parseInt(formData.valeur_reference) || 0) - 1))} className="text-[#2E2F7F] hover:bg-slate-50 active:scale-95 flex items-center justify-center h-4 w-6 rounded transition-all duration-75">
                                                            <span className="material-symbols-outlined text-[14px] font-black">arrow_drop_down</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('target')}</label>
                                                <div className="uidt-input w-full flex items-center justify-between group focus-within:border-[#2E2F7F40] focus-within:bg-white focus-within:shadow-[0_0_0_10px_#2E2F7F05] transition-all duration-75 relative">
                                                    <div className="flex items-center">
                                                        <input type="number" min="0" max="100" className="bg-transparent border-none outline-none p-0 w-7 text-left font-bold text-[#2E2F7F] hide-spinner" value={formData.target} onChange={e => handleInputChange('target', e.target.value)} placeholder="100" />
                                                        <span className={`transition-all duration-300 font-bold ${formData.target ? 'text-[#2E2F7F] opacity-100' : 'text-[#2E2F7F] opacity-40'}`}>%</span>
                                                    </div>
                                                    <div className="flex flex-col border-l border-gray-100 pl-3 gap-0 transition-all duration-75">
                                                        <button type="button" onClick={() => handleInputChange('target', Math.min(100, (parseInt(formData.target) || 0) + 1))} className="text-[#2E2F7F] hover:bg-slate-50 active:scale-95 flex items-center justify-center h-4 w-6 rounded transition-all duration-75">
                                                            <span className="material-symbols-outlined text-[14px] font-black">arrow_drop_up</span>
                                                        </button>
                                                        <button type="button" onClick={() => handleInputChange('target', Math.max(0, (parseInt(formData.target) || 0) - 1))} className="text-[#2E2F7F] hover:bg-slate-50 active:scale-95 flex items-center justify-center h-4 w-6 rounded transition-all duration-75">
                                                            <span className="material-symbols-outlined text-[14px] font-black">arrow_drop_down</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {['signe_recteur', 'termine'].includes(formData.status) && (
                                                <div className="space-y-3">
                                                    <label className="block text-sm font-black uppercase tracking-[0.2em] text-slate-600 ml-1">{t('actual_value')}</label>
                                                    <div className="uidt-input w-full flex items-center justify-between group focus-within:border-[#2E2F7F40] focus-within:bg-white focus-within:shadow-[0_0_0_10px_#2E2F7F05] transition-all duration-75 relative">
                                                        <div className="flex items-center">
                                                            <input type="number" min="0" max="100" className="bg-transparent border-none outline-none p-0 w-7 text-left font-black text-[#2E2F7F] hide-spinner" value={formData.actual_value} onChange={e => handleInputChange('actual_value', e.target.value)} placeholder="100" />
                                                            <span className={`transition-all duration-300 font-bold ${formData.actual_value ? 'text-[#2E2F7F] opacity-100' : 'text-[#2E2F7F] opacity-40'}`}>%</span>
                                                        </div>
                                                        <div className="flex flex-col border-l border-gray-100 pl-3 gap-0 transition-all duration-75">
                                                            <button type="button" onClick={() => handleInputChange('actual_value', Math.min(100, (parseInt(formData.actual_value) || 0) + 1))} className="text-[#2E2F7F] hover:bg-slate-50 active:scale-95 flex items-center justify-center h-4 w-6 rounded transition-all duration-75">
                                                                <span className="material-symbols-outlined text-[14px] font-black">arrow_drop_up</span>
                                                            </button>
                                                            <button type="button" onClick={() => handleInputChange('actual_value', Math.max(0, (parseInt(formData.actual_value) || 0) - 1))} className="text-[#2E2F7F] hover:bg-slate-50 active:scale-95 flex items-center justify-center h-4 w-6 rounded transition-all duration-75">
                                                                <span className="material-symbols-outlined text-[14px] font-black">arrow_drop_down</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-6 group cursor-pointer hover:bg-white hover:border-[#2E2F7F]/20 transition-all" onClick={() => fileInputRef.current.click()}>
                                            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} accept=".doc,.docx" />
                                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${selectedFile ? 'bg-green-500 text-white shadow-green-200' : 'bg-[#2E2F7F] text-white shadow-[#2E2F7F]/20'}`}>
                                                <span className="material-symbols-outlined text-4xl">{selectedFile ? 'task' : 'upload_file'}</span>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-base font-black text-[#2E2F7F] uppercase tracking-widest">{selectedFile ? selectedFile.name : 'DÉPOSER LE DOCUMENT (OBLIGATOIRE)'}</h3>
                                                <p className="text-sm font-bold text-slate-600 mt-2 uppercase tracking-widest">Format Word (.doc, .docx) uniquement (Max 10Mo)</p>
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
                                                    <h4 className="text-base font-black text-[#2E2F7F] uppercase tracking-widest mb-2">Récapitulatif de soumission</h4>
                                                    <p className="text-sm font-bold text-slate-600 leading-relaxed uppercase tracking-wider">En soumettant ce dossier, il sera transmis à la Direction de la Coopération pour instruction. Vous pourrez suivre l'avancement dans votre tableau de bord.</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {selectedFile && (
                                            <div className="flex items-center gap-4 p-6 bg-green-50 rounded-3xl border border-green-100">
                                                <span className="material-symbols-outlined text-green-500">attach_file</span>
                                                <span className="text-base font-black text-[#2E2F7F] uppercase tracking-widest">{selectedFile.name}</span>
                                                <span className="text-sm font-bold text-green-600 ml-auto uppercase tracking-widest">Prêt pour envoi</span>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Modal Footer with Navigation */}
                                <div className="pt-10 flex justify-between items-center border-t border-gray-50">
                                    <button 
                                        type="button" 
                                        onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsModalOpen(false)}
                                        className="px-8 py-4 text-sm font-black text-slate-600 hover:text-[#2E2F7F] uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-base">arrow_back</span>
                                        {currentStep === 1 ? 'Annuler' : 'Précédent'}
                                    </button>
                                    
                                    <div className="flex gap-4">
                                        {currentStep < 5 ? (
                                            <button 
                                                type="button" 
                                                onClick={handleNext}
                                                className="px-12 py-5 bg-[#2E2F7F] text-white rounded-2xl text-sm font-black uppercase tracking-[0.3em] shadow-xl shadow-[#2E2F7F]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                            >
                                                {currentStep === 4 ? 'Passer à la Validation Finale' : currentStep === 3 ? 'Dernière Étape' : 'Étape Suivante'}
                                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                                            </button>
                                        ) : (
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className={`px-12 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.3em] shadow-xl transition-all flex items-center gap-3 ${
                                                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white shadow-green-600/20 hover:scale-105 active:scale-95'
                                                }`}
                                            >
                                                {loading ? 'Envoi en cours...' : 'Finaliser et Soumettre'}
                                                <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>
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
                    color: #2E2F7F;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .uidt-input:focus {
                    border-color: #2E2F7F20;
                    background-color: white;
                    box-shadow: 0 0 0 10px #2E2F7F05;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F8F9FA;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #2E2F7F10;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #2E2F7F20;
                }
                .hide-spinner::-webkit-outer-spin-button,
                .hide-spinner::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .hide-spinner {
                    -moz-appearance: textfield;
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
                            className="absolute inset-0 bg-[#2E2F7F]/40 backdrop-blur-md"
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
                            <h3 className="text-xl font-black text-[#2E2F7F] mb-2 uppercase tracking-tight">{confirmConfig.title}</h3>
                            <p className="text-base font-bold text-slate-600 leading-relaxed mb-8">{confirmConfig.message}</p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setConfirmConfig({ ...confirmConfig, open: false })}
                                    className="flex-1 px-6 py-4 bg-gray-50 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={executeConfirmedAction}
                                    className={`flex-1 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all ${
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
                        onUndo={toast.onUndo}
                        onClose={() => {
                            if (toast.onClose) toast.onClose();
                            setToast(null);
                        }} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Conventions;

