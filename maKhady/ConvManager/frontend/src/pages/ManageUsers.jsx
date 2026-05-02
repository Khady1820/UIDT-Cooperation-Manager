import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Edit2, Shield, Mail, Key, Eye, EyeOff } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ManageUsers = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); 
    const [userToDelete, setUserToDelete] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: 3 // Default: porteur_projet
    });

    const [roles] = useState([
        { id: 1, name: 'admin' },
        { id: 3, name: 'porteur_projet' },
        { id: 4, name: 'directeur_cooperation' },
        { id: 5, name: 'recteur' },
        { id: 7, name: 'service_juridique' },
        { id: 8, name: 'chef_division' }
    ]);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (user) => {
        try {
            await api.put(`/users/${user.id}`, {
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                is_active: !user.is_active
            });
            fetchUsers();
        } catch (error) {
            alert("Erreur lors de la modification du statut");
        }
    };

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role?.name === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '', 
                role_id: user.role_id,
                is_active: user.is_active
            });
        } else {
            setCurrentUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role_id: 3,
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
        setShowPassword(false);
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                // Edit
                await api.put(`/users/${currentUser.id}`, formData);
            } else {
                // Add
                await api.post('/users', formData);
            }
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            alert(error.response?.data?.message || "Une erreur est survenue");
        }
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/users/${userToDelete.id}`);
            fetchUsers();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    // Pagination removed as per user request

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
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-150 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[#2E2F7F] dark:text-white group-hover:scale-110 transition-transform duration-150 text-sm">arrow_back</span>
                            <span className="text-[9px] font-black text-[#2E2F7F] dark:text-white uppercase tracking-widest">Retour</span>
                        </button>
                        <div className="h-4 w-px bg-gray-200 dark:bg-slate-700"></div>
                        <h1 className="text-lg font-black text-surface-900 dark:text-white tracking-tight uppercase tracking-widest">{t('manage_users')}</h1>
                    </div>
                    <p className="text-[9px] text-surface-500 dark:text-slate-400 font-bold uppercase tracking-wider italic">Administration des accès et des rôles institutionnels.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="premium-button flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    Ajouter un utilisateur
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
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full md:w-64 px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-black uppercase tracking-widest appearance-none cursor-pointer dark:text-white"
                >
                    <option value="all">Tous les rôles</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>{t(`role_${role.name}`)}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-surface-400 italic font-bold">
                        Aucun utilisateur trouvé.
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredUsers.map((user, idx) => (
                            <motion.div 
                                key={user.id} 
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="premium-card p-8 group relative overflow-hidden flex flex-col justify-between h-full"
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-surface-alt dark:bg-white/5 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-500 overflow-hidden">
                                            {user.avatar_url ? (
                                                <img 
                                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${user.avatar_url}`} 
                                                    alt={user.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary dark:text-white text-2xl font-black group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-surface-300 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Système</span>
                                            <span className="text-[10px] font-black text-primary dark:text-indigo-400 uppercase tracking-widest bg-primary/5 dark:bg-indigo-900/20 px-2 py-1 rounded-md">ID: #{user.id}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-black text-surface-900 dark:text-white tracking-tight leading-tight group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors uppercase">{user.name}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                <span className="text-[9px] font-black text-surface-400 dark:text-slate-500 uppercase tracking-widest">
                                                    {user.is_active ? 'Actif sur le portail' : 'Compte désactivé'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-fit px-3 py-1.5 bg-surface-alt/50 dark:bg-white/5 border border-outline-variant dark:border-white/10 rounded-xl group-hover:border-primary/20 transition-colors">
                                            <Shield className="w-3 h-3 text-primary dark:text-indigo-400" />
                                            <span className="text-[10px] font-black text-surface-900 dark:text-slate-300 uppercase tracking-widest">
                                                {t(`role_${user.role?.name || 'user'}`)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 text-surface-500 dark:text-slate-400">
                                            <div className="w-7 h-7 rounded-full bg-surface-alt dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <Mail className="w-3.5 h-3.5 text-primary dark:text-indigo-400 opacity-60" />
                                            </div>
                                            <span className="text-[10px] font-bold truncate max-w-[150px]">{user.email}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-surface-400 dark:text-slate-500 pt-2 border-t border-gray-50 dark:border-white/5">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[16px] opacity-40">history</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-tight italic">
                                                {user.last_login_at 
                                                    ? `Dernière connexion : ${format(new Date(user.last_login_at), 'dd/MM/yyyy HH:mm', { locale: fr })}`
                                                    : 'Aucune connexion enregistrée'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-outline-variant dark:border-white/10 flex items-center justify-between relative z-10">
                                    <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(user)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-alt dark:bg-white/5 text-surface-400 dark:text-slate-500 hover:text-primary dark:hover:text-white hover:bg-primary/10 transition-all active:scale-90"
                                                title="Modifier"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(user)}
                                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 ${user.is_active ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 hover:bg-orange-100' : 'bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100'}`}
                                                title={user.is_active ? "Désactiver" : "Activer"}
                                            >
                                                <span className="material-symbols-outlined text-base">{user.is_active ? 'block' : 'check_circle'}</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-alt dark:bg-white/5 text-surface-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                    </div>
                                    <button 
                                        className="text-[10px] font-black text-surface-400 dark:text-slate-500 uppercase tracking-widest hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1 group/btn"
                                        onClick={() => handleOpenModal(user)}
                                    >
                                        Gérer l'accès
                                        <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>

                                {/* Decorative Background Element */}
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>



            {/* Admin Form Modal */}
            <AdminModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={currentUser ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}
            >
                <form onSubmit={handleSubmitUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Nom Complet</label>
                            <input 
                                type="text"
                                required
                                autoComplete="off"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-base font-bold"
                                placeholder="Saisissez le nom complet"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Email Académique</label>
                            <input 
                                type="email"
                                required
                                autoComplete="off"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-base font-bold"
                                placeholder="adresse.email@uidt.sn"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Rôle Institutionnel</label>
                            <select 
                                value={formData.role_id}
                                onChange={(e) => setFormData({...formData, role_id: parseInt(e.target.value)})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-base font-bold appearance-none"
                            >
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {t(`role_${role.name}`)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-400 uppercase tracking-widest">
                                {currentUser ? "Mot de passe (Laisser vide pour ne pas changer)" : "Mot de passe"}
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required={!currentUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-base font-bold pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {currentUser && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <input 
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor="is_active" className="text-sm font-black text-surface-700 uppercase tracking-widest cursor-pointer">
                                Compte Actif
                            </label>
                        </div>
                    )}

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
                            className="px-10 py-4 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* Delete Confirmation Modal */}
            <AdminModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                title="Confirmer la suppression"
            >
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="w-10 h-10 text-red-500" />
                    </div>
                    <p className="text-surface-600 font-medium">
                        Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-black text-surface-900 uppercase tracking-tight">{userToDelete?.name}</span> ? 
                        <br />Cette action est irréversible.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 px-8 py-4 text-sm font-black uppercase tracking-widest text-surface-500 hover:bg-surface-50 rounded-xl transition-all"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 px-8 py-4 bg-red-500 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </AdminModal>
        </motion.div>
    );
};

export default ManageUsers;
