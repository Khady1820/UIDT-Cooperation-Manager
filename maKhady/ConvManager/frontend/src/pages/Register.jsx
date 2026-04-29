import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, UserPlus, CheckCircle2, ArrowLeft } from 'lucide-react';

const Register = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '3' // Default to Porteur de Projet
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, register } = useAuth();

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.password_confirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        setIsSubmitting(true);
        try {
            await register(formData);
            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l’inscription');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden">
            {/* Right Side: Authentication form (Flipped order for variety but maintaining style) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 mesh-bg order-2 lg:order-1">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[540px]"
                >
                    <div className="auth-glass p-10 md:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]">
                        <div className="mb-10">
                            <div className="mb-6">
                                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F7931E] hover:text-[#2E2F7F] transition-colors group">
                                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                    Retour à l'accueil
                                </Link>
                            </div>

                            <h3 className="text-4xl font-black text-black tracking-tight mb-4">Créer un compte</h3>
                            <p className="text-sm font-black text-gray-600 uppercase tracking-widest leading-loose">Espace réservé aux porteurs de projets</p>

                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase tracking-wider text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1.5">
                                <label className="block text-[12px] font-black uppercase tracking-[0.2em] text-black ml-1">Nom complet</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border-2 border-gray-200 focus:border-black focus:ring-8 focus:ring-black/5 rounded-2xl px-6 py-4 text-base font-black text-black outline-none transition-all shadow-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Prénom Nom"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[12px] font-black uppercase tracking-[0.2em] text-black ml-1">Adresse Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white border-2 border-gray-200 focus:border-black focus:ring-8 focus:ring-black/5 rounded-2xl px-6 py-4 text-base font-black text-black outline-none transition-all shadow-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="nom@uidt.sn"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="block text-[12px] font-black uppercase tracking-[0.2em] text-black ml-1">Mot de passe</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full bg-white border-2 border-gray-200 focus:border-black focus:ring-8 focus:ring-black/5 rounded-2xl px-6 py-4 text-base font-black text-black outline-none transition-all pr-14 shadow-sm"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2E2F7F] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[12px] font-black uppercase tracking-[0.2em] text-black ml-1">Confirmation</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full bg-white border-2 border-gray-200 focus:border-black focus:ring-8 focus:ring-black/5 rounded-2xl px-6 py-4 text-base font-black text-black outline-none transition-all pr-14 shadow-sm"
                                            value={formData.password_confirmation}
                                            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2E2F7F] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[12px] font-black uppercase tracking-[0.2em] text-black ml-1">Rôle</label>
                                <div className="w-full bg-gray-100 border-2 border-gray-200 rounded-2xl px-6 py-4 text-base font-black text-black shadow-sm">
                                    Porteur de Projet
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#2E2F7F] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#002b5c] transition-all shadow-2xl shadow-[#2E2F7F]/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    {isSubmitting ? 'Création...' : 'Créer mon Compte'}
                                </button>

                            </div>
                        </form>

                        <div className="mt-10 text-center pt-8 border-t border-gray-50">
                            <p className="text-[13px] text-gray-400 font-bold">
                                Déjà un compte ?{' '}
                                <Link to="/login" className="text-[#F7931E] font-black underline decoration-2 underline-offset-4 hover:text-[#2E2F7F] transition-colors">
                                    Se connecter
                                </Link>
                            </p>
                        </div>

                    </div>
                </motion.div>
            </div>

            {/* Left Side: Visual Experience */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2E2F7F] order-1 lg:order-2">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src="/img_uidt.jpg" 
                        alt="UIDT Architecture" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2E2F7F] via-transparent to-transparent opacity-80"></div>
                </motion.div>

                <div className="relative z-20 flex flex-col justify-center p-20 w-full h-full text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="space-y-10"
                    >
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center border border-white/20">
                            <span className="material-symbols-outlined text-4xl text-[#F7931E]">how_to_reg</span>
                        </div>
                        
                        <div>
                            <h2 className="text-5xl font-black leading-[1.1] mb-6">
                                Construisons l'avenir <br/> de la <span className="text-[#F7931E]">coopération</span>.
                            </h2>
                            <p className="text-white text-lg max-w-sm leading-relaxed font-black opacity-100">
                                Rejoignez plus de 50 porteurs de projets et partenaires institutionnels qui façonnent le rayonnement de l'UIDT à travers le monde.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                "Soumission simplifiée",
                                "Suivi transparent",
                                "Archives centralisées"
                            ].map((text, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + (i * 0.2) }}
                                    className="flex items-center gap-4 group"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-[#F7931E]" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;
