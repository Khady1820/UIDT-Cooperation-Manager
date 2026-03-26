import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo_convmanager.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '2' // Default to Responsable
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

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
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 z-0 bg-slate-950">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass-card w-full max-w-[480px] p-10 relative z-10 border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <div className="mb-10 text-center relative">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block p-4 bg-white/5 rounded-3xl mb-6 border border-white/10"
                    >
                        <img src={logo} alt="ConvManager Logo" className="h-16 w-auto object-contain" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Inscription</h1>
                    <p className="text-slate-400 font-medium italic">Rejoignez la plateforme ConvManager</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="name">
                            Nom Complet
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="premium-input bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Jean Dupont"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="email">
                            Adresse Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="premium-input bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="jean.dupont@finance.gov"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="role">
                            Votre Fonction
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                className="premium-input bg-white/5 border-white/10 text-white appearance-none cursor-pointer focus:bg-white/10 pr-10"
                                value={formData.role_id}
                                onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                            >
                                <option value="1" className="bg-slate-900">Administrateur</option>
                                <option value="2" className="bg-slate-900">Responsable de Projet</option>
                                <option value="3" className="bg-slate-900">Partenaire Externe</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none material-symbols-outlined">expand_more</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="premium-input bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="password_confirmation">
                                Confirmation
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                className="premium-input bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="premium-button-primary w-full py-4 mt-4 text-xs uppercase tracking-widest font-black"
                    >
                        Finaliser l'inscription
                    </motion.button>
                </form>

                <div className="mt-10 text-center border-t border-white/5 pt-8">
                    <p className="text-sm text-slate-500 font-medium">
                        Vous avez déjà un accès ?{' '}
                        <Link to="/login" className="text-primary font-black hover:text-indigo-400 transition-colors uppercase tracking-widest text-xs ml-1">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
