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

    const isValidator = user?.role?.name !== 'porteur_projet';

    useEffect(() => {
        fetchPendingDossiers();
    }, [user, isValidator]);

    const fetchPendingDossiers = async () => {
        setFetching(true);
        try {
            // If validator, fetch all pending. If porteur, fetch own non-draft.
            const endpoint = '/conventions?pending=1';
            const res = await api.get(endpoint);
            setPendingDossiers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newFormData = { ...prev, [field]: value };
            
            // Auto-calculate duration if start_date or end_date changes
            if (field === 'start_date' || field === 'end_date') {
                const startVal = field === 'start_date' ? value : prev.start_date;
                const endVal = field === 'end_date' ? value : prev.end_date;
                
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
            return newFormData;
        });
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

    return (
        <div className="space-y-8">
            <div className="bg-[#001D3D] p-10 rounded-3xl shadow-xl flex justify-between items-center text-white">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">fact_check</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isValidator ? 'Espace de Validation' : 'Mes Dossiers en Validation'}
                        </h1>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                            {user?.role?.name?.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    {(user?.role?.name === 'porteur_projet' || user?.role?.name === 'admin') && (
                        <button 
                            onClick={() => navigate('/conventions?new=true')}
                            className="px-6 py-3 bg-white text-[#001D3D] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Nouvelle Soumission
                        </button>
                    )}
                    <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest">{pendingDossiers.length} Dossiers</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {fetching ? (
                    <div className="p-20 text-center bg-white rounded-3xl border border-gray-100 italic text-gray-400">Chargement...</div>
                ) : pendingDossiers.length === 0 ? (
                    <div className="p-32 text-center bg-white rounded-3xl border border-gray-100 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                            <span className="material-symbols-outlined text-[40px]">check_circle</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#001D3D]">Aucun dossier en attente</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {pendingDossiers.map((doc) => (
                                <motion.div 
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
                                    onClick={() => navigate(`/conventions/${doc.id}`)}
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase">ID: {doc.id}</span>
                                            <span className="material-symbols-outlined text-gray-200">description</span>
                                        </div>
                                        <h3 className="text-md font-bold text-[#001D3D] line-clamp-2 leading-tight uppercase">{doc.name}</h3>
                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{doc.user?.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400">{format(new Date(doc.updated_at), 'dd/MM/yyyy')}</span>
                                        </div>
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
};

export default Validation;
