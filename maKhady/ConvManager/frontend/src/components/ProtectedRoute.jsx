import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#F8F9FA]">
            <div className="w-12 h-12 border-4 border-[#001D3D]/10 border-t-[#001D3D] rounded-full animate-spin"></div>
            <p className="text-[11px] font-bold text-[#001D3D] uppercase tracking-widest">Chargement de CoopManager...</p>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
