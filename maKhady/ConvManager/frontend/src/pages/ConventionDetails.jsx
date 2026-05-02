import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import StatusBadge from '../components/StatusBadge';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div 
            key="status-toast"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={onClose}
            className={`fixed bottom-10 right-10 z-[100] px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 cursor-pointer hover:scale-105 transition-all ${
                type === 'success' ? 'bg-[#2E2F7F] text-white' : 'bg-red-500 text-white'
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

const ConventionDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [convention, setConvention] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [isDownloaded, setIsDownloaded] = useState(false);

    const [activeModalAction, setActiveModalAction] = useState(null); // 'reject' or 'validate-chef'
    const [rejectionReason, setRejectionReason] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        objectives: '',
        description: '',
        partners: '',
        type: '',
        start_date: '',
        end_date: '',
        indicator: '',
        target: '',
        actual_value: '',
        observations: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [hasStamp, setHasStamp] = useState(false);

    const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
    const [editingKpi, setEditingKpi] = useState(null);
    const [kpiFormData, setKpiFormData] = useState({
        name: '',
        description: '',
        valeur_reference: '',
        valeur_cible: '',
        valeur_atteinte: '',
        frequence_mesure: 'Annuel',
        responsable: ''
    });

    const openKpiModal = (kpi = null) => {
        if (kpi) {
            setEditingKpi(kpi);
            setKpiFormData({
                name: kpi.name || '',
                description: kpi.description || '',
                valeur_reference: kpi.valeur_reference || '',
                valeur_cible: kpi.valeur_cible || '',
                valeur_atteinte: kpi.valeur_atteinte || '',
                frequence_mesure: kpi.frequence_mesure || 'Annuel',
                responsable: kpi.responsable || ''
            });
        } else {
            setEditingKpi(null);
            setKpiFormData({
                name: '',
                description: '',
                valeur_reference: '',
                valeur_cible: '',
                valeur_atteinte: '',
                frequence_mesure: 'Annuel',
                responsable: ''
            });
        }
        setIsKpiModalOpen(true);
    };

    const handleKpiSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingKpi) {
                await api.put(`/kpis/${editingKpi.id}`, kpiFormData);
                setToast({ message: 'Indicateur mis à jour avec succès', type: 'success' });
            } else {
                await api.post('/kpis', { ...kpiFormData, convention_id: id });
                setToast({ message: 'Nouvel indicateur ajouté', type: 'success' });
            }
            setIsKpiModalOpen(false);
            fetchConvention();
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Erreur lors de l’enregistrement de l’indicateur';
            setToast({ message: errorMsg, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleKpiDelete = async (kpiId) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet indicateur ?')) return;
        try {
            await api.delete(`/kpis/${kpiId}`);
            setToast({ message: 'Indicateur supprimé', type: 'success' });
            fetchConvention();
        } catch (error) {
            setToast({ message: 'Erreur lors de la suppression', type: 'error' });
        }
    };

    const handleDownload = () => {
        if (!convention?.file_path) {
            setToast({ message: "Aucun document n'est disponible pour l'impression.", type: 'error' });
            return;
        }
        
        // Use the hardcoded backend URL to match the API service
        const baseUrl = 'http://localhost:8000';
        const fileUrl = `${baseUrl}/storage/${convention.file_path}`;
        
        // Create a temporary link to force download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.download = convention.file_path.split('/').pop(); // Suggest filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsDownloaded(true);
    };

    const openEditModal = () => {
        setEditFormData({
            name: convention.name || '',
            objectives: convention.objectives || '',
            description: convention.description || '',
            partners: convention.partners || '',
            type: convention.type || 'national',
            start_date: convention.start_date || '',
            end_date: convention.end_date || '',
            indicator: convention.indicator || '',
            target: convention.target || '',
            actual_value: convention.actual_value || '',
            observations: convention.observations || ''
        });
        setSelectedFile(null);
        setIsEditModalOpen(true);
    };

    const handleEditSave = async (e) => {
        e.preventDefault();

        if (user?.role?.name === 'secretariat' && !hasStamp && selectedFile) {
            setToast({ message: "Veuillez confirmer l'apposition du cachet officiel avant de soumettre.", type: 'error' });
            return;
        }

        setSubmitting(true);
        
        const payload = new FormData();
        Object.keys(editFormData).forEach(key => {
            if (editFormData[key] !== null && editFormData[key] !== undefined) {
                payload.append(key, editFormData[key]);
            }
        });
        
        if (selectedFile) {
            payload.append('file', selectedFile);
            // If secretariat uploads the file, we mark as finished
            if (user?.role?.name === 'secretariat') {
                payload.append('status', 'termine');
            }
        }
        
        // Laravel method spoofing for PATCH/PUT with files
        payload.append('_method', 'PUT');

        try {
            // Let axios handle Content-Type and boundary for FormData
            const res = await api.post(`/conventions/${id}`, payload);
            setConvention(res.data);
            setIsEditModalOpen(false);
            setIsDownloaded(false);
            setToast({ 
                message: user?.role?.name === 'secretariat' 
                    ? 'Le document a été archivé avec succès. Il est désormais disponible dans le Répertoire Officiel.' 
                    : 'Le document a été mis à jour avec succès.', 
                type: 'success' 
            });
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Erreur lors de la modification';
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchConvention();
    }, [id]);

    const fetchConvention = async () => {
        if (!id || id === 'undefined') return;
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
                case 'validate-chef': 
                    endpoint = `/conventions/${id}/validate-chef`; 
                    payload = { comment: reason };
                    break;
                case 'validate': endpoint = `/conventions/${id}/validate-director`; break;
                case 'validate-legal': endpoint = `/conventions/${id}/validate-legal`; break;
                case 'finalize': endpoint = `/conventions/${id}/finalize-director`; break;
                case 'validate-sg': 
                    endpoint = `/conventions/${id}/validate-sg`; 
                    payload = { comment: reason };
                    break;
                case 'sign': endpoint = `/conventions/${id}/sign-rector`; break;
                case 'reject': 
                    endpoint = `/conventions/${id}/reject`; 
                    payload = { reason };
                    break;
                default: return;
            }

            if (action === 'sign' && reason instanceof File) {
                payload = new FormData();
                payload.append('signed_file', reason);
                await api.post(endpoint, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else if (action === 'sign') {
                // If rector doesn't provide a file, just send the comment
                await api.post(endpoint, { comment: reason });
            } else {
                await api.post(endpoint, payload);
            }
            setActiveModalAction(null);
            setRejectionReason('');
            fetchConvention();
            
            // Map actions to descriptive messages
            const messages = {
                'submit': 'Le dossier a été soumis avec succès.',
                'validate-chef': 'Pré-validation effectuée. Dossier transmis au Directeur.',
                'validate': 'Première validation effectuée. Dossier transmis au Juridique.',
                'validate-legal': 'Visa juridique accordé. Dossier retourné à la Direction.',
                'finalize': 'Dossier finalisé par la Coopération. Transmis au Secrétariat Général.',
                'validate-sg': 'Visa du Secrétariat Général accordé. Transmis au Recteur.',
                'sign': 'Opération réussie ! Le protocole a été officiellement signé.',
                'reject': 'Le dossier a été renvoyé.'
            };
            setToast({ message: messages[action] || 'Action effectuée avec succès.', type: 'success' });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Une erreur est survenue lors du traitement.';
            setToast({ message: errorMsg, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] rounded-full animate-spin"></div>
        </div>
    );
    
    if (!convention) return (
        <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-400">
            Dossier introuvable ou archivé.
        </div>
    );

    const steps = [
        { id: 'brouillon', label: 'Brouillon', icon: 'edit_square' },
        { id: 'soumis', label: 'Pré-validation (Chef)', icon: 'person_search' },
        { id: 'valide_chef_division', label: 'Instruction (Dir)', icon: 'account_balance' },
        { id: 'valide_dir_initial', label: 'Conformité (Jur)', icon: 'gavel' },
        { id: 'valide_juridique', label: 'Contrôle Final', icon: 'verified_user' },
        { id: 'attente_sg', label: 'Visa SG', icon: 'verified_user' },
        { id: 'pret_pour_signature', label: 'Signature', icon: 'ink_pen' },
        { id: 'termine', label: 'Archivé', icon: 'task_alt' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === convention.status);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* Header Officiel pour l'impression uniquement */}
            <div className="hidden print:block mb-10 border-b-2 border-slate-900 pb-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <img 
                            src="/image/logo_UIDT.png" 
                            alt="Logo UIDT" 
                            className="w-24 h-24 object-contain"
                            onError={(e) => {
                                if (e.target.src.includes('.png')) {
                                    e.target.src = '/image/logo_UIDT.jpg';
                                } else {
                                    e.target.style.display = 'none';
                                }
                            }}
                        />
                        <div>
                            <h1 className="text-xl font-black text-slate-900 uppercase">Université Iba Der Thiam de Thiès</h1>
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Direction de la Coopération et des Partenariats</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-tighter">Document Généré le :</p>
                        <p className="text-xs font-bold">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-[9px] font-bold text-slate-500 mt-1">REF: {convention.num_dossier}</p>
                    </div>
                </div>
                <div className="mt-8 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">Fiche de Suivi et de Performance</h2>
                </div>
            </div>
            {/* Navigation / Back Button */}
            <div className="flex items-center gap-4 no-print">
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-[#2E2F7F] dark:group-hover:text-indigo-400 transition-colors">arrow_back</span>
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest group-hover:text-[#2E2F7F] dark:group-hover:text-indigo-400 transition-colors">Retour</span>
                </button>
                <div className="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                {user?.role?.name !== 'admin' && (
                    <>
                        <button 
                            onClick={() => window.print()}
                            className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-[#2E2F7F] dark:text-indigo-400"
                        >
                            <span className="material-symbols-outlined text-sm">print</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Imprimer Fiche</span>
                        </button>
                        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                    </>
                )}
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Détails du Dossier</p>
            </div>

            {/* Action Bar / Status */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={convention.status} />
                            <span className="text-[10px] font-black text-[#F7931E] uppercase tracking-[0.2em] ml-2">UIDT Système Statistique</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#2E2F7F] tracking-tight uppercase leading-tight">{convention.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Role-based Buttons */}
                    {user?.role?.name === 'porteur_projet' && convention.status === 'brouillon' && (
                        <button onClick={() => handleWorkflowAction('submit')} disabled={submitting} className="px-10 py-4 bg-[#2E2F7F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2E2F7F]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                            Soumettre pour Approbation
                            <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                    )}

                    {(user?.role?.name === 'chef_division') && (convention.status === 'soumis' || convention.status === 'en attente') && (
                        <div className="flex gap-4">
                            <button onClick={() => setActiveModalAction('validate-chef')} disabled={submitting} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Accorder Pré-validation</button>
                            <button onClick={() => setActiveModalAction('reject')} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Rejeter</button>
                        </div>
                    )}

                    {(user?.role?.name === 'directeur_cooperation') && convention.status === 'valide_chef_division' && (
                        <div className="flex gap-4">
                            <button onClick={() => handleWorkflowAction('validate')} disabled={submitting} className="px-10 py-4 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all">Transmettre au Juridique</button>
                            <button onClick={() => setActiveModalAction('reject')} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Rejeter</button>
                        </div>
                    )}

                    {(user?.role?.name === 'service_juridique') && convention.status === 'valide_dir_initial' && (
                        <div className="flex gap-4">
                            <button onClick={() => handleWorkflowAction('validate-legal')} disabled={submitting} className="px-10 py-4 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all">Accorder le Visa Juridique</button>
                            <button onClick={() => setActiveModalAction('reject')} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Refuser le Visa</button>
                        </div>
                    )}

                    {(user?.role?.name === 'directeur_cooperation') && convention.status === 'valide_juridique' && (
                        <div className="flex gap-4">
                            <button onClick={() => handleWorkflowAction('finalize')} disabled={submitting} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Transmettre au Secrétaire Général</button>
                            <button onClick={() => setActiveModalAction('reject')} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Renvoyer en Correction</button>
                        </div>
                    )}

                    {(user?.role?.name === 'secretaire_general') && convention.status === 'attente_sg' && (
                        <div className="flex gap-4">
                            <button onClick={() => setActiveModalAction('validate-sg')} disabled={submitting} className="px-10 py-4 bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-700/20 hover:bg-blue-800 transition-all">Accorder le Visa SG</button>
                            <button onClick={() => setActiveModalAction('reject')} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Renvoyer à la Coopération</button>
                        </div>
                    )}

                    {(user?.role?.name === 'recteur') && convention.status === 'pret_pour_signature' && (
                        <div className="flex gap-4">
                            <button onClick={() => setActiveModalAction('sign')} disabled={submitting} className="px-10 py-4 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all">Apposer Signature Finale</button>
                            <button onClick={() => setActiveModalAction('reject')} disabled={submitting} className="px-10 py-4 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 transition-all">Rejeter Protocol</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Workflow Progress Bar */}
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-50 -translate-y-1/2 z-0"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>
                    
                    {steps.map((s, idx) => {
                        const isDone = idx < currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        
                        return (
                            <div key={`step-${s.id || idx}`} className="relative z-10 flex flex-col items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : isCurrent ? 'bg-[#2E2F7F] dark:bg-indigo-600 text-white shadow-2xl shadow-[#2E2F7F]/30 scale-125' : 'bg-white dark:bg-slate-800 border-4 border-gray-50 dark:border-slate-700 text-gray-200 dark:text-slate-700'}`}>
                                    <span className="material-symbols-outlined text-[24px]">{isDone ? 'check' : s.icon}</span>
                                </div>
                                <div className="text-center">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-[#2E2F7F] dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500'}`}>{s.label}</p>
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
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-12">
                        <div className="grid grid-cols-3 gap-12">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Classification</label>
                                <p className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase">
                                    {convention.type === 'national' ? 'Nationale' : convention.type === 'international' ? 'Internationale' : 'Régionale'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Partenaire Stratégique</label>
                                <p className="text-sm font-black text-[#2E2F7F] dark:text-white">{convention.partners || '—'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Année de Référence</label>
                                <p className="text-sm font-black text-[#2E2F7F] dark:text-white">{convention.year || '2024'}</p>
                            </div>
                        </div>

                        <div className="h-px bg-gray-50 dark:bg-slate-800"></div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-[#2E2F7F] dark:text-indigo-400 uppercase tracking-[0.2em]">Objectifs Institutionnels</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 leading-[1.8] font-medium italic bg-gray-50/30 dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-50 dark:border-white/5 whitespace-pre-wrap">
                                {convention.objectives || 'Aucun objectif spécifié pour le moment.'}
                            </p>
                        </div>

                        {/* Performance Metric Section */}
                        <div className="bg-gradient-to-br from-[#2E2F7F] to-[#002b5c] p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#B68F40] text-[24px]">analytics</span>
                                    <h4 className="text-xs font-black uppercase tracking-widest">Résumé de Performance</h4>
                                </div>
                                <p className="text-lg font-black tracking-tight text-white/90">{convention.indicator || 'Indicateur Global'}</p>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-white/40 uppercase mb-2">Cible</p>
                                    <p className="text-2xl font-black">{convention.target || 0}</p>
                                </div>
                                {(convention.status === 'signe_recteur' || convention.status === 'termine') && (
                                    <>
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-white/40 uppercase mb-2">Réalisé</p>
                                            <p className="text-2xl font-black">{convention.actual_value || 0}</p>
                                        </div>
                                        <div className="w-px h-12 bg-white/10"></div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-[#B68F40] uppercase mb-2">Completion</p>
                                            <p className="text-3xl font-black text-[#B68F40]">{parseFloat(convention.completion_rate || 0).toFixed(1)}%</p>
                                        </div>
                                    </>
                                )}
                                {!(convention.status === 'signe_recteur' || convention.status === 'termine') && (
                                    <div className="text-center px-6 py-2 bg-white/5 rounded-xl border border-white/10">
                                        <p className="text-[8px] font-black text-white/30 uppercase">Suivi disponible après signature</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detailed KPIs Section */}
                        <div className="space-y-8 pt-6">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                                <div>
                                    <h3 className="text-sm font-black text-[#2E2F7F] uppercase tracking-[0.2em]">Indicateurs Stratégiques Spécifiques</h3>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Suivi métrique détaillé par axe</p>
                                </div>
                                {(user?.role?.name === 'porteur_projet') && (
                                    <button 
                                        onClick={() => openKpiModal()}
                                        className="px-6 py-3 bg-[#2E2F7F] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#F7931E] transition-all flex items-center gap-2 shadow-lg shadow-[#2E2F7F]/10"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                        {t('ajouter_indicateur')}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {convention.kpis?.length > 0 ? (
                                    convention.kpis.map((kpi, kIdx) => (
                                        <div key={`kpi-${kpi.id || kIdx}`} className="bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-slate-800 rounded-[2rem] p-8 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-tight">{kpi.name}</h4>
                                                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold italic">"{kpi.description || 'Pas de description'}"</p>
                                                </div>
                                                {(user?.role?.name === 'porteur_projet') && (
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openKpiModal(kpi)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#2E2F7F] dark:hover:text-indigo-400 transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                        <button onClick={() => handleKpiDelete(kpi.id)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                                                    </div>
                                                )}
                                            </div>
                                             <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Référence</p>
                                                    <p className="text-xs font-black text-[#2E2F7F]">{kpi.valeur_reference || '0'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Objectif</p>
                                                    <p className="text-xs font-black text-[#2E2F7F]">{kpi.valeur_cible || '0'}</p>
                                                </div>
                                                {(convention.status === 'signe_recteur' || convention.status === 'termine') ? (
                                                    <>
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-[#F7931E] uppercase tracking-[0.2em]">Atteint</p>
                                                            <p className="text-xs font-black text-[#F7931E]">{kpi.valeur_atteinte || '0'}</p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <div className="flex justify-between items-center mb-1.5">
                                                                <span className="text-[8px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Progression</span>
                                                                <span className="text-[9px] font-black text-[#2E2F7F] dark:text-indigo-400">{Math.min(100, Math.round((parseFloat(kpi.valeur_atteinte) / parseFloat(kpi.valeur_cible)) * 100)) || 0}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                                <motion.div 
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${Math.min(100, (parseFloat(kpi.valeur_atteinte) / parseFloat(kpi.valeur_cible)) * 100) || 0}%` }}
                                                                    className="h-full bg-[#2E2F7F] rounded-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="md:col-span-3 flex items-center bg-gray-100/50 rounded-xl px-4 py-2 border border-gray-100">
                                                        <span className="material-symbols-outlined text-xs text-gray-400 mr-2">lock</span>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Saisie des résultats après signature du protocole</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800">
                                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-600 text-4xl mb-4">analytics</span>
                                        <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">Aucun indicateur de suivi spécifique pour ce projet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-[#2E2F7F] dark:text-indigo-400">attach_file</span>
                                <h3 className="text-sm font-black text-[#2E2F7F] dark:text-indigo-400 uppercase tracking-[0.2em]">Documents du Dossier</h3>
                            </div>
                            <div className="flex gap-2">
                                {user?.role?.name === 'secretariat' && (
                                    <button 
                                        onClick={handleDownload}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center gap-2 border border-blue-100"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">print</span>
                                        Télécharger pour Impression
                                    </button>
                                )}
                                {['chef_division', 'directeur_cooperation', 'service_juridique', 'recteur', 'secretariat'].includes(user?.role?.name) && (
                                    <button 
                                        onClick={openEditModal}
                                        className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center gap-2 border border-amber-100"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {user?.role?.name === 'secretariat' ? 'upload_file' : 'edit_document'}
                                        </span>
                                        {user?.role?.name === 'secretariat' ? 'Archivage Numérique' : 'Modifier Dossier'}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {convention.file_path ? (
                                <div className="group flex items-center justify-between p-6 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-3xl">
                                                {convention.file_path.toLowerCase().endsWith('.docx') || convention.file_path.toLowerCase().endsWith('.doc') ? 'description' : 'picture_as_pdf'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[#2E2F7F] dark:text-white uppercase tracking-tight line-clamp-1">{convention.file_path.split('/').pop()}</p>
                                            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                                                Document Principal • {convention.file_path.toLowerCase().endsWith('.docx') || convention.file_path.toLowerCase().endsWith('.doc') ? 'Word' : 'PDF'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        disabled={isDownloaded}
                                        onClick={() => {
                                            if (isDownloaded) return;
                                            const link = document.createElement('a');
                                            link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${convention.file_path}`;
                                            link.target = '_blank';
                                            link.download = convention.file_path.split('/').pop();
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            setIsDownloaded(true);
                                            setToast({ message: 'Téléchargement démarré avec succès !', type: 'success' });
                                        }}
                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-lg ${isDownloaded ? 'bg-green-500/20 text-green-600 shadow-none cursor-default' : 'bg-[#2E2F7F] text-white shadow-[#2E2F7F]/20 hover:scale-110 active:scale-95'}`}
                                        title={isDownloaded ? "Document déjà téléchargé" : "Télécharger le document"}
                                    >
                                        <span className="material-symbols-outlined">{isDownloaded ? 'check_circle' : 'download'}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="p-10 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Aucun document joint à ce dossier.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline / Audit Log */}
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="material-symbols-outlined text-[#2E2F7F] dark:text-indigo-400">history_edu</span>
                            <h3 className="text-sm font-black text-[#2E2F7F] dark:text-indigo-400 uppercase tracking-[0.2em]">Historique de Validation (Audit)</h3>
                        </div>
                        <div className="space-y-10 relative">
                            <div className="absolute left-[31px] top-4 bottom-4 w-px bg-gray-50 dark:bg-slate-800"></div>
                            {(!convention.logs || convention.logs.length === 0) ? (
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic ml-16">Aucune activité enregistrée pour le moment.</p>
                            ) : (
                                convention.logs.map((log, idx) => (
                                    <div key={`log-${log.id || idx}`} className="flex gap-10 items-start relative bg-white dark:bg-slate-900 group">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${idx === 0 ? 'bg-[#2E2F7F] dark:bg-indigo-600 text-white shadow-xl shadow-[#2E2F7F]/20' : 'bg-gray-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700'}`}>
                                            <span className="material-symbols-outlined text-[20px]">
                                                {log.action === 'creation' ? 'add' : log.action === 'rejet' ? 'close' : 'check'}
                                            </span>
                                        </div>
                                        <div className="flex-1 pt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-[11px] font-black text-[#2E2F7F] dark:text-indigo-400 uppercase tracking-wider">{log.action.replace('_', ' ')}</h4>
                                                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400">{format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 dark:text-slate-500">Par {log.user?.name || 'Système'}</p>
                                            {log.comment && <p className="mt-3 text-[10px] text-slate-600 dark:text-slate-400 italic bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl">"{log.comment}"</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-[#2E2F7F] p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Porteur de Projet</label>
                                <p className="text-sm font-black">{convention.user?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Contact Recteur</label>
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

            {/* Workflow Comment/Rejection Modal */}
            <AnimatePresence mode="wait">
                {activeModalAction && (
                    <motion.div 
                        key={`modal-${activeModalAction}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/20"
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 dark:border-slate-800"
                        >
                            <div className={`p-10 border-b border-gray-50 flex justify-between items-center ${activeModalAction === 'reject' ? 'bg-red-50/30' : 'bg-blue-50/30'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeModalAction === 'reject' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                        <span className="material-symbols-outlined">{activeModalAction === 'reject' ? 'feedback' : 'rate_review'}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-[#2E2F7F] uppercase">
                                            {activeModalAction === 'reject' ? 'Rejet du Dossier' : 
                                             activeModalAction === 'sign' ? 'Signature Finale et Archivage' : 
                                             activeModalAction === 'validate-sg' ? 'Octroi du Visa SG' : 
                                             'Avis et Pré-validation'}
                                        </h2>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
                                            {activeModalAction === 'sign' ? 'Confirmation de la signature officielle' : 
                                             activeModalAction === 'validate-sg' ? 'Commentaires institutionnels (Optionnel)' : 
                                             'Saisie de commentaire obligatoire'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveModalAction(null)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-slate-600">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-12 space-y-8">
                                <div className="space-y-4">
                                    <>
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">
                                            {activeModalAction === 'sign' ? 'Observations finales (Optionnel)' : 'Observations et recommandations'}
                                        </label>
                                        <textarea 
                                            required={activeModalAction !== 'sign' && activeModalAction !== 'validate-sg'}
                                            className={`w-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[2rem] p-8 text-sm font-bold text-[#2E2F7F] dark:text-white outline-none transition-all min-h-[150px] placeholder:italic ${activeModalAction === 'reject' ? 'focus:border-red-200' : 'focus:border-blue-200'}`}
                                            placeholder={activeModalAction === 'reject' ? "Veuillez spécifier les corrections nécessaires..." : 
                                                         activeModalAction === 'sign' ? "Ajouter une note finale avant l'archivage..." : 
                                                         activeModalAction === 'validate-sg' ? "Observations éventuelles sur le dossier..." :
                                                         "Détaillez votre avis sur la pertinence et cohérence..."}
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => { setActiveModalAction(null); setRejectionReason(''); }}
                                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-gray-600 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        onClick={() => handleWorkflowAction(activeModalAction, rejectionReason)}
                                        disabled={(activeModalAction !== 'sign' && !rejectionReason) || submitting}
                                        className={`flex-[2] py-5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50 ${
                                            activeModalAction === 'reject' ? 'bg-red-500 shadow-red-500/20' : 
                                            activeModalAction === 'sign' ? 'bg-green-600 shadow-green-600/20' : 
                                            'bg-blue-600 shadow-blue-600/20'
                                        }`}
                                    >
                                        {activeModalAction === 'reject' ? 'Confirmer le Rejet' : 
                                         activeModalAction === 'sign' ? 'Valider la Signature Finale' : 
                                         activeModalAction === 'validate-sg' ? 'Valider et Accorder le Visa' :
                                         'Confirmer la Pré-validation'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* KPI Management Modal */}
            {isKpiModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-md bg-black/20">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col"
                        >
                            <div className="p-10 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center bg-[#FBFBFB] dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#2E2F7F] dark:bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#2E2F7F]/20">
                                        <span className="material-symbols-outlined">{editingKpi ? 'edit_note' : 'add_chart'}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#2E2F7F] dark:text-white uppercase tracking-tight">{editingKpi ? 'Modifier l’Indicateur' : 'Nouvel Indicateur de Performance'}</h2>
                                        <p className="text-[9px] font-black text-[#F7931E] uppercase tracking-widest mt-1">Saisie des métriques stratégiques</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsKpiModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-full transition-all text-slate-500 dark:text-slate-400">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleKpiSave} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Nom de l’indicateur</label>
                                        <input 
                                            required
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-[#2E2F7F] dark:text-white outline-none focus:border-[#2E2F7F]/10 transition-all"
                                            placeholder="Ex : Taux de réussite des étudiants en mobilité"
                                            value={kpiFormData.name}
                                            onChange={(e) => setKpiFormData({...kpiFormData, name: e.target.value})}
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Description / Observations</label>
                                        <textarea 
                                            className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-[#2E2F7F] dark:text-white outline-none focus:border-[#2E2F7F]/10 transition-all min-h-[80px]"
                                            placeholder="Détails sur la méthode de calcul ou le contexte..."
                                            value={kpiFormData.description}
                                            onChange={(e) => setKpiFormData({...kpiFormData, description: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('valeur_reference')}</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#2E2F7F] outline-none focus:border-[#2E2F7F]/10 transition-all"
                                            placeholder="Ex : 15%"
                                            value={kpiFormData.valeur_reference}
                                            onChange={(e) => setKpiFormData({...kpiFormData, valeur_reference: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#F7931E] uppercase tracking-widest ml-1">{t('valeur_cible')}</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-gray-50 border-2 border-amber-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#2E2F7F] outline-none focus:border-amber-200 transition-all"
                                            placeholder="Ex : 40%"
                                            value={kpiFormData.valeur_cible}
                                            onChange={(e) => setKpiFormData({...kpiFormData, valeur_cible: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#2E2F7F] uppercase tracking-widest ml-1">{t('valeur_atteinte')}</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-[#2E2F7F]/5 border-2 border-[#2E2F7F]/10 rounded-2xl px-6 py-4 text-sm font-black text-[#2E2F7F] outline-none focus:bg-white transition-all"
                                            placeholder="Valeur actuelle..."
                                            value={kpiFormData.valeur_atteinte}
                                            onChange={(e) => setKpiFormData({...kpiFormData, valeur_atteinte: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('frequence_mesure')}</label>
                                        <select 
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#2E2F7F] outline-none focus:border-[#2E2F7F]/10 transition-all appearance-none cursor-pointer"
                                            value={kpiFormData.frequence_mesure}
                                            onChange={(e) => setKpiFormData({...kpiFormData, frequence_mesure: e.target.value})}
                                        >
                                            <option value="Annuel">Annuel</option>
                                            <option value="Semestriel">Semestriel</option>
                                            <option value="Trimestriel">Trimestriel</option>
                                            <option value="Mensuel">Mensuel</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('responsable_suivi')}</label>
                                        <input 
                                            type="text"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#2E2F7F] outline-none focus:border-[#2E2F7F]/10 transition-all"
                                            placeholder="Ex : Chef de division / Nom de la Direction"
                                            value={kpiFormData.responsable}
                                            onChange={(e) => setKpiFormData({...kpiFormData, responsable: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsKpiModalOpen(false)}
                                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-5 bg-[#2E2F7F] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2E2F7F]/20 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {editingKpi ? 'Mettre à jour' : 'Ajouter l’Indicateur'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

            {/* Dossier Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#2E2F7F]/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative z-[130] w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-gray-50 dark:border-slate-800 bg-[#FBFBFB] dark:bg-slate-800/50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-[#2E2F7F] dark:text-white tracking-tight uppercase">
                                        {user?.role?.name === 'secretariat' ? 'ARCHIVAGE DU DOSSIER' : 'ÉDITION DU DOSSIER'}
                                    </h2>
                                    <p className="text-[10px] font-black text-[#F7931E] uppercase tracking-[0.3em] mt-1">
                                        {user?.role?.name === 'secretariat' ? 'Mise en ligne du scan final' : 'Mise à jour des informations et documents'}
                                    </p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-2xl transition-all text-slate-500 dark:text-slate-400 border border-gray-100 dark:border-slate-600">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleEditSave} className="p-12 space-y-8 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-[2rem] border border-amber-100/50 dark:border-amber-900/20 mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                                                <span className="material-symbols-outlined">info</span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-amber-800 dark:text-amber-200 uppercase tracking-widest mb-1">Mise à jour du document</p>
                                                <p className="text-[9px] font-bold text-amber-700/70 dark:text-amber-400/60 leading-relaxed uppercase tracking-wider">
                                                    Vous pouvez modifier le document joint (Word, PDF) en téléchargeant la version corrigée. 
                                                    Les informations d'identité du dossier restent figées.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-gray-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-amber-300 transition-all">
                                        <input 
                                            type="file" 
                                            id="dossier-file-update"
                                            accept=".doc,.docx"
                                            className="hidden"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />
                                        <label 
                                            htmlFor="dossier-file-update"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-[2rem] shadow-xl shadow-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-4xl">upload_file</span>
                                            </div>
                                            <p className="text-sm font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest">
                                                {selectedFile ? selectedFile.name : (user?.role?.name === 'secretariat' ? 'DÉPOSER LE SCAN FINAL' : 'Charger la version Word corrigée')}
                                            </p>
                                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 italic">Format PDF ou Word supportés</p>
                                        </label>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Observations internes (Optionnel)</label>
                                        <textarea 
                                            className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-2xl p-6 text-sm font-bold text-[#2E2F7F] dark:text-white outline-none focus:border-[#2E2F7F]/20 transition-all min-h-[100px]"
                                            placeholder="Notes sur les modifications apportées..."
                                            value={editFormData.observations}
                                            onChange={(e) => setEditFormData({ ...editFormData, observations: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {user?.role?.name === 'secretariat' && (
                                    <div className="p-8 px-10 bg-amber-50/50 dark:bg-amber-900/10 border-y border-amber-100/50 dark:border-amber-900/20">
                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <div className="pt-1">
                                                <input 
                                                    type="checkbox" 
                                                    checked={hasStamp}
                                                    onChange={(e) => setHasStamp(e.target.checked)}
                                                    className="w-6 h-6 rounded-lg border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-500 focus:ring-amber-500 transition-all cursor-pointer bg-white dark:bg-slate-800" 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Validation du Cachet Institutionnel</p>
                                                <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400/60 uppercase tracking-widest mt-1 leading-relaxed">
                                                    Je certifie avoir apposé le cachet officiel de l'UIDT sur le document physique avant le scan.
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                <div className="p-8 px-10 flex justify-end gap-4 bg-gray-50/30 dark:bg-slate-800/50">
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-8 py-4 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={(!selectedFile && !submitting) || (user?.role?.name === 'secretariat' && !hasStamp)}
                                        className="px-12 py-5 bg-[#2E2F7F] dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#2E2F7F]/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {submitting ? 'Enregistrement...' : (user?.role?.name === 'secretariat' ? 'ARCHIVER LE DOCUMENT SCANNÉ' : 'Valider la nouvelle version')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast && (
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast(null)} 
                    />
                )}
            </AnimatePresence>
                {/* Zone de Signature pour l'impression */}
                <div className="hidden print:block mt-20">
                    <div className="flex justify-end">
                        <div className="text-center w-64 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-900">Le Recteur de l'UIDT</p>
                            <div className="h-32 flex items-center justify-center">
                                <img 
                                    src="/image/signature_recteur.png" 
                                    alt="Signature Recteur" 
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        if (e.target.src.includes('.png')) {
                                            e.target.src = '/image/signature_recteur.jpg';
                                        } else {
                                            e.target.style.display = 'none';
                                        }
                                    }}
                                />
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-100 pt-2">Cachet et Signature</p>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                        .no-print, button, .Toastify { display: none !important; }
                        body { 
                            background: white !important; 
                            margin: 0 !important; 
                            padding: 0 !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        
                        /* Layout reset */
                        .space-y-10 > * + * { margin-top: 1.5rem !important; }
                        .pb-20 { padding-bottom: 0 !important; }
                        .grid { display: block !important; }
                        .lg\\:col-span-3, .lg\\:col-span-1 { width: 100% !important; margin-bottom: 2rem; }
                        
                        /* Card styling */
                        .premium-card, .bg-white, .bg-gray-50\\/50 { 
                            border: 1px solid #e2e8f0 !important; 
                            box-shadow: none !important; 
                            break-inside: avoid; 
                            border-radius: 1rem !important;
                            background-color: white !important;
                            padding: 1.5rem !important;
                        }

                        /* Dark Sections */
                        .bg-institutional, .bg-gradient-to-br, .bg-\\[\\#2E2F7F\\] { 
                            background-color: #2E2F7F !important; 
                            background-image: none !important;
                            color: white !important;
                        }
                        .text-white { color: white !important; }
                        
                        /* Progress and Indicators */
                        .bg-green-500 { background-color: #22c55e !important; }
                        .bg-gray-100 { background-color: #f1f5f9 !important; }
                        .w-full.bg-gray-100.h-1\\.5 { border: 1px solid #e2e8f0; }

                        /* Header & Signature */
                        .print\\:block { display: block !important; }
                        .border-b-2 { border-color: #000 !important; }
                        
                        /* Typography */
                        h1, h2, h3, h4 { color: #2E2F7F !important; }
                        .text-slate-600, .text-slate-500 { color: #475569 !important; }
                        
                        /* Fix for the audit log timeline */
                        .absolute.left-\\[31px\\] { border-left: 1px solid #e2e8f0 !important; background: none !important; }
                    }
                `}} />
        </motion.div>
    );
};

export default ConventionDetails;
