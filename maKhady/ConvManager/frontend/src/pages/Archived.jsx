import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Toast = ({ message, type, onClose }) => (
    <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={`fixed bottom-10 right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
            type === 'success' ? 'bg-[#2E2F7F] text-white' : 'bg-red-500 text-white'
        }`}
    >
        <span className="material-symbols-outlined">{type === 'success' ? 'check_circle' : 'error'}</span>
        <span className="text-xs font-bold uppercase tracking-widest">{message}</span>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity ml-auto">
            <span className="material-symbols-outlined text-sm">close</span>
        </button>
    </motion.div>
);

const Archived = () => {
    const [conventions, setConventions] = useState([]);
    const { searchQuery, setSearchQuery } = useSearch();
    const [loading, setLoading] = useState(true);
    const [confirmConfig, setConfirmConfig] = useState({ open: false, type: '', id: null, title: '' });
    const [toast, setToast] = useState(null);
    const { t } = useLanguage();
    const { user } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchConventions();
    }, []);

    const fetchConventions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/conventions');
            const archivedOnly = res.data.filter(c => c.status === 'archive' || c.status === 'termine');
            setConventions(archivedOnly);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = (id) => {
        setConfirmConfig({
            open: true,
            type: 'restore',
            id: id,
            title: 'Restaurer le Dossier',
            message: 'Ce projet sera replacé dans la liste des Projets de Coopération actifs.'
        });
    };

    const handleDelete = (id) => {
        setConfirmConfig({
            open: true,
            type: 'delete',
            id: id,
            title: 'Suppression Définitive',
            message: 'Attention : Cette action supprimera définitivement le dossier de la base de données.'
        });
    };

    const executeConfirmedAction = async () => {
        const { type, id } = confirmConfig;
        setConfirmConfig({ ...confirmConfig, open: false });
        
        try {
            if (type === 'delete') {
                await api.delete(`/conventions/${id}`);
                setToast({ message: 'Archive supprimée définitivement', type: 'success' });
            } else if (type === 'restore') {
                await api.put(`/conventions/${id}`, { status: 'termine' });
                setToast({ message: 'Dossier restauré avec succès', type: 'success' });
            }
            fetchConventions();
        } catch (err) {
            setToast({ message: 'Une erreur est survenue', type: 'error' });
        }
    };

    const filteredConventions = conventions.filter(c => 
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.partners || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.partner_type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredConventions.length / itemsPerPage);
    const paginatedConventions = filteredConventions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 mb-2">
                        <button 
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-150 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[#2E2F7F] dark:text-white group-hover:scale-110 transition-transform duration-150 text-sm">arrow_back</span>
                            <span className="text-[9px] font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest">Retour</span>
                        </button>
                        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                        <h1 className="text-lg font-black text-[#2E2F7F] dark:text-white tracking-tight uppercase tracking-widest">{t('archived')} Institutionnelles</h1>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider italic">{t('institutional_sub')} • Dossiers Historiques</p>
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                            <span className="material-symbols-outlined text-[12px] text-amber-600 dark:text-amber-400">verified</span>
                            <span className="text-[9px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Signature Recteur + Archivage Secrétariat</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => fetchConventions()} className="w-11 h-11 flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-[#2E2F7F] dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[18px] block">refresh</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="p-10 border-b border-gray-50 dark:border-slate-800 bg-[#FBFBFB]/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#2E2F7F] dark:group-focus-within:text-white transition-colors text-[20px]">search</span>
                        <input 
                            type="text" 
                            placeholder="RECHERCHER DANS LES ARCHIVES..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-slate-700 text-[#2E2F7F] dark:text-white rounded-2xl pl-14 pr-6 py-3.5 text-[10px] font-black placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:ring-8 focus:ring-[#2E2F7F]/5 focus:border-[#2E2F7F]/10 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-full border border-gray-100 dark:border-white/10">
                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                        {filteredConventions.length} Dossiers Archivés
                    </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto custom-scrollbar relative">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA]/50 dark:bg-slate-800 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700">
                            <tr className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                                <th className="px-4 py-6 text-left w-40">N° DOSSIER</th>
                                <th className="px-4 py-6 text-left">TITRE DU PROJET</th>
                                <th className="px-4 py-6 text-left">PARTENAIRE</th>
                                <th className="px-4 py-6 text-left">ANNÉE</th>
                                <th className="px-4 py-6 text-left">STATUT</th>
                                <th className="px-4 py-6 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-32 text-center bg-white dark:bg-slate-900">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
                                            <p className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest opacity-40">Synchronisation des archives...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredConventions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-32 text-center bg-white dark:bg-slate-900">
                                        <div className="flex flex-col items-center gap-6 opacity-20 grayscale dark:invert">
                                            <span className="material-symbols-outlined text-7xl text-slate-600 dark:text-slate-400">inventory_2</span>
                                            <p className="text-base font-black uppercase tracking-widest text-slate-900 dark:text-white">Aucun dossier dans le répertoire d'archives</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedConventions.map((conv) => (
                                    <tr 
                                        key={conv.id} 
                                        className="hover:bg-[#F8F9FA]/80 dark:hover:bg-white/5 transition-all group"
                                    >
                                        <td className="px-4 py-6 text-[11px] font-black text-[#2E2F7F] dark:text-indigo-300 bg-[#2E2F7F]/5 dark:bg-indigo-900/20 border-r border-gray-50 dark:border-slate-800">{conv.num_dossier || conv.id}</td>
                                        <td className="px-4 py-6">
                                            <Link to={`/conventions/${conv.id}/summary`} className="font-black text-[#2E2F7F] dark:text-white tracking-tight group-hover:text-[#F7931E] transition-colors line-clamp-1 text-xs block uppercase">
                                                {conv.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-6 text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                            <div className="line-clamp-1">{conv.partners || '-'}</div>
                                        </td>
                                        <td className="px-4 py-6 text-[11px] font-black text-slate-500 dark:text-slate-500">
                                            {conv.year || new Date(conv.created_at).getFullYear()}
                                        </td>
                                        <td className="px-4 py-6">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                                conv.status === 'termine' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900 shadow-green-100/50' : 
                                                'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800'
                                            }`}>
                                                {conv.status === 'termine' ? 'Signée & Archivée' : 'Archivée (Draft)'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Link 
                                                    to={`/conventions/${conv.id}/summary`} 
                                                    title="Voir les détails"
                                                    className="w-8 h-8 flex items-center justify-center bg-[#2E2F7F] text-white rounded-lg hover:bg-[#F7931E] transition-all shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                </Link>
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
                    <div className="p-8 border-t border-gray-50 dark:border-slate-800 bg-[#FBFBFB]/50 dark:bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Page</span>
                            <span className="text-xs font-black text-[#2E2F7F] dark:text-white bg-[#2E2F7F]/5 dark:bg-indigo-900/20 px-3 py-1 rounded-lg border border-[#2E2F7F]/10">{currentPage}</span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">sur</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">{totalPages}</span>
                            <div className="w-1 h-4 bg-gray-200 dark:bg-slate-700 mx-2"></div>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{filteredConventions.length} Archives</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(1, prev - 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-[#2E2F7F] dark:text-white disabled:opacity-20 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all active:scale-90 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-base font-black">chevron_left</span>
                            </button>

                            <div className="flex items-center gap-1 mx-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                                    .map((p, i, arr) => (
                                        <div key={p} className="flex items-center gap-1">
                                            {i > 0 && arr[i-1] !== p - 1 && (
                                                <span className="text-slate-300 dark:text-slate-700 font-black px-1">...</span>
                                            )}
                                            <button 
                                                onClick={() => {
                                                    setCurrentPage(p);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all active:scale-90 ${
                                                    currentPage === p 
                                                    ? 'bg-[#2E2F7F] text-white shadow-lg shadow-[#2E2F7F]/20' 
                                                    : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        </div>
                                    ))}
                            </div>

                            <button 
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-[#2E2F7F] dark:text-white disabled:opacity-20 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all active:scale-90 shadow-sm"
                            >
                                <span className="material-symbols-outlined text-base font-black">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {confirmConfig.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-lg text-center"
                        >
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                                confirmConfig.type === 'delete' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-500 dark:text-green-400'
                            }`}>
                                <span className="material-symbols-outlined text-4xl">
                                    {confirmConfig.type === 'delete' ? 'delete_forever' : 'unarchive'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-[#2E2F7F] dark:text-white mb-2 uppercase tracking-tight">{confirmConfig.title}</h3>
                            <p className="text-base font-bold text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{confirmConfig.message}</p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setConfirmConfig({ ...confirmConfig, open: false })}
                                    className="flex-1 px-6 py-4 bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-100 dark:border-slate-700"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={executeConfirmedAction}
                                    className={`flex-1 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all ${
                                        confirmConfig.type === 'delete' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
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

export default Archived;
