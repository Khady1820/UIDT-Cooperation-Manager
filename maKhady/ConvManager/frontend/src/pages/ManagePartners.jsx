import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Trash2, Edit2, Globe, Phone, MapPin, Mail } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';

const ManagePartners = () => {
    const { t } = useLanguage();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDossiersModalOpen, setIsDossiersModalOpen] = useState(false);
    const [currentPartner, setCurrentPartner] = useState(null);
    const [partnerConventions, setPartnerConventions] = useState([]);
    const [loadingConventions, setLoadingConventions] = useState(false);
    const { setSearchQuery } = useSearch();
    const navigate = useNavigate();
    
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

    const countries = [
        { name: 'Sénégal', dial: '+221', code: 'SN' },
        { name: 'France', dial: '+33', code: 'FR' },
        { name: 'États-Unis', dial: '+1', code: 'US' },
        { name: 'Canada', dial: '+1', code: 'CA' },
        { name: 'Maroc', dial: '+212', code: 'MA' },
        { name: 'Côte d\'Ivoire', dial: '+225', code: 'CI' },
        { name: 'Mali', dial: '+223', code: 'ML' },
        { name: 'Burkina Faso', dial: '+226', code: 'BF' },
        { name: 'Bénin', dial: '+229', code: 'BJ' },
        { name: 'Guinée', dial: '+224', code: 'GN' },
        { name: 'Togo', dial: '+228', code: 'TG' },
        { name: 'Gabon', dial: '+241', code: 'GA' },
        { name: 'Cameroun', dial: '+237', code: 'CM' },
        { name: 'Mauritanie', dial: '+222', code: 'MR' },
        { name: 'Espagne', dial: '+34', code: 'ES' },
        { name: 'Italie', dial: '+39', code: 'IT' },
        { name: 'Allemagne', dial: '+49', code: 'DE' },
        { name: 'Royaume-Uni', dial: '+44', code: 'GB' },
        { name: 'Chine', dial: '+86', code: 'CN' },
        { name: 'Turquie', dial: '+90', code: 'TR' },
        { name: 'Brésil', dial: '+55', code: 'BR' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

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

    // Filter Logic
    const filteredPartners = partners.filter(partner => {
        const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             partner.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || partner.type === filterType;
        return matchesSearch && matchesType;
    });

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

    const handleViewDossiers = async (partner) => {
        setCurrentPartner(partner);
        setLoadingConventions(true);
        setIsDossiersModalOpen(true);
        try {
            const res = await api.get('/conventions');
            // Filter conventions where the partners field contains the partner name
            const filtered = res.data.filter(c => 
                (c.partners || '').toLowerCase().includes(partner.name.toLowerCase())
            );
            setPartnerConventions(filtered);
        } catch (error) {
            console.error("Erreur lors de la récupération des dossiers", error);
        } finally {
            setLoadingConventions(false);
        }
    };

    const handleCloseDossiersModal = () => {
        setIsDossiersModalOpen(false);
        setPartnerConventions([]);
    };

    // Pagination removed as per user request

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
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
                    <div className="flex items-center gap-4 mb-2">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-150 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[#2E2F7F] dark:text-white group-hover:scale-110 transition-transform duration-150 text-sm">arrow_back</span>
                            <span className="text-[9px] font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest">Retour</span>
                        </button>
                        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                        <h1 className="text-xl font-black text-surface-900 dark:text-white tracking-tight uppercase tracking-widest">{t('manage_partners')}</h1>
                    </div>
                    <p className="text-surface-500 dark:text-slate-400 font-medium italic">Gestion du réseau institutionnel et des institutions partenaires.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#1a1b5c] transition-all shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un Partenaire
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1 w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold dark:text-white"
                    />
                </div>
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full md:w-64 px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-black uppercase tracking-widest appearance-none cursor-pointer dark:text-white"
                >
                    <option value="all">Tous les types</option>
                    {partnerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800">
                        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
                        <p className="mt-6 text-sm font-black text-primary dark:text-white uppercase tracking-widest opacity-40">Synchronisation du réseau...</p>
                    </div>
                ) : filteredPartners.length === 0 ? (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 opacity-20 grayscale dark:invert">
                        <Building2 className="w-16 h-16 text-surface-400 dark:text-slate-400" />
                        <p className="mt-6 text-base font-black text-surface-900 dark:text-white uppercase tracking-widest">Aucun partenaire trouvé</p>
                    </div>
                ) : (
                    filteredPartners.map((partner) => (
                        <motion.div 
                            layout
                            key={partner.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary/5 dark:hover:shadow-black/20 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-surface-alt dark:bg-white/5 flex items-center justify-center text-primary dark:text-white text-xl font-black shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        {partner.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        partner.type === 'International' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900' :
                                        partner.type === 'Public' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900' :
                                        'bg-surface-alt dark:bg-white/5 text-surface-500 dark:text-slate-400 border border-outline-variant dark:border-slate-800'
                                    }`}>
                                        {partner.type}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-base font-black text-surface-900 dark:text-white tracking-tight leading-tight group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors uppercase">{partner.name}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Globe className="w-3.5 h-3.5 text-primary dark:text-indigo-400" />
                                            <span className="text-[10px] font-black text-surface-400 dark:text-slate-500 uppercase tracking-widest">{partner.country || 'Sénégal'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-surface-500 dark:text-slate-400">
                                            <div className="w-7 h-7 rounded-full bg-surface-alt dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <Mail className="w-3.5 h-3.5 text-primary dark:text-indigo-400 opacity-60" />
                                            </div>
                                            <span className="text-[10px] font-bold truncate max-w-[200px]">{partner.email || 'Email non renseigné'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-surface-500 dark:text-slate-400">
                                            <div className="w-7 h-7 rounded-full bg-surface-alt dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <Phone className="w-3.5 h-3.5 text-primary dark:text-indigo-400 opacity-60" />
                                            </div>
                                            <span className="text-[10px] font-bold">{partner.telephone || 'Contact non renseigné'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-surface-500 dark:text-slate-400">
                                            <div className="w-7 h-7 rounded-full bg-surface-alt dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <MapPin className="w-3.5 h-3.5 text-primary dark:text-indigo-400 opacity-60" />
                                            </div>
                                            <span className="text-[10px] font-bold truncate max-w-[200px]">{partner.address || 'Adresse non renseignée'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-outline-variant dark:border-white/10 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(partner)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-alt dark:bg-white/5 text-surface-400 dark:text-slate-500 hover:text-primary dark:hover:text-white hover:bg-primary/10 transition-all active:scale-90"
                                            title="Modifier"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePartner(partner.id)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-alt dark:bg-white/5 text-surface-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleViewDossiers(partner)}
                                        className="text-[10px] font-black text-surface-400 dark:text-slate-500 uppercase tracking-widest hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1 group/btn"
                                    >
                                        Dossiers
                                        <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
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
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Nom de l'Organisation</label>
                            <input 
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-base font-bold"
                                placeholder="ex: Université de Paris"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Type de Partenariat</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-base font-bold appearance-none"
                            >
                                {partnerTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Email Contact</label>
                            <div className="relative">
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-base font-bold"
                                    placeholder="contact@organisation.com"
                                />
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Téléphone</label>
                            <div className="flex gap-2">
                                <select 
                                    className="w-28 px-4 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-sm font-black uppercase appearance-none cursor-pointer"
                                    onChange={(e) => {
                                        const prefix = e.target.value;
                                        const parts = formData.telephone.split(' ');
                                        const currentNumber = parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
                                        setFormData({...formData, telephone: `${prefix} ${currentNumber}`});
                                    }}
                                    value={formData.telephone.split(' ')[0].startsWith('+') ? formData.telephone.split(' ')[0] : '+221'}
                                >
                                    {countries.map(c => <option key={c.code} value={c.dial}>{c.dial} ({c.code})</option>)}
                                </select>
                                <div className="relative flex-1">
                                    <input 
                                        type="text"
                                        value={formData.telephone.split(' ').length > 1 ? formData.telephone.split(' ').slice(1).join(' ') : formData.telephone}
                                        onChange={(e) => {
                                            const prefix = formData.telephone.split(' ')[0].startsWith('+') ? formData.telephone.split(' ')[0] : '+221';
                                            setFormData({...formData, telephone: `${prefix} ${e.target.value}`});
                                        }}
                                        className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-base font-bold"
                                        placeholder="123 45 67 89"
                                    />
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Pays</label>
                            <div className="relative">
                                <select 
                                    value={formData.country}
                                    onChange={(e) => {
                                        const selected = countries.find(c => c.name === e.target.value);
                                        setFormData({
                                            ...formData, 
                                            country: e.target.value,
                                            telephone: selected ? `${selected.dial} ${formData.telephone.split(' ').slice(1).join(' ')}` : formData.telephone
                                        });
                                    }}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-base font-bold appearance-none cursor-pointer"
                                >
                                    <option value="">Choisir un pays</option>
                                    {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                                </select>
                                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Adresse Siège</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-all text-base font-bold"
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
                            className="px-8 py-4 text-sm font-black uppercase tracking-widest text-surface-500 hover:bg-surface-50 rounded-xl transition-all"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            type="submit"
                            className="px-10 py-4 bg-secondary text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-secondary/20 hover:scale-105 transition-all"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* Partner Dossiers Modal */}
            <AdminModal
                isOpen={isDossiersModalOpen}
                onClose={handleCloseDossiersModal}
                title={`Dossiers - ${currentPartner?.name}`}
            >
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {loadingConventions ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-3 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                            <p className="mt-4 text-[10px] font-black text-primary uppercase tracking-widest opacity-40">Chargement des dossiers...</p>
                        </div>
                    ) : partnerConventions.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
                            <Building2 className="w-12 h-12 text-gray-300 dark:text-white/10" />
                            <p className="mt-4 text-xs font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest text-center px-8">
                                Aucun dossier enregistré pour ce partenaire pour le moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {partnerConventions.map((conv) => (
                                <div 
                                    key={conv.id}
                                    onClick={() => navigate(`/conventions/${conv.id}`)}
                                    className="group/item flex items-center justify-between p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-primary dark:text-indigo-400 uppercase tracking-widest opacity-60">
                                            #{conv.num_dossier || conv.id}
                                        </span>
                                        <h4 className="text-sm font-black text-surface-900 dark:text-white group-hover/item:text-primary transition-colors uppercase truncate max-w-[250px]">
                                            {conv.name}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[9px] font-bold text-surface-400 dark:text-slate-500 italic">
                                                Expire le: {conv.end_date}
                                            </span>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    conv.status === 'termine' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                                                    conv.status === 'archive' ? 'bg-gray-400' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                                }`} />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 dark:text-slate-500">
                                                    {conv.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-surface-alt dark:bg-white/5 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-8 pt-6 border-t border-outline-variant dark:border-white/10 flex justify-end">
                    <button 
                        onClick={handleCloseDossiersModal}
                        className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-surface-500 hover:bg-surface-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                        Fermer
                    </button>
                </div>
            </AdminModal>
        </motion.div>
    );
};

export default ManagePartners;
