import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="flex min-h-screen items-center justify-center bg-surface p-4">
            <div className="w-full max-w-md bg-surface-container-lowest p-10 rounded-xl shadow-glass border border-outline-variant/15">
                <div className="mb-10 text-center">
                    <h1 className="text-display-sm font-medium tracking-tight text-on-surface mb-2">ConvManager</h1>
                    <p className="text-body-md text-on-surface-variant">L'Atelier Analytique</p>
                </div>
                
                {error && (
                    <div className="mb-6 rounded-lg bg-surface-container-low border border-error/20 p-4 text-sm text-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-label-md uppercase tracking-wider text-on-surface mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@convmanager.com"
                        />
                    </div>
                    <div>
                        <label className="block text-label-md uppercase tracking-wider text-on-surface mb-2" htmlFor="password">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-body-md font-medium text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-glass"
                    >
                        Se connecter
                    </button>
                </form>
                <div className="mt-8 text-center border-t border-outline-variant/10 pt-6">
                    <p className="text-sm text-on-surface-variant">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
