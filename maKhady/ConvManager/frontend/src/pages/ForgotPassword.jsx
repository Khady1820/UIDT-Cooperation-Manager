import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import { ArrowLeft, Mail, Send } from 'lucide-react';

const ForgotPassword = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post('http://localhost:8000/api/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 mesh-bg overflow-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2E2F7F]/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F7931E]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[460px]"
            >
                <div className="auth-glass p-10 md:p-14 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)]">
                    <div className="mb-10 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F7931E] hover:text-[#2E2F7F] transition-colors mb-8 group mx-auto">
                            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                            Retour à la connexion
                        </Link>
                        
                        <div className="w-20 h-20 bg-[#2E2F7F] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#2E2F7F]/20">
                            <span className="material-symbols-outlined text-white text-4xl">lock_reset</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#2E2F7F] tracking-tight mb-2">Récupération</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Réinitialisez votre accès sécurisé</p>
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-[11px] font-black uppercase text-center tracking-wider"
                            >
                                {message}
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

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#2E2F7F]/40 ml-1">Email Académique</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white border border-gray-100 focus:border-[#2E2F7F]/10 focus:ring-8 focus:ring-[#2E2F7F]/5 rounded-2xl px-6 py-5 text-sm font-bold text-[#2E2F7F] outline-none transition-all shadow-sm group-hover:shadow-md"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votreemail@uidt.sn"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                    <Mail className="w-5 h-5 text-[#2E2F7F]" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full bg-[#2E2F7F] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#2E2F7F]/20 hover:bg-[#002b5c] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 overflow-hidden"
                        >
                            <span className="relative z-10">{loading ? "Envoi..." : "Envoyer le lien"}</span>
                            {!loading && <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </form>
                </div>

                <div className="mt-16 text-center opacity-30">
                    <p className="text-[9px] font-black text-[#2E2F7F] uppercase tracking-[0.4em]">
                        Bureau de la Coopération Institutionnelle • UIDT
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
