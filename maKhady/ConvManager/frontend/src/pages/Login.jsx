import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Identifiants invalides');
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden font-sans p-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10 text-center"
            >
                <div className="w-16 h-16 bg-[#001D3D] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#001D3D]/20">
                    <span className="material-symbols-outlined text-white text-4xl">account_balance</span>
                </div>
                <h1 className="text-2xl font-black text-[#001D3D] tracking-tight mb-1 uppercase">{t('app_name')}</h1>
                <p className="text-[10px] font-bold text-[#8B7355] tracking-[0.2em] uppercase opacity-80">{t('institutional_sub')}</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 rounded-xl bg-red-50 border border-red-100 p-4 text-[13px] font-medium text-red-600 flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1" htmlFor="email">
                                Email / Identifiant
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full bg-gray-50/50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-xl px-6 py-4 text-sm font-medium outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="administrateur@uidt.sn"
                            />
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1" htmlFor="password">
                                    Mot de passe
                                </label>
                                <a href="#" className="text-[10px] font-bold text-[#8B7355] hover:underline uppercase tracking-wider">Oublié ?</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full bg-gray-50/50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-xl px-6 py-4 text-sm font-medium outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#001D3D] text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#001D3D]/20 hover:bg-[#002b5c] transition-all active:scale-[0.98]"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-gray-50">
                        <p className="text-[13px] text-gray-400 font-medium">
                            Nouveau sur la plateforme ?{' '}
                            <Link to="/register" className="text-[#8B7355] font-black underline decoration-2 underline-offset-4 hover:text-[#001D3D] transition-colors">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
                
                <div className="mt-12 flex justify-center gap-12">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                            <span className="material-symbols-outlined text-xl">verified_user</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-[#001D3D] uppercase tracking-tight">Sécurisé</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">AES-256 bits</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                            <span className="material-symbols-outlined text-xl">public</span>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-[#001D3D] uppercase tracking-tight">Réseau Local</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Accès UIDT</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center opacity-50">
                    <p className="text-[9px] font-bold text-[#001D3D] uppercase tracking-[0.3em]">
                        © 2026 Université Iba Der Thiam de Thiès
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
