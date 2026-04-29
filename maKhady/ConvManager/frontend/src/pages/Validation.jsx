import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
        <span className="text-sm font-bold uppercase tracking-widest">{message}</span>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity ml-auto">
            <span className="material-symbols-outlined text-base">close</span>
        </button>
    </motion.div>
);

const Validation = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [pendingDossiers, setPendingDossiers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [toast, setToast] = useState(null);
    
    const isValidator = user?.role?.name !== 'porteur_projet';

    useEffect(() => {
        fetchPendingDossiers();
    }, [user, isValidator]);

    const fetchPendingDossiers = async () => {
        setFetching(true);
        try {
            const endpoint = '/conventions?pending=1';
            const res = await api.get(endpoint);
            setPendingDossiers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-black text-[#2E2F7F] dark:text-white tracking-tight uppercase tracking-widest">
                        {user?.role?.name === 'porteur_projet' ? 'Suivi de mes Projets' : t('validation')}
                    </h1>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
                        {user?.role?.name === 'porteur_projet' ? 'État de vos dossiers en circuit' : t('institutional_sub') + ' • Circuit de Signature'}
                    </p>
                </div>
                {user?.role?.name === 'porteur_projet' && (
                    <button 
                        onClick={() => navigate('/conventions?new=true')}
                        className="px-8 py-4 bg-[#2E2F7F] text-white rounded-2xl text-base font-black uppercase tracking-widest hover:bg-[#002b5c] transition-all shadow-[0_20px_40px_rgba(0,29,61,0.15)] flex items-center gap-3 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Soumettre un nouveau Projet
                    </button>
                )}
            </div>

            {/* Circuit Information */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <span className="material-symbols-outlined text-[150px] text-[#2E2F7F] dark:text-white">verified_user</span>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">approval</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-[#2E2F7F] dark:text-white uppercase tracking-tight">Circuit d'Approbation Institutionnel</h2>
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Status: Conformité & Validation Stratégique</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: 1, label: 'Direction / Service', role: 'Initialisation', icon: 'description' },
                            { step: 2, label: 'Direction Juridique', role: 'Conformité', icon: 'gavel' },
                            { step: 3, label: 'Rectorat / Signature', role: 'Approbation Finale', icon: 'draw' }
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group hover:border-[#2E2F7F]/20 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#2E2F7F] dark:text-white font-black text-xs shadow-sm">
                                    {s.step}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.role}</span>
                                    <span className="text-sm font-black text-[#2E2F7F] dark:text-slate-300 uppercase tracking-tight">{s.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {fetching ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800">
                        <div className="w-12 h-12 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
                        <p className="mt-6 text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest opacity-40">Chargement du circuit...</p>
                    </div>
                ) : pendingDossiers.length === 0 ? (
                    <motion.div variants={itemVariants} className="col-span-full py-32 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 opacity-20 grayscale dark:invert">
                        <span className="material-symbols-outlined text-7xl text-slate-600 dark:text-slate-400">task_alt</span>
                        <p className="mt-6 text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">Aucun dossier en attente de visa</p>
                    </motion.div>
                ) : (
                    pendingDossiers.map((dossier) => (
                        <motion.div 
                            variants={itemVariants} 
                            key={dossier.id} 
                            onClick={() => navigate(`/conventions/${dossier.id}/summary`)}
                            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-[#2E2F7F]/10 dark:hover:shadow-black/20 transition-all duration-500 relative flex flex-col justify-between cursor-pointer"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-4 py-1.5 rounded-full bg-[#2E2F7F]/5 dark:bg-white/5 border border-[#2E2F7F]/10 dark:border-white/10 text-[#2E2F7F] dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                                        N° {dossier.num_dossier || dossier.id}
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        user?.role?.name === 'porteur_projet' 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border-blue-100 dark:border-blue-900'
                                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 border-amber-100 dark:border-amber-900'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                            user?.role?.name === 'porteur_projet' ? 'bg-blue-500' : 'bg-amber-500'
                                        }`}></span>
                                        {user?.role?.name === 'porteur_projet' ? 'EN CIRCUIT' : 'À VISER'}
                                    </div>
                                </div>

                                <h3 className="text-base font-black text-[#2E2F7F] dark:text-white leading-tight uppercase mb-4 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                                    {dossier.name}
                                </h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-lg opacity-40">apartment</span>
                                        <span className="text-xs font-bold truncate uppercase tracking-tight">{dossier.partners || 'Institution Partenaire'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-lg opacity-40">event</span>
                                        <span className="text-xs font-bold uppercase tracking-tight">Soumis le {format(new Date(dossier.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 dark:border-slate-800 flex flex-col gap-3">
                                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
                                    <span>Porteur : {dossier.user?.name}</span>
                                </div>
                                {user?.role?.name !== 'porteur_projet' ? (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/conventions/${dossier.id}/summary`);
                                            }}
                                            className="w-full px-4 py-4 bg-[#2E2F7F] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#002b5c] transition-all shadow-lg shadow-[#2E2F7F]/10 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            EXAMINER LE DOSSIER
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Cliquer pour voir le détail
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default Validation;
