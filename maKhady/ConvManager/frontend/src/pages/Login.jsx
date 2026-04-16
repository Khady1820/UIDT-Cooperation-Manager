import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, ShieldCheck, Globe, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Identifiants invalides');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden">
            {/* Left Side: Visual Experience */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#001D3D]">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src="/auth-bg.png" 
                        alt="UIDT Architecture" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001D3D] via-transparent to-transparent opacity-80"></div>
                </motion.div>

                {/* Floating Elements for visual interest */}
                <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                    <motion.div 
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[20%] left-[15%] w-32 h-32 bg-[#8B7355]/20 rounded-full blur-3xl"
                    />
                    <motion.div 
                        animate={{ 
                            y: [0, 20, 0],
                            rotate: [0, -5, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[30%] right-[10%] w-48 h-48 bg-[#001D3D]/40 rounded-full blur-3xl border border-white/5"
                    />
                </div>

                <div className="relative z-20 flex flex-col justify-between p-20 w-full h-full">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                                <span className="material-symbols-outlined text-[#001D3D] text-3xl">account_balance</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white tracking-widest uppercase">UIDT</h1>
                                <p className="text-[9px] font-bold text-[#8B7355] tracking-[0.4em] uppercase">Excellence & Innovation</p>
                            </div>
                        </div>

                        <h2 className="text-5xl font-black text-white leading-[1.1] mb-8 max-w-md">
                            Gérez vos conventions avec une <span className="text-[#8B7355]">précision</span> institutionnelle.
                        </h2>
                        <p className="text-gray-300 text-sm max-w-sm leading-relaxed mb-10 font-medium opacity-80">
                            Plateforme centralisée pour la gestion, le suivi et la validation des accords de coopération de l'Université Iba Der Thiam.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: ShieldCheck, text: "Accès Sécurisé AES-256" },
                                { icon: Globe, text: "Portée Internationale & Régionale" }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + (i * 0.2) }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/10">
                                        <item.icon className="w-5 h-5 text-[#8B7355]" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="pt-10 border-t border-white/5"
                    >
                        <p className="text-[9px] font-medium text-white/40 uppercase tracking-[0.3em]">
                            © 2026 Université Iba Der Thiam de Thiès • Bureau de la Coopération
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Authentication form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 mesh-bg">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-[480px]"
                >
                    <div className="auth-glass p-12 md:p-16 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]">
                        <div className="mb-12 text-center lg:text-left">
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="inline-block px-4 py-1.5 rounded-full bg-[#001D3D]/5 text-[#8B7355] text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                            >
                                Portail Institutionnel
                            </motion.span>
                            <h3 className="text-3xl font-black text-[#001D3D] tracking-tight mb-2">Bon retour parmi nous</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Authentification sécurisée requise</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#001D3D]/40 mb-3 ml-1">
                                    Identifiant Professionnel
                                </label>
                                <div className="group relative">
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-white border border-gray-100 focus:border-[#001D3D]/10 focus:ring-8 focus:ring-[#001D3D]/5 rounded-2xl px-6 py-5 text-sm font-bold text-[#001D3D] outline-none transition-all shadow-sm group-hover:shadow-md"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@convmanager.com"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[20px] text-[#001D3D]">alternate_email</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#001D3D]/40 ml-1">
                                        Mot de passe
                                    </label>
                                    <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-[#8B7355] hover:text-[#001D3D] transition-colors uppercase tracking-widest">Oublié ?</Link>
                                </div>
                                <div className="group relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-white border border-gray-100 focus:border-[#001D3D]/10 focus:ring-8 focus:ring-[#001D3D]/5 rounded-2xl px-6 py-5 text-sm font-bold text-[#001D3D] outline-none transition-all pr-14 shadow-sm group-hover:shadow-md"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#001D3D] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-black uppercase tracking-wider flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="pt-4"
                            >
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative w-full bg-[#001D3D] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#001D3D]/20 hover:bg-[#002b5c] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden"
                                >
                                    <span className="relative z-10">{isSubmitting ? 'Authentification...' : 'Accéder au Portail'}</span>
                                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </button>
                            </motion.div>
                        </form>

                        <div className="mt-16 text-center pt-8 border-t border-gray-50">
                            <p className="text-[13px] text-gray-400 font-bold">
                                Nouveau collaborateur ?{' '}
                                <Link to="/register" className="text-[#8B7355] font-black underline decoration-2 underline-offset-4 hover:text-[#001D3D] transition-colors">
                                    Créer un profil
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center gap-12 lg:hidden">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#8B7355]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#001D3D]/40">Secured Access</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
