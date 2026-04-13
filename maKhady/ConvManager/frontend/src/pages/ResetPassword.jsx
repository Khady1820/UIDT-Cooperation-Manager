import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
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
            <div className="flex min-h-screen items-center justify-center p-6 text-center">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-premium max-w-sm border border-gray-100">
                    <p className="text-red-500 font-bold mb-4">Lien de réinitialisation invalide.</p>
                    <Link to="/login" className="text-[#001D3D] font-black uppercase text-[10px] tracking-widest">Retour</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden font-sans p-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center"
            >
                <div className="w-16 h-16 bg-[#001D3D] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#001D3D]/20">
                    <span className="material-symbols-outlined text-white text-4xl">lock_open</span>
                </div>
                <h1 className="text-2xl font-black text-[#001D3D] tracking-tight mb-1 uppercase">Réinitialisation</h1>
                <p className="text-[10px] font-bold text-[#8B7355] tracking-[0.2em] uppercase opacity-80">Nouveau mot de passe</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] bg-white p-10 rounded-[2.5rem] shadow-premium border border-gray-100"
            >
                {message && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-[11px] font-black uppercase text-center tracking-widest">
                        {message}. Redirection...
                    </div>
                )}

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-black uppercase text-center tracking-widest">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2">
                       Compte : <span className="text-[#8B7355]">{email}</span>
                   </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nouveau mot de passe</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-gray-50/50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-xl px-6 py-4 text-sm font-medium outline-none transition-all pr-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#001D3D] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirmation</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full bg-gray-50/50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-xl px-6 py-4 text-sm font-medium outline-none transition-all"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#001D3D] text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#001D3D]/20 hover:bg-[#002b5c] transition-all disabled:opacity-50"
                    >
                        {loading ? "Chargement..." : "Réinitialiser maintenant"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
