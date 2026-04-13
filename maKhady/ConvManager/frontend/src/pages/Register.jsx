import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '4' // Default to Porteur de Projet
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.password_confirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l’inscription');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#001D3D]/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8B7355]/5 rounded-full blur-[120px]"></div>

            <div className="relative z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-[#001D3D] text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                             <span className="material-symbols-outlined text-[#001D3D] text-4xl">account_balance</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight leading-tight mb-6">
                            Rejoignez la <br/> Plateforme UIDT
                        </h2>
                        <p className="text-[#8B7355] font-bold text-sm uppercase tracking-[0.2em] mb-12">Portail de Coopération</p>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-[#8B7355]">check_circle</span>
                                <div>
                                    <p className="font-bold text-sm uppercase tracking-wide">Gestion de Projet</p>
                                    <p className="text-gray-400 text-xs mt-1">Soumettez et suivez vos conventions en temps réel.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="material-symbols-outlined text-[#8B7355]">check_circle</span>
                                <div>
                                    <p className="font-bold text-sm uppercase tracking-wide">Audit & Transparence</p>
                                    <p className="text-gray-400 text-xs mt-1">Suivi complet des validations hiérarchiques.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/10">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">© 2026 UIDT THIÈS</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 md:p-16">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-[#001D3D] tracking-tight">{t('register')}</h1>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest leading-loose">Création de profil institutionnel</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nom complet</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Dr. Prénom Nom"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Adresse Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-gray-50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="nom@uidt.sn"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-gray-50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none transition-all pr-14"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#001D3D] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirmation</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-gray-50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none transition-all pr-14"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#001D3D] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Rôle souhaité</label>
                            <select
                                className="w-full bg-gray-50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-2xl px-6 py-4 text-sm font-medium outline-none transition-all appearance-none cursor-pointer"
                                value={formData.role_id}
                                onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                            >
                                <option value="4">Porteur de Projet</option>
                                <option value="3">Partenaire Externe</option>
                            </select>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-[#001D3D] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#002b5c] transition-all shadow-2xl shadow-[#001D3D]/30 active:scale-95"
                            >
                                Créer mon Compte
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-gray-50">
                        <p className="text-[13px] text-gray-400 font-bold">
                            Déjà membre ?{' '}
                            <Link to="/login" className="text-[#8B7355] hover:text-[#001D3D] transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
