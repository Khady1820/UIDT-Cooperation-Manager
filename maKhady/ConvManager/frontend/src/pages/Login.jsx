import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import logo from '../assets/logo_convmanager.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
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
        <div className="relative flex min-h-screen items-center justify-center bg-surface-50 overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-4"
            >
                <div className="glass-card p-10 border border-white/40 shadow-2xl">
                    <div className="mb-10 text-center flex flex-col items-center">
                        <motion.img 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            src={logo} 
                            alt="ConvManager Logo" 
                            className="h-20 w-auto object-contain mb-6" 
                        />
                        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Bienvenue</h1>
                        <p className="text-sm text-surface-500 mt-1">Système de Gestion des Conventions</p>
                    </div>
                    
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-500 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1" htmlFor="email">
                                Adresse Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="premium-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2 ml-1" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="premium-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="premium-button-primary w-full py-3.5 text-sm font-bold tracking-wide uppercase"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-surface-100">
                        <p className="text-sm text-surface-500">
                            Pas encore utilisateur ?{' '}
                            <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-[10px] text-surface-400 uppercase tracking-widest font-bold">
                    © 2026 ConvManager · Tous droits réservés
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
