import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="flex min-h-screen items-center justify-center bg-surface p-4">
            <div className="w-full max-w-md bg-surface-container-lowest p-10 rounded-xl shadow-glass border border-outline-variant/15 animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-8 text-center">
                    <h1 className="text-display-sm font-medium tracking-tight text-on-surface mb-2">ConvManager</h1>
                    <p className="text-body-md text-on-surface-variant">Créer votre compte analytique</p>
                </div>
                
                {error && (
                    <div className="mb-6 rounded-lg bg-surface-container-low border border-error/20 p-4 text-sm text-error italic">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-label-md uppercase tracking-wider text-on-surface mb-1 ml-1" htmlFor="name">
                            Nom Complet
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Jean Dupont"
                        />
                    </div>
                    <div>
                        <label className="block text-label-md uppercase tracking-wider text-on-surface mb-1 ml-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="jean@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-label-md uppercase tracking-wider text-on-surface mb-1 ml-1" htmlFor="role">
                            Rôle souhaité
                        </label>
                        <select
                            id="role"
                            className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none cursor-pointer"
                            value={formData.role_id}
                            onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                        >
                            <option value="1">Administrateur</option>
                            <option value="2">Responsable</option>
                            <option value="3">Partenaire</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-label-md uppercase tracking-wider text-on-surface mb-1 ml-1" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-label-md uppercase tracking-wider text-on-surface mb-1 ml-1" htmlFor="password_confirmation">
                                Confirmer
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                className="w-full rounded-lg bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-4 text-body-md font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                    >
                        Créer mon compte
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-outline-variant/10 pt-6">
                    <p className="text-sm text-on-surface-variant">
                        Déjà un compte ?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
