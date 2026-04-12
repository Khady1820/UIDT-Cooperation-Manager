import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

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

const Validation = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pendingDossiers, setPendingDossiers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [toast, setToast] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        type: 'national',
        partner_type: '',
        partners: '',
        year: new Date().getFullYear(),
        duration: '',
        indicator: '',
        target: '',
        actual_value: 0,
        objectives: '',
        observations: '',
        start_date: '',
        end_date: '',
        status: 'en attente'
    });

    const isValidator = user?.role?.name === 'directeur_cooperation' || user?.role?.name === 'recteur' || user?.role?.name === 'admin';

    useEffect(() => {
        if (isValidator) {
            fetchPendingDossiers();
        }
    }, [user, isValidator]);

    const fetchPendingDossiers = async () => {
        setFetching(true);
        try {
            const res = await api.get('/conventions?pending=1');
            setPendingDossiers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/conventions', formData);
            await api.post(`/conventions/${res.data.id}/submit`);
            setToast({ message: 'Projet soumis avec succès pour validation !', type: 'success' });
            setTimeout(() => navigate('/conventions'), 2000);
        } catch (err) {
            setToast({ message: 'Erreur lors de la soumission. Vérifiez les champs.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (isValidator) {
        return (
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex justify-between items-center bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#001D3D] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#001D3D]/20">
                            <span className="material-symbols-outlined text-[32px]">task</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-[#001D3D] tracking-tight">Espace de Validation</h1>
                            <p className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.3em] mt-1">
                                {user?.role?.name === 'directeur_cooperation' ? 'Directeur de la Coopération' : 'Rectorat - UIDT'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-[#001D3D]/5 px-6 py-3 rounded-2xl border border-[#001D3D]/10">
                            <span className="text-[10px] font-black text-[#001D3D] uppercase tracking-widest">{pendingDossiers.length} Dossiers en attente</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {fetching ? (
                        <div className="p-20 text-center bg-white rounded-[2.5rem] border border-gray-100 italic text-gray-400">Chargement des dossiers...</div>
                    ) : pendingDossiers.length === 0 ? (
                        <div className="p-32 text-center bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                                <span className="material-symbols-outlined text-[40px]">check_circle</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#001D3D]">Tous les dossiers sont traités</h3>
                                <p className="text-sm font-bold text-gray-400 mt-2">Aucune validation en attente pour le moment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {pendingDossiers.map((doc, idx) => (
                                    <motion.div 
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-black/5 transition-all cursor-pointer relative overflow-hidden"
                                        onClick={() => navigate(`/conventions/${doc.id}`)}
                                    >
                                        <div className="relative z-10 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <span className="px-3 py-1 bg-[#E8E3D9] text-[#8B7355] text-[10px] font-black rounded-lg uppercase tracking-widest border border-[#D1C8B8]">
                                                    ID: {doc.id}
                                                </span>
                                                <span className="material-symbols-outlined text-gray-200 group-hover:text-[#001D3D] transition-colors">description</span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-[#001D3D] line-clamp-2 leading-tight uppercase group-hover:text-[#B68F40] transition-colors">{doc.name}</h3>
                                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider">{doc.partners || 'Institution Partenaire'}</p>
                                            </div>
                                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                                        <img src={`https://ui-avatars.com/api/?name=${doc.user?.name || 'User'}&background=random`} alt="" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-500 uppercase">{doc.user?.name || 'Porteur'}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400">{format(new Date(doc.updated_at), 'dd/MM/yyyy')}</span>
                                            </div>
                                            <button className="w-full mt-4 py-4 bg-[#001D3D] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#001D3D]/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                Examiner le dossier
                                            </button>
                                        </div>
                                        <div className="absolute -bottom-10 -right-10 text-[#001D3D]/[0.02] rotate-12 pointer-events-none">
                                            <span className="material-symbols-outlined text-[160px]">verified_user</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
                
                <AnimatePresence>
                    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </AnimatePresence>
            </div>
        );
    }

    // Default Porteur Submission Form (Same as before but cleaned up)
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#001D3D] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#001D3D]/20">
                        <span className="material-symbols-outlined text-[32px]">assignment_add</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#001D3D] tracking-tight">{t('submit_project')}</h1>
                        <p className="text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mt-1">Interface de Soumission UIDT</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session Active</p>
                        <p className="text-xs font-bold text-[#001D3D]">{user?.name}</p>
                    </div>
                    <div className="w-px h-10 bg-gray-100"></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8 items-start">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-6 group cursor-pointer" onClick={() => setStep(s)}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-300 ${step === s ? 'bg-[#001D3D] text-white shadow-2xl shadow-[#001D3D]/30 scale-110' : step > s ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-gray-50 text-gray-300 border border-gray-100 group-hover:bg-gray-100'}`}>
                                        {step > s ? <span className="material-symbols-outlined text-[20px]">check_circle</span> : s}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${step === s ? 'text-[#001D3D]' : 'text-gray-300'}`}>
                                            {s === 1 ? t('identity') : s === 2 ? t('strategy') : t('documents')}
                                        </span>
                                    </div>
                                    {s < 3 && <div className="hidden md:block w-20 h-px bg-gray-100 mx-4"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] border border-gray-100 relative"
                        >
                            {step === 1 && (
                                <div className="space-y-12">
                                    <div className="flex justify-between items-center border-l-8 border-[#001D3D] pl-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-[#001D3D] tracking-tight">{t('project_identity')}</h2>
                                            <p className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.3em] mt-2">{t('institutional_data')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('project_title_short')}</label>
                                            <input required value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} type="text" className="uidt-input w-full" placeholder="Ex: Convention Cadre UIDT - Huawei Technologies" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('cooperation_type')}</label>
                                            <select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} className="uidt-input w-full appearance-none cursor-pointer">
                                                <option value="national">Nationale</option>
                                                <option value="international">Internationale</option>
                                                <option value="regional">Régionale</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('partner_type')}</label>
                                            <input value={formData.partner_type} onChange={(e) => handleInputChange('partner_type', e.target.value)} type="text" className="uidt-input w-full" placeholder="Banque, ONG, Centre de recherche..." />
                                        </div>
                                        <div className="col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('partner_institution')}</label>
                                            <input value={formData.partners} onChange={(e) => handleInputChange('partners', e.target.value)} type="text" className="uidt-input w-full" placeholder="Nom des entités partenaires..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Date d'Entrée en Vigueur</label>
                                            <input required value={formData.start_date} onChange={(e) => handleInputChange('start_date', e.target.value)} type="date" className="uidt-input w-full" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Échéance</label>
                                            <input required value={formData.end_date} onChange={(e) => handleInputChange('end_date', e.target.value)} type="date" className="uidt-input w-full" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-12">
                                    <div className="flex justify-between items-center border-l-8 border-[#001D3D] pl-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-[#001D3D] tracking-tight">{t('strategic_details')}</h2>
                                            <p className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.3em] mt-2">Objectifs & KPI</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('year')}</label>
                                            <input value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)} type="number" className="uidt-input w-full" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('duration')}</label>
                                            <input value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)} type="text" className="uidt-input w-full" placeholder="Ex: 5 ans" />
                                        </div>
                                        <div className="col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('indicator_performance')}</label>
                                            <input value={formData.indicator} onChange={(e) => handleInputChange('indicator', e.target.value)} type="text" className="uidt-input w-full border-blue-50" placeholder="Indicateur de succès principal..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('target')}</label>
                                            <input value={formData.target} onChange={(e) => handleInputChange('target', e.target.value)} type="number" className="uidt-input w-full" placeholder="Cible numérique" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('institutional_objectives')}</label>
                                            <textarea value={formData.objectives} onChange={(e) => handleInputChange('objectives', e.target.value)} className="uidt-input w-full min-h-[120px] py-4" placeholder="Description des objectifs stratégiques..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-10 text-center">
                                    <div className="flex flex-col items-center border-b border-gray-100 pb-10">
                                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border-4 border-green-100">
                                            <span className="material-symbols-outlined text-[48px]">verified_user</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-[#001D3D]">{t('mandatory_docs')}</h2>
                                        <p className="text-sm font-bold text-gray-400 mt-2 max-w-md mx-auto">Veuillez joindre le protocole d'accord signé ou la lettre d'intention.</p>
                                    </div>
                                    <div className="border-4 border-dashed border-gray-50 rounded-[3rem] p-20 bg-gray-50/30 group hover:border-[#001D3D]/10 transition-all cursor-pointer">
                                        <span className="material-symbols-outlined text-[60px] text-gray-300 group-hover:text-[#001D3D] transition-colors">upload_file</span>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-6">Déposer les documents (PDF/Signés)</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-black/5">
                        <button type="button" onClick={() => navigate('/conventions')} className="flex items-center gap-3 text-red-400 hover:text-red-600 transition-all group px-6 py-4 rounded-2xl hover:bg-red-50">
                            <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                            <span className="text-[11px] font-black uppercase tracking-widest">{t('delete_draft')}</span>
                        </button>
                        <div className="flex items-center gap-6">
                            {step > 1 && (
                                <button type="button" onClick={() => setStep(step - 1)} className="px-10 py-5 bg-white border border-gray-100 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:text-[#001D3D] hover:bg-gray-50 transition-all">Précédent</button>
                            )}
                            {step < 3 ? (
                                <button type="button" onClick={() => setStep(step + 1)} className="px-12 py-5 bg-[#001D3D] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#002b5c] shadow-xl shadow-[#001D3D]/20 transition-all flex items-center gap-3">
                                    Continuer
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} className="px-14 py-5 bg-[#001D3D] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#002b5c] shadow-[0_20px_40px_rgba(0,29,61,0.3)] transition-all flex items-center gap-4 disabled:opacity-50">
                                    {loading ? 'Soumission...' : t('submit_final')}
                                    <span className="material-symbols-outlined text-[20px]">verified</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                     <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                            <span className="material-symbols-outlined text-[#B68F40] text-[24px]">policy</span>
                            <h3 className="text-xs font-black text-[#001D3D] uppercase tracking-[0.2em]">{t('submission_guide')}</h3>
                        </div>
                        <div className="space-y-10">
                            {[
                                { icon: 'verified', title: 'Éligibilité Stratégique', desc: 'Vérifiez l\'alignement avec les axes prioritaires de l\'UIDT.' },
                                { icon: 'fact_check', title: 'Validation Hiérarchique', desc: 'Le dossier suivra le circuit : Dir. Coopération → Rectorat.' }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-5 group">
                                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-[#001D3D] group-hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <h4 className="text-[11px] font-black text-[#001D3D] uppercase tracking-wider">{item.title}</h4>
                                        <p className="text-[10px] font-medium text-gray-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>

            <style dangerouslySetInnerHTML={{ __html: `
                .uidt-input {
                    background-color: #FBFBFB;
                    border: 2px solid #F1F3F5;
                    border-radius: 1.5rem;
                    padding: 1.25rem 1.75rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #001D3D;
                    outline: none;
                    transition: all 0.2s;
                }
                .uidt-input:focus {
                    border-color: #B68F4040;
                    background-color: white;
                    box-shadow: 0 10px 20px -10px #B68F4020;
                }
            `}} />

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default Validation;
