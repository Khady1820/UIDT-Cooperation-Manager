import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const SecretariatDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pendingScans, setPendingScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats and specific pending scans for secretariat
                const [statsRes, conventionsRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/conventions?status=signe_recteur')
                ]);
                setStats(statsRes.data);
                setPendingScans(conventionsRes.data);
            } catch (error) {
                console.error("Erreur de chargement", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-[#001D3D]/20 border-t-[#001D3D] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
        >
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-[#001D3D] tracking-tight">Espace Archivage Numérique</h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Secrétariat Général • Gestion des Conventions Signées</p>
                </div>
                <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600">info</span>
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Dossiers à scanner : {pendingScans.length}</span>
                </div>
            </div>

            {/* Secretariat Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="premium-card p-8 bg-white border-l-[12px] border-l-[#001D3D] shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">En Attente de Scan</h3>
                        <span className="material-symbols-outlined text-amber-500">pending_actions</span>
                    </div>
                    <div className="text-4xl font-black text-[#001D3D]">{pendingScans.length}</div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Prêt pour archivage final</p>
                </motion.div>

                <motion.div variants={itemVariants} className="premium-card p-8 bg-white border-l-[12px] border-l-emerald-500 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Archivées ce mois</h3>
                        <span className="material-symbols-outlined text-emerald-500">task_alt</span>
                    </div>
                    <div className="text-4xl font-black text-[#001D3D]">{stats?.total_conventions || 0}</div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Dossiers complétés</p>
                </motion.div>

                <motion.div variants={itemVariants} className="premium-card p-8 bg-white border-l-[12px] border-l-blue-500 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Circuit de Signature</h3>
                        <span className="material-symbols-outlined text-blue-500">print</span>
                    </div>
                    <div className="text-4xl font-black text-[#001D3D]">{stats?.pending_validations || 0}</div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Dossiers en cours de visa</p>
                </motion.div>
            </div>

            {/* Critical Tasks Table */}
            <motion.div variants={itemVariants} className="premium-card bg-white overflow-hidden shadow-sm border border-slate-100">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-[#001D3D] tracking-tight">Derniers dossiers signés (À scanner)</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Récupérez le document physique et déposez le scan</p>
                    </div>
                    <Link to="/conventions" className="px-6 py-2 bg-[#001D3D] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#002b5c] transition-all">
                        Voir tout
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white">
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">N° Dossier</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Convention / Projet</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partenaire</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pendingScans.length > 0 ? pendingScans.map((conv) => (
                                <tr key={conv.id} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="p-6 text-xs font-black text-[#001D3D]">{conv.num_dossier}</td>
                                    <td className="p-6">
                                        <div className="text-xs font-black text-[#001D3D] uppercase line-clamp-1">{conv.name}</div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-0.5 capitalize">{conv.type}</div>
                                    </td>
                                    <td className="p-6 text-xs font-bold text-slate-600">{conv.partners || 'N/A'}</td>
                                    <td className="p-6"><StatusBadge status={conv.status} /></td>
                                    <td className="p-6">
                                        <Link 
                                            to={`/conventions/${conv.id}`}
                                            className="px-4 py-2 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-amber-100 transition-all inline-flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">upload_file</span>
                                            Scanner
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <span className="material-symbols-outlined text-6xl">check_circle</span>
                                            <p className="text-sm font-black uppercase tracking-widest">Aucun scan en attente</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Quick Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-4">
                    <h3 className="text-lg font-black uppercase tracking-tight">Guide de l'Archiviste</h3>
                    <ul className="space-y-4 text-xs font-bold text-slate-400">
                        <li className="flex items-start gap-3">
                            <span className="text-amber-400 font-black">01.</span>
                            <span>Récupérez la convention signée physiquement par le Recteur.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-amber-400 font-black">02.</span>
                            <span>Scannez le document complet (incluant les signatures) au format PDF.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-amber-400 font-black">03.</span>
                            <span>Allez sur la fiche du dossier et cliquez sur "Scanner" pour mettre en ligne.</span>
                        </li>
                    </ul>
                </div>
                <div className="p-8 bg-[#8B7355]/10 border border-[#8B7355]/20 rounded-[2rem] space-y-4">
                    <h3 className="text-lg font-black text-[#8B7355] uppercase tracking-tight">Transparence Totale</h3>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                        Toutes vos actions d'archivage sont enregistrées dans le journal d'audit. Les responsables peuvent suivre en temps réel la mise en ligne des documents officiels.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SecretariatDashboard;
