import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
    const { t } = useLanguage();
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const email = query.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post('http://localhost:8000/api/reset-password', {
                email,
                token,
                password,
                password_confirmation: passwordConfirmation
            });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 mesh-bg text-center font-sans">
                <div className="auth-glass p-12 rounded-[3.5rem] shadow-2xl max-w-md border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2E2F7F] mb-4 text-balance">Lien de réinitialisation invalide ou expiré.</h3>
                    <p className="text-sm font-bold text-gray-400 mb-8 lowercase tracking-tight">Veuillez effectuer une nouvelle demande de récupération.</p>
                    <Link to="/login" className="px-8 py-4 bg-[#2E2F7F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#2E2F7F]/20 hover:bg-[#002b5c] transition-all inline-block">Retour à la connexion</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 mesh-bg overflow-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2E2F7F]/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F7931E]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[480px]"
            >
                <div className="auth-glass p-10 md:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]">
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-[#2E2F7F] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#2E2F7F]/20">
                            <span className="material-symbols-outlined text-white text-4xl">lock_open</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#2E2F7F] tracking-tight mb-2">Réinitialisation</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Définissez votre nouveau mot de passe</p>
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-[11px] font-black uppercase text-center tracking-widest flex items-center justify-center gap-3"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {message}. Redirection...
                            </motion.div>
                        )}

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase text-center tracking-wider"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 border-b border-gray-100 pb-4 text-center">
                            Compte : <span className="text-[#F7931E] ml-2">{email}</span>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#2E2F7F]/40 ml-1">Nouveau mot de passe</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-white border border-gray-100 focus:border-[#2E2F7F]/10 focus:ring-8 focus:ring-[#2E2F7F]/5 rounded-2xl px-6 py-5 text-sm font-bold text-[#2E2F7F] outline-none transition-all pr-14 shadow-sm group-hover:shadow-md"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2E2F7F] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#2E2F7F]/40 ml-1">Confirmation</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-white border border-gray-100 focus:border-[#2E2F7F]/10 focus:ring-8 focus:ring-[#2E2F7F]/5 rounded-2xl px-6 py-5 text-sm font-bold text-[#2E2F7F] outline-none transition-all shadow-sm focus:bg-white"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full bg-[#2E2F7F] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#2E2F7F]/20 hover:bg-[#002b5c] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden"
                            >
                                <Lock className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">{loading ? "Chargement..." : "Réinitialiser maintenant"}</span>
                                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-16 text-center opacity-30">
                    <p className="text-[9px] font-black text-[#2E2F7F] uppercase tracking-[0.4em]">
                        Sécurité Institutionnelle UIDT • Thiès
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
