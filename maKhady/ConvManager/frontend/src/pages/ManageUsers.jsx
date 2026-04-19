import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Edit2, Shield, Mail, Key, Eye, EyeOff } from 'lucide-react';
import AdminModal from '../components/AdminModal';

const ManageUsers = () => {
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

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Password stays empty unless changing
                role_id: user.role_id
            });
        } else {
            setCurrentUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role_id: 3
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

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight uppercase tracking-widest">{t('manage_users')}</h1>
                    <p className="text-surface-500 font-medium italic">Gérez les accès et les rôles institutionnels des collaborateurs.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="premium-button flex items-center gap-2 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    Ajouter un utilisateur
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <p className="mt-4 text-surface-400 font-bold uppercase tracking-widest text-[10px]">{t('loading')}</p>
                    </div>
                ) : (
                    users.map((user) => (
                        <motion.div key={user.id} variants={itemVariants} className="bg-card-bg rounded-2xl p-6 border border-outline-variant shadow-premium group hover:border-primary/30 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl transition-all group-hover:bg-primary/10"></div>
                            
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-surface-alt flex items-center justify-center text-primary font-black text-xl shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(user)}
                                            className="p-2 text-surface-300 hover:text-primary transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user)}
                                            className="p-2 text-surface-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-surface-900 truncate">{user.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-surface-500">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span className="text-xs font-medium">{user.email}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 border-t border-outline-variant flex items-center justify-between">
                                    <span className="flex items-center gap-2 px-3 py-1 bg-surface-alt rounded-full">
                                        <Shield className="w-3 h-3 text-secondary" />
                                        <span className="text-[9px] font-black text-surface-900 uppercase tracking-widest">
                                            {t(`role_${user.role?.name || 'user'}`)}
                                        </span>
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: #{user.id}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
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
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Nom Complet</label>
                            <input 
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold"
                                placeholder="ex: Jean Dupont"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Email Académique</label>
                            <input 
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold"
                                placeholder="ex: jean.dupont@uidt.sn"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Rôle Institutionnel</label>
                            <select 
                                value={formData.role_id}
                                onChange={(e) => setFormData({...formData, role_id: parseInt(e.target.value)})}
                                className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold appearance-none"
                            >
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {t(`role_${role.name}`)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                                {currentUser ? "Mot de passe (Laisser vide pour ne pas changer)" : "Mot de passe"}
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required={!currentUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-5 py-4 bg-surface-50 border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-bold pr-12"
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
                            className="px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
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
                            className="flex-1 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-surface-500 hover:bg-surface-50 rounded-xl transition-all"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 px-8 py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
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
