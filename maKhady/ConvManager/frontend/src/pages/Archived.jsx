import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { useLanguage } from '../context/LanguageContext';

const Toast = ({ message, type, onClose }) => (
    <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={`fixed bottom-10 right-10 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
            type === 'success' ? 'bg-[#001D3D] text-white' : 'bg-red-500 text-white'
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

    useEffect(() => {
        fetchConventions();
    }, []);

    const fetchConventions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/conventions');
            const archivedOnly = res.data.filter(c => c.status === 'archive');

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
                await api.put(`/conventions/${id}`, { status: 'termine' }); // Restore to Signed status
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

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#001D3D] tracking-tight">{t('archived')} Institutionnelles</h1>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{t('institutional_sub')} • Dossiers Historiques</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => fetchConventions()} className="p-4 bg-white border border-gray-100 rounded-2xl text-[#001D3D] hover:bg-gray-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px] block">refresh</span>
                    </button>
                    <Link to="/conventions" className="px-8 py-4 bg-[#001D3D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#002b5c] transition-all shadow-sm flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px]">folder_open</span>
                        Voir Dossiers Actifs
                    </Link>
                </div>
            </div>

            {/* Main Content Card */}
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
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                        {filteredConventions.length} Archives Trouvées
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse table-fixed min-w-[1500px]">
                        <thead>
                            <tr className="bg-[#F1F3F5]/30 text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-6 w-40">{t('num_dossier')}</th>
                                <th className="px-8 py-6 w-80">{t('project_title_short')}</th>
                                <th className="px-8 py-6 w-40">{t('cooperation_type')}</th>
                                <th className="px-8 py-6 w-64">{t('partner_institution')}</th>
                                <th className="px-8 py-6 w-24">{t('year')}</th>
                                <th className="px-8 py-6 w-32">{t('duration')}</th>
                                <th className="px-8 py-6 w-48">Statut Final</th>
                                <th className="px-8 py-6 w-32 text-right sticky right-0 bg-[#FBFBFB]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="p-32 text-center bg-white">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-[#001D3D]/10 border-t-[#001D3D] rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-[#001D3D] uppercase tracking-widest opacity-40">{t('loading')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredConventions.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-32 text-center bg-white">
                                        <div className="flex flex-col items-center gap-6 opacity-20 grayscale">
                                            <span className="material-symbols-outlined text-7xl">archive</span>
                                            <p className="text-xs font-black uppercase tracking-widest">Aucune archive disponible</p>
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
                                            className="hover:bg-gray-50 transition-all group grayscale hover:grayscale-0 transition-grayscale duration-500"
                                        >
                                            <td className="px-8 py-7 text-[11px] font-black text-[#001D3D] bg-[#001D3D]/5 border-r border-gray-50">{conv.num_dossier || conv.id}</td>
                                            <td className="px-8 py-7">
                                                <Link to={`/conventions/${conv.id}`} className="font-black text-[#001D3D] tracking-tight group-hover:text-[#8B7355] transition-colors line-clamp-1 text-sm block">
                                                    {conv.name}
                                                </Link>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border bg-gray-50 text-gray-500 border-gray-100">
                                                    {conv.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7 text-xs font-black text-[#001D3D] uppercase tracking-tighter">{conv.partners || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-bold text-gray-400">{conv.year || '-'}</td>
                                            <td className="px-8 py-7 text-xs font-bold text-[#8B7355]">{conv.duration || '-'}</td>
                                            <td className="px-8 py-7">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${conv.status === 'termine' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {conv.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7 text-right sticky right-0 bg-white/95 group-hover:bg-gray-50 transition-colors shadow-[-10px_0_20px_rgba(0,0,0,0.02)]">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleRestore(conv.id)} title="Restaurer" className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:shadow-lg rounded-xl transition-all">
                                                        <span className="material-symbols-outlined text-[18px]">unarchive</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(conv.id)} title="Supprimer" className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:shadow-lg rounded-xl transition-all">
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
                                confirmConfig.type === 'delete' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                            }`}>
                                <span className="material-symbols-outlined text-4xl">
                                    {confirmConfig.type === 'delete' ? 'delete_forever' : 'unarchive'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-[#001D3D] mb-2 uppercase tracking-tight">{confirmConfig.title}</h3>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed mb-8">{confirmConfig.message}</p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setConfirmConfig({ ...confirmConfig, open: false })}
                                    className="flex-1 px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={executeConfirmedAction}
                                    className={`flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${
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
