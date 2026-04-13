import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

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
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] overflow-hidden font-sans p-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center"
            >
                <div className="w-16 h-16 bg-[#001D3D] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#001D3D]/20">
                    <span className="material-symbols-outlined text-white text-4xl">lock_reset</span>
                </div>
                <h1 className="text-2xl font-black text-[#001D3D] tracking-tight mb-1 uppercase">Récupération</h1>
                <p className="text-[10px] font-bold text-[#8B7355] tracking-[0.2em] uppercase opacity-80">Mot de passe oublié</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] bg-white p-10 rounded-[2.5rem] shadow-premium border border-gray-100"
            >
                {message && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-xs font-bold text-center uppercase tracking-widest">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center uppercase tracking-widest">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Email Académique</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-gray-50/50 border border-transparent focus:border-[#001D3D]/10 focus:bg-white focus:ring-8 focus:ring-[#001D3D]/5 rounded-xl px-6 py-4 text-sm font-medium outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votreemail@uidt.sn"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#001D3D] text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#001D3D]/20 hover:bg-[#002b5c] transition-all disabled:opacity-50"
                    >
                        {loading ? "Chargement..." : "Envoyer le lien"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#001D3D] transition-colors">
                        Retour à la connexion
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
