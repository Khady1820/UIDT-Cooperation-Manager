import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ConventionDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [convention, setConvention] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

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

    const handleWorkflowAction = async (action, reason = null) => {
        setSubmitting(true);
        try {
            let endpoint = '';
            let payload = {};

            switch(action) {
                case 'submit': endpoint = `/conventions/${id}/submit`; break;
                case 'validate': endpoint = `/conventions/${id}/validate-director`; break;
                case 'sign': endpoint = `/conventions/${id}/sign-rector`; break;
                case 'reject': 
                    endpoint = `/conventions/${id}/reject`; 
                    payload = { reason };
                    break;
                default: return;
            }

            await api.post(endpoint, payload);
            setIsRejectionModalOpen(false);
            setRejectionReason('');
            fetchConvention();
            alert('Action effectuée avec succès.');
        } catch (err) {
            alert('Erreur lors de l\'action du workflow.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-[#001D3D]/10 border-t-[#001D3D] rounded-full animate-spin"></div>
        </div>
    );
    
    if (!convention) return (
        <div className="p-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100 italic text-gray-400">
            Dossier introuvable ou archivé.
        </div>
    );

    const steps = [
        { id: 'brouillon', label: 'Brouillon', icon: 'edit_square' },
        { id: 'soumis', label: 'Instruction (Coopération)', icon: 'account_balance' },
        { id: 'valide_dir', label: 'Approbation (Direction)', icon: 'verified_user' },
        { id: 'signe_recteur', label: 'Signature (Rectorat)', icon: 'ink_pen' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === convention.status);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Action Bar / Status */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-white to-gray-50/50">
                <div className="flex items-center gap-6">
                    <Link to="/conventions" className="w-14 h-14 bg-gray-50 text-gray-400 hover:text-[#001D3D] flex items-center justify-center rounded-2xl transition-all border border-gray-100 group">
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black text-[#8B7355] uppercase tracking-[0.2em]">UIDT Dossier #{convention.id}</span>
                            {convention.status === 'brouillon' && convention.rejection_reason && (
                                <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100 animate-pulse">Action Requise: Correction</span>
                            )}
                        </div>
                        <h1 className="text-2xl font-black text-[#001D3D] tracking-tight uppercase">{convention.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Role-based Buttons */}
                    {user?.role?.name === 'porteur_projet' && convention.status === 'brouillon' && (
                        <button onClick={() => handleWorkflowAction('submit')} disabled={submitting} className="px-10 py-4 bg-[#001D3D] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#001D3D]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                            Soumettre pour Approbation
                            <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                    )}

                    {(user?.role?.name === 'directeur_cooperation' || user?.role?.name === 'admin') && convention.status === 'soumis' && (
                        <div className="flex gap-4">
                            <button onClick={() => handleWorkflowAction('validate')} disabled={submitting} className="px-10 py-4 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all">Valider le Dossier</button>
                            <button onClick={() => setIsRejectionModalOpen(true)} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Rejeter</button>
                        </div>
                    )}

                    {(user?.role?.name === 'recteur' || user?.role?.name === 'admin') && convention.status === 'valide_dir' && (
                        <div className="flex gap-4">
                            <button onClick={() => handleWorkflowAction('sign')} disabled={submitting} className="px-10 py-4 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all">Apposer Signature</button>
                            <button onClick={() => setIsRejectionModalOpen(true)} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Rejeter Protocol</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Workflow Progress Bar */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2 z-0"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>
                    
                    {steps.map((s, idx) => {
                        const isDone = idx < currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        const isLast = idx === steps.length - 1;
                        
                        return (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : isCurrent ? 'bg-[#001D3D] text-white shadow-2xl shadow-[#001D3D]/30 scale-125' : 'bg-white border-4 border-gray-50 text-gray-200'}`}>
                                    <span className="material-symbols-outlined text-[24px]">{isDone ? 'check' : s.icon}</span>
                                </div>
                                <div className="text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-[#001D3D]' : 'text-gray-300'}`}>{s.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {convention.rejection_reason && convention.status === 'brouillon' && (
                <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-start gap-6">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                        <span className="material-symbols-outlined text-[24px]">feedback</span>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-1">Motif du rejet :</h4>
                        <p className="text-sm font-bold text-red-700/80 leading-relaxed italic">"{convention.rejection_reason}"</p>
                        <p className="text-[10px] text-red-400 mt-4 font-black uppercase tracking-widest">Action: Veuillez corriger les informations et soumettre à nouveau le dossier.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Details Content */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100 space-y-12">
                        <div className="grid grid-cols-3 gap-12">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Classification</label>
                                <p className="text-sm font-black text-[#001D3D] uppercase">{convention.type}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Partenaire Stratégique</label>
                                <p className="text-sm font-black text-[#001D3D]">{convention.partners || '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Année de Référence</label>
                                <p className="text-sm font-black text-[#001D3D]">{convention.year || '2024'}</p>
                            </div>
                        </div>

                        <div className="h-px bg-gray-50"></div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-[#001D3D] uppercase tracking-[0.2em]">Objectifs Institutionnels</h3>
                            <p className="text-sm text-gray-500 leading-[1.8] font-medium italic bg-gray-50/30 p-8 rounded-[2.5rem] border border-gray-50 whitespace-pre-wrap">
                                {convention.objectives || 'Aucun objectif spécifié pour le moment.'}
                            </p>
                        </div>

                        {/* Performance Metric Section */}
                        <div className="bg-gradient-to-br from-[#001D3D] to-[#002b5c] p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#B68F40] text-[24px]">analytics</span>
                                    <h4 className="text-xs font-black uppercase tracking-widest">Indicateur de Performance</h4>
                                </div>
                                <p className="text-lg font-black tracking-tight text-white/90">{convention.indicator || 'N/A'}</p>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-white/40 uppercase mb-2">Cible</p>
                                    <p className="text-2xl font-black">{convention.target || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-white/40 uppercase mb-2">Réalisé</p>
                                    <p className="text-2xl font-black">{convention.actual_value || 0}</p>
                                </div>
                                <div className="w-px h-12 bg-white/10"></div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[#B68F40] uppercase mb-2">Completion</p>
                                    <p className="text-3xl font-black text-[#B68F40]">{parseFloat(convention.completion_rate || 0).toFixed(1)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Audit Log */}
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="material-symbols-outlined text-[#001D3D]">history_edu</span>
                            <h3 className="text-sm font-black text-[#001D3D] uppercase tracking-[0.2em]">Historique de Validation (Audit)</h3>
                        </div>
                        <div className="space-y-10 relative">
                            <div className="absolute left-[31px] top-4 bottom-4 w-px bg-gray-50"></div>
                            {(convention.logs || []).map((log, idx) => (
                                <div key={log.id} className="flex gap-10 items-start relative bg-white group">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${idx === 0 ? 'bg-[#001D3D] text-white shadow-xl shadow-[#001D3D]/20' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}>
                                        <span className="material-symbols-outlined text-[20px]">
                                            {log.action === 'creation' ? 'add' : log.action === 'rejet' ? 'close' : 'check'}
                                        </span>
                                    </div>
                                    <div className="flex-1 pt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-[11px] font-black text-[#001D3D] uppercase tracking-wider">{log.action.replace('_', ' ')}</h4>
                                            <span className="text-[9px] font-bold text-gray-400">{format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}</span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500">Par {log.user?.name}</p>
                                        {log.comment && <p className="mt-3 text-[10px] text-gray-400 italic bg-gray-50/50 p-4 rounded-xl">"{log.comment}"</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-[#001D3D] p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Porteur de Projet</label>
                                <p className="text-sm font-black">{convention.user?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Contact Rectorat</label>
                                <p className="text-[10px] font-bold text-white/60">Direction de la Coopération - UIDT</p>
                            </div>
                            <div className="h-px bg-white/5"></div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase">
                                    <span className="text-white/40">Durée</span>
                                    <span>{convention.duration || '5 ans'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase">
                                    <span className="text-white/40">Échéance</span>
                                    <span className="text-[#B68F40]">{format(new Date(convention.end_date), 'dd/MM/yyyy')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 text-white/[0.03] rotate-12 pointer-events-none">
                            <span className="material-symbols-outlined text-[120px]">verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            <AnimatePresence>
                {isRejectionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100"
                        >
                            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-red-50/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                                        <span className="material-symbols-outlined">feedback</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-[#001D3D] uppercase">Rejet du Dossier</h2>
                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mt-1">Établissement du motif obligatoire</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsRejectionModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-12 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Description des motifs du rejet</label>
                                    <textarea 
                                        required
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-8 text-sm font-bold text-[#001D3D] outline-none focus:border-red-200 transition-all min-h-[150px] placeholder:italic"
                                        placeholder="Veuillez spécifier les corrections nécessaires..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setIsRejectionModalOpen(false)}
                                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        onClick={() => handleWorkflowAction('reject', rejectionReason)}
                                        disabled={!rejectionReason || submitting}
                                        className="flex-[2] py-5 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        Confirmer le Rejet
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ConventionDetails;
