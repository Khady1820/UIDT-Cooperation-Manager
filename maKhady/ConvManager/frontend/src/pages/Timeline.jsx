import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Timeline = () => {
    const [logs, setLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            (log.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.convention?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.comment || "").toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = filterType === 'all' || 
            (filterType === 'validation' && log.action.toLowerCase().includes('valid')) ||
            (filterType === 'creation' && log.action.toLowerCase().includes('creat')) ||
            (filterType === 'rejet' && log.action.toLowerCase().includes('rejet'));
            
        return matchesSearch && matchesFilter;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType]);

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (action) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('soumis') || actionLower.includes('submit')) return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        if (actionLower.includes('validé') || actionLower.includes('validate')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (actionLower.includes('signé') || actionLower.includes('sign')) return 'bg-slate-900 text-white border-slate-900';
        if (actionLower.includes('rejeté') || actionLower.includes('reject')) return 'bg-rose-50 text-rose-600 border-rose-100';
        if (actionLower.includes('creation')) return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    const getActionIcon = (action) => {
        const actionLower = action.toLowerCase();
        if (actionLower.includes('soumis') || actionLower.includes('submit')) return 'send';
        if (actionLower.includes('validé') || actionLower.includes('validate')) return 'verified';
        if (actionLower.includes('signé') || actionLower.includes('sign')) return 'history_edu';
        if (actionLower.includes('rejeté') || actionLower.includes('reject')) return 'cancel';
        if (actionLower.includes('creation')) return 'add_circle';
        return 'info';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-sm font-black text-slate-900 tracking-widest uppercase">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
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
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest">{t('timeline')}</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/20">
                            <span className="material-symbols-outlined text-white text-2xl">account_tree</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-1 italic">{t('institutional_sub')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                        <input 
                            type="text" 
                            placeholder="Rechercher une action..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all w-64"
                        />
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="flex items-center gap-3 px-6 py-4 text-sm font-black text-slate-900 uppercase tracking-widest bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 active:scale-95 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white/50 p-4 rounded-3xl border border-slate-100/50 backdrop-blur-sm">
                <button 
                    onClick={() => setFilterType('all')}
                    className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
                >
                    Tout
                </button>
                <button 
                    onClick={() => setFilterType('creation')}
                    className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${filterType === 'creation' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
                >
                    Créations
                </button>
                <button 
                    onClick={() => setFilterType('validation')}
                    className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${filterType === 'validation' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
                >
                    Validations
                </button>
                <button 
                    onClick={() => setFilterType('rejet')}
                    className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${filterType === 'rejet' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
                >
                    Rejets
                </button>
            </div>

            {/* Timeline Feed */}
            <div className="relative pl-12 space-y-10 before:content-[''] before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
                {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                        <div 
                            key={log.id} 
                            className="relative group"
                        >
                            {/* Dot Indicator */}
                            <div className={`absolute -left-[35px] top-2 w-11 h-11 rounded-2xl border border-white dark:border-slate-800 shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl z-10 ${getStatusStyles(log.action)}`}>
                                <span className="material-symbols-outlined text-[20px]">{getActionIcon(log.action)}</span>
                            </div>

                            {/* Activity Card */}
                            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all group-hover:shadow-2xl group-hover:shadow-slate-200/50 dark:group-hover:shadow-black/20">
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${getStatusStyles(log.action)}`}>
                                                {log.action}
                                            </span>
                                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 px-5 py-3 rounded-2xl border border-slate-100 dark:border-white/10">
                                                <div className="flex flex-col text-left">
                                                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-0.5">Date & Heure</span>
                                                    <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                                                        <span className="material-symbols-outlined text-[16px] text-indigo-600 dark:text-indigo-400">event</span>
                                                        {new Date(log.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-1"></span>
                                                        <span className="material-symbols-outlined text-[16px] text-indigo-600 dark:text-indigo-400">schedule</span>
                                                        {new Date(log.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                            <div 
                                                onClick={() => navigate('/manage-users')}
                                                className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 px-5 py-3 rounded-2xl border border-slate-100 dark:border-white/10 cursor-pointer hover:border-indigo-200 transition-all group/user"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover/user:text-indigo-600 transition-colors">
                                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover/user:text-indigo-600 transition-colors">{log.user?.name}</span>
                                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{log.user?.role?.name || 'Utilisateur'}</span>
                                                </div>
                                            </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Convention / Dossier</p>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {log.convention?.name || 'Projet Institutionnel'}
                                            </h3>
                                        </div>
                                        <div className="bg-slate-50/50 dark:bg-white/5 p-6 rounded-3xl border border-dashed border-slate-100 dark:border-white/10 relative italic">
                                            <span className="material-symbols-outlined absolute -left-3 -top-3 text-slate-500 dark:text-slate-600 text-3xl opacity-50">format_quote</span>
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed pl-4">
                                                {log.comment || 'Aucune observation enregistrée pour cette étape.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-24 rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-slate-500 dark:text-slate-400 mb-8 border border-slate-100 dark:border-white/10">
                            <span className="material-symbols-outlined text-[60px]">history_toggle_off</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Aucune activité</h3>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Le flux institutionnel est actuellement vide.</p>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mt-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        Page {currentPage} sur {totalPages} • {filteredLogs.length} Activités
                    </p>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => {
                                setCurrentPage(prev => Math.max(1, prev - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 disabled:opacity-20 hover:gap-3 transition-all"
                        >
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                            Précédent
                        </button>
                        <div className="flex gap-1.5 px-4 border-x border-slate-100">
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 rounded-lg text-[10px] font-black transition-all ${
                                        currentPage === i + 1 
                                        ? 'bg-slate-900 text-white shadow-xl' 
                                        : 'text-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => {
                                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 disabled:opacity-20 hover:gap-3 transition-all"
                        >
                            Suivant
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timeline;
