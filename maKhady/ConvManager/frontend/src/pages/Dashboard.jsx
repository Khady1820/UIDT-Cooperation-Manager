import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
    const [conventions, setConventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/conventions');
                setConventions(res.data);
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
            className="min-h-screen"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#001D3D] tracking-tight">{t('dashboard')}</h1>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{t('institutional_sub')} • Q4 2026</p>
                </div>
                <div className="flex gap-4 no-print">
                    <button 
                        onClick={() => window.print()}
                        className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-[#001D3D] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Exporter Rapport
                    </button>
                    <Link to="/validation" className="px-6 py-2.5 bg-[#001D3D] border border-[#001D3D] rounded-xl text-[11px] font-black text-white uppercase tracking-widest hover:bg-[#002b5c] transition-all shadow-xl shadow-[#001D3D]/20 flex items-center gap-2">
                        {t('submit_project')}
                        <span className="material-symbols-outlined text-[16px]">add</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Active Conventions */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border-l-[6px] border-l-[#8B7355] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between h-52 group">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Conventions Actives</h3>
                            <span className="text-[10px] font-bold text-[#8B7355] bg-[#E8E3D9] px-2 py-1 rounded">+12% vs AN-1</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-[#001D3D]">142</span>
                            <span className="text-sm font-bold text-gray-400">Accords Valides</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-6">
                        <div className="bg-[#8B7355] h-full w-3/4"></div>
                    </div>
                </motion.div>

                {/* Completion Rate */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border-l-[6px] border-l-[#001D3D] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between h-52">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('indicators')}</h3>
                            <span className="text-[11px] font-black text-[#8B7355] uppercase tracking-widest">Vérifié</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-[#001D3D]">87.4%</span>
                            <span className="text-sm font-bold text-gray-400">Indice d'Efficacité</span>
                        </div>
                    </div>
                    <div className="flex gap-1 mt-6">
                        <div className="h-1 bg-[#001D3D] flex-1 rounded-full"></div>
                        <div className="h-1 bg-[#001D3D] flex-1 rounded-full"></div>
                        <div className="h-1 bg-[#001D3D] flex-1 rounded-full"></div>
                        <div className="h-1 bg-gray-200 flex-1 rounded-full"></div>
                    </div>
                </motion.div>

                {/* Pending Validations */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border-l-[6px] border-l-red-500 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between h-52">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('validation')}</h3>
                            <span className="text-[10px] font-bold text-white bg-red-400 px-2 py-1 rounded">Action Requise</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-[#001D3D]">29</span>
                            <span className="text-sm font-bold text-gray-400">Dossiers Urgents</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tight">
                            <span className="material-symbols-outlined text-xs">schedule</span> Moy. 4.2 jours d'attente
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                {/* Types of Cooperation */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-xl font-black text-[#001D3D]">Types de Coopération</h2>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Portfolio Global</span>
                    </div>

                    <div className="space-y-8">
                        {[
                            { icon: 'biotech', title: 'Recherche Scientifique', sub: 'Labos Conjoints & Mobilité Doctorale', val: 64, color: '#001D3D' },
                            { icon: 'school', title: 'Échange Étudiant', sub: 'Erasmus+ & Bilatéral', val: 48, color: '#8B7355' },
                            { icon: 'factory', title: 'Transfert Industriel', sub: 'Externalisation R&D', val: 18, color: '#001D3D' },
                            { icon: 'palette', title: 'Affaires Culturelles', sub: 'Programmes de Langues & Arts', val: 12, color: '#001D3D' }
                        ].map((type) => (
                            <div key={type.title} className="group cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#001D3D]/5 transition-colors">
                                            <span className="material-symbols-outlined text-[#8B7355] text-2xl opacity-60 group-hover:opacity-100 transition-opacity">{type.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-[#001D3D] tracking-tight">{type.title}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{type.sub}</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black text-[#001D3D]">{type.val}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-[3px] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#001D3D] rounded-full" style={{ width: `${(type.val/142)*100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-xl font-black text-[#001D3D]">Fil d'Activité</h2>
                        <Link to="/timeline" className="text-[10px] font-black text-gray-400 hover:text-[#001D3D] uppercase tracking-[0.2em] flex items-center gap-1">
                            Tout Voir <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="space-y-8 relative flex-1">
                        <div className="absolute left-[3px] top-2 bottom-0 w-[1px] bg-gray-100"></div>
                        
                        {[
                            { title: 'Partenariat Formalisé', desc: 'L\'UIDT & King\'s College London ont signé l\'accord de mobilité 2024-2027.', time: 'IL Y A 2 HEURES', color: '#001D3D' },
                            { title: 'Fonds Alloués', desc: '450 000 € débloqués pour le cluster de recherche Horizon Europe A.', time: 'HIER, 14:30', color: '#8B7355' },
                            { title: 'Proposition Soumise', desc: 'Le Dr Aris Thorne a soumis un nouveau cadre avec la NUS Singapour.', time: '12 OCT 2026', color: '#001D3D' },
                            { title: 'Archivage Terminé', desc: 'Les coopérations historiques (2015-2020) ont été sécurisées.', time: '10 OCT 2026', color: '#E8E8E8' }
                        ].map((act, index) => (
                            <div key={index} className="relative pl-8">
                                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full border-2 border-white shadow-sm ring-4 ring-white" style={{ backgroundColor: act.color }}></div>
                                <h4 className="text-[11px] font-black text-[#001D3D] uppercase tracking-wider">{act.title}</h4>
                                <p className="text-[11px] font-bold text-gray-500 leading-relaxed mt-1">{act.desc}</p>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">{act.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tâches Urgentes */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-xl font-black text-[#001D3D]">Actions Urgentes</h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border border-gray-100 px-3 py-1 rounded-full">Vue Rectorat</span>
                </div>

                <div className="space-y-4">
                    {[
                        { icon: 'signature', title: 'MoU: Université de la Sorbonne', status: 'ATTENTE VALIDATION DIRECTION', action: 'VALIDER' },
                        { icon: 'gavel', title: 'Contrat: Initiative Quantum MIT', status: 'ATTENTE SIGNATURE RECTEUR', action: 'SIGNER' },
                        { icon: 'history_edu', title: 'Extension: Labo Tokyo Tech', status: 'RÉVISION FINALE EN COURS', action: 'CONSULTER' }
                    ].map((task, index) => (
                        <div key={index} className="flex items-center gap-6 p-6 border border-gray-50 bg-[#FBFBFB] hover:bg-white hover:shadow-xl transition-all rounded-3xl group">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-[#8B7355] text-3xl opacity-60 group-hover:scale-110 transition-transform">{task.icon}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-base font-black text-[#001D3D]">{task.title}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{task.status}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                                <button className="px-8 py-3 bg-[#001D3D] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#002b5c] transition-all shadow-lg shadow-[#001D3D]/10">
                                    {task.action}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Print Only Report Template */}
            <div className="hidden print-only fixed inset-0 bg-white z-[100] p-10 font-sans text-[#001D3D]">
                <div className="flex justify-between items-start border-b-2 border-[#001D3D] pb-10 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#001D3D] text-white flex items-center justify-center rounded-2xl shadow-xl">
                            <span className="material-symbols-outlined text-5xl">account_balance</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter leading-tight">UNIVERSITÉ IBA DER THIAM<br/>DE THIÈS (UIDT)</h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B7355] mt-2">Direction de la Coopération Institutionnelle</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rapport de Situation</p>
                        <p className="text-sm font-black mt-1">GÉNÉRÉ LE {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-[#8B7355] mt-1">REF: DCI/RPT/2026-Q4/001</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-12">
                    <div className="space-y-6">
                        <h2 className="text-lg font-black uppercase tracking-widest border-l-4 border-[#8B7355] pl-4">Résumé des Métriques</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 italic">
                                <span className="text-sm text-gray-500">Conventions Actives en Cours :</span>
                                <span className="text-lg font-black text-[#001D3D]">142</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 italic">
                                <span className="text-sm text-gray-500">Dossiers en Attente de Validation :</span>
                                <span className="text-lg font-black text-red-600">29</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 italic">
                                <span className="text-sm text-gray-500">Indice d'Efficacité Globale :</span>
                                <span className="text-lg font-black text-green-600">87.4%</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg font-black uppercase tracking-widest border-l-4 border-[#001D3D] pl-4">Types de Coopération</h2>
                        <div className="space-y-3">
                            {[
                                { title: 'Recherche Scientifique', val: '64 Units' },
                                { title: 'Échange Étudiant', val: '48 Units' },
                                { title: 'Transfert Industriel', val: '18 Units' },
                                { title: 'Affaires Culturelles', val: '12 Units' }
                            ].map((type) => (
                                <div key={type.title} className="flex justify-between text-sm py-1">
                                    <span className="font-bold text-gray-600">{type.title}</span>
                                    <span className="font-black">{type.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-lg font-black uppercase tracking-widest border-l-4 border-[#001D3D] pl-4 mb-6">Activité Récente du Portefeuille</h2>
                    <table className="w-full text-left border-collapse border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <thead className="bg-[#f8fafc]">
                            <tr>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Événement</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Horodatage</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] font-medium text-gray-600">
                            {[
                                { title: 'Partenariat Formalisé', desc: 'L\'UIDT & King\'s College London ont signé l\'accord de mobilité.', time: 'HIER' },
                                { title: 'Fonds Alloués', desc: '450 000 € débloqués pour le cluster de recherche Horizon Europe.', time: '12 OCT 2026' },
                                { title: 'Proposition Soumise', desc: 'Le Dr Aris Thorne a soumis un nouveau cadre avec la NUS Singapour.', time: '10 OCT 2026' }
                            ].map((act, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="p-4 font-black text-[#001D3D] uppercase">{act.title}</td>
                                    <td className="p-4 group-hover:text-[#8B7355]">{act.desc}</td>
                                    <td className="p-4 font-black">{act.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end border-t border-gray-100 pt-10">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#8B7355]">Certifié Conforme par la Direction de la Coopération</p>
                        <p className="text-[8px] font-medium text-gray-400">© 2026 CoopManager UIDT - Système de Gestion du Patrimoine Conventionnel</p>
                    </div>
                    <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center text-gray-300 text-[10px] font-black uppercase rotate-[-15deg]">
                        Cachet Institutionnel
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
