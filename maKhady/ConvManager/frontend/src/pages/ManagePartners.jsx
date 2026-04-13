import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Building2, Plus, Trash2, Edit2, Globe, Phone, MapPin, Mail } from 'lucide-react';
import AdminModal from '../components/AdminModal';

const ManagePartners = () => {
    const { t } = useLanguage();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPartner, setCurrentPartner] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Académique',
        email: '',
        telephone: '',
        address: '',
        country: ''
    });

    const partnerTypes = ['Académique', 'Privé', 'Public', 'ONG', 'International'];

    const fetchPartners = async () => {
        try {
            const res = await api.get('/partners');
            setPartners(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des partenaires", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleOpenModal = (partner = null) => {
        if (partner) {
            setCurrentPartner(partner);
            setFormData({
                name: partner.name,
                type: partner.type || 'Académique',
                email: partner.email || '',
                telephone: partner.telephone || '',
                address: partner.address || '',
                country: partner.country || ''
            });
        } else {
            setCurrentPartner(null);
            setFormData({
                name: '',
                type: 'Académique',
                email: '',
                telephone: '',
                address: '',
                country: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPartner(null);
    };

    const handleSubmitPartner = async (e) => {
        e.preventDefault();
        try {
            if (currentPartner) {
                await api.put(`/partners/${currentPartner.id}`, formData);
            } else {
                await api.post('/partners', formData);
            }
            fetchPartners();
            handleCloseModal();
        } catch (error) {
            alert(error.response?.data?.message || "Une erreur est survenue");
        }
    };

    const handleDeletePartner = async (id) => {
        if (!window.confirm("Supprimer ce partenaire ?")) return;
        try {
            await api.delete(`/partners/${id}`);
            fetchPartners();
        } catch (error) {
            alert(error.response?.data?.message || "Une erreur est survenue");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight uppercase tracking-widest">{t('manage_partners')}</h1>
                    <p className="text-surface-500 font-medium italic">Gérez l'écosystème de partenaires institutionnels et stratégiques.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="premium-button flex items-center gap-2 px-8 py-4 bg-secondary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un partenaire
                </button>
            </div>

            <div className="bg-card-bg rounded-[2.5rem] border border-outline-variant shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-surface-50/50 border-b border-outline-variant">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Partenaire</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Type</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Localisation</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : partners.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-surface-400 italic font-bold">
                                        Aucun partenaire enregistré.
                                    </td>
                                </tr>
                            ) : partners.map((partner) => (
                                <motion.tr key={partner.id} variants={itemVariants} className="hover:bg-surface-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center text-secondary shadow-sm">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-surface-900 tracking-tight leading-none">{partner.name}</span>
                                                <span className="text-[10px] font-medium text-surface-400 mt-1">{partner.email || 'Pas d\'email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-surface-alt text-surface-900 text-[9px] font-black uppercase tracking-widest rounded-full border border-outline-variant">
                                            {partner.type || 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-surface-600">
                                                <Globe className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">{partner.country || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-surface-400">
                                                <MapPin className="w-3 h-3" />
                                                <span className="text-[10px] truncate max-w-[150px]">{partner.address || 'Non spécifiée'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-surface-600 font-bold">
                                            <Phone className="w-3.5 h-3.5 text-secondary" />
                                            <span className="text-xs font-black">{partner.telephone || '--'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleOpenModal(partner)}
                                                className="p-2 text-surface-400 hover:text-secondary transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeletePartner(partner.id)}
                                                className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Partner Form Modal */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={currentPartner ? "Modifier le partenaire" : "Nouveau Partenaire"}
            >
                <form onSubmit={handleSubmitPartner} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Nom de l'Organisation</label>
                            <input 
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-sm font-bold"
                                placeholder="ex: Université de Paris"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Type de Partenariat</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-sm font-bold appearance-none"
                            >
                                {partnerTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Email Contact</label>
                            <div className="relative">
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-sm font-bold"
                                    placeholder="contact@organisation.com"
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Téléphone</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-sm font-bold"
                                    placeholder="+33 1 23 45 67 89"
                                />
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Pays</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-sm font-bold"
                                    placeholder="ex: France"
                                />
                                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Adresse Siège</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-sm font-bold"
                                    placeholder="ex: 12 Rue des Ecoles, Paris"
                                />
                                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-outline-variant flex justify-end gap-4">
                        <button 
                            type="button"
                            onClick={handleCloseModal}
                            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-surface-500 hover:bg-surface-50 rounded-xl transition-all"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            type="submit"
                            className="px-10 py-4 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-secondary/20 hover:scale-105 transition-all"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </AdminModal>
        </motion.div>
    );
};

export default ManagePartners;
