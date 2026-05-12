import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ConventionSummary = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [convention, setConvention] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConvention = async () => {
            if (!id || id === 'undefined') {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/conventions/${id}`);
                setConvention(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConvention();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-[#2E2F7F]/10 border-t-[#2E2F7F] rounded-full animate-spin"></div>
        </div>
    );

    if (!convention) return (
        <div className="p-20 text-center bg-white rounded-3xl shadow-sm border border-gray-100 italic text-slate-600">
            Dossier introuvable.
        </div>
    );

    const isSigned = convention.status === 'signe_recteur' || convention.status === 'termine';
    const isArchived = convention.file_path !== null; // Simple check if document is uploaded/archived

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 print:bg-white print:pb-0 font-sans">
            {/* Action Bar - Hidden on print */}
            <div className="max-w-5xl mx-auto pt-10 pb-6 px-6 lg:px-0 flex items-center justify-between no-print">
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">RAPPORTS DE MOBILITÉ • {convention.year || new Date().getFullYear()}</p>
                    <h1 className="text-2xl font-black text-[#2E2F7F] dark:text-white tracking-tight">
                        {isSigned ? 'Rapport Final de Coopération' : 'Fiche de Synthèse du Projet'}
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Retour
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[16px]">print</span>
                        Imprimer
                    </button>
                    {convention.file_path && (
                        <button 
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${convention.file_path}`;
                                link.target = '_blank';
                                link.download = convention.file_path.split('/').pop();
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Document Original
                        </button>
                    )}
                    <Link 
                        to={`/conventions/${id}`}
                        className="px-6 py-2.5 bg-[#001B3D] text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#2E2F7F] transition-all flex items-center gap-2 shadow-lg"
                    >
                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                        Voir le Dossier Complet
                    </Link>
                </div>
            </div>

            {/* A4 Paper Container */}
            <div className="max-w-4xl mx-auto bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-md print:shadow-none print:w-full print:max-w-none print:p-0 overflow-hidden relative">
                
                {/* Official Header */}
                <div className="p-16 pb-12 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center p-1 bg-white">
                             <img src="/image/logo_UIDT.png" alt="UIDT Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-[#001B3D] tracking-wider uppercase">UNIVERSITÉ IBA DER THIAM DE THIÈS</h2>
                            <p className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase mt-0.5">DÉPARTEMENT DE LA COOPÉRATION</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">DOCUMENT OFFICIEL</p>
                        <p className="text-xs font-bold text-slate-800">Réf: UIDT-COOP-{convention.year || '2024'}-{String(convention.id).padStart(4, '0')}</p>
                        <p className="text-xs text-slate-500 mt-1">Date: {format(new Date(convention.created_at || new Date()), 'dd MMMM yyyy', { locale: fr })}</p>
                    </div>
                </div>

                {/* Title Area */}
                <div className="px-16 text-center space-y-4 mb-14">
                    <h1 className="text-2xl font-black text-[#001B3D] uppercase tracking-widest">
                        {isSigned ? 'RAPPORT DE CLÔTURE DE PROJET' : 'PROJET DE CONVENTION DE PARTENARIAT'}
                    </h1>
                    <div className="inline-block px-5 py-2 bg-[#E6EEF9] text-[#001B3D] rounded-full text-[11px] font-black uppercase tracking-[0.2em]">
                        STATUT : {convention.status.replace(/_/g, ' ')}
                    </div>
                </div>

                {/* Info Blocks Grid */}
                <div className="px-16 space-y-5 mb-12">
                    {/* Block 1 */}
                    <div className="bg-[#F8FAFC] p-8 rounded-lg border border-slate-100 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">TITRE DU PROJET</p>
                            <p className="text-base font-black text-[#001B3D] leading-snug">{convention.name}</p>
                        </div>
                        <div className="md:text-right md:border-l border-slate-200 md:pl-6 shrink-0">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">PORTEUR DE PROJET</p>
                            <p className="text-sm font-black text-[#001B3D]">{convention.user?.name || 'Non spécifié'}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Département d'origine</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Block 2 */}
                        <div className="bg-[#F8FAFC] p-8 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">PARTENAIRES INSTITUTIONNELS</p>
                            <ul className="space-y-3">
                                {convention.partners ? convention.partners.split(',').map((partner, idx) => (
                                    <li key={idx} className="text-sm font-bold text-[#001B3D] flex items-start gap-3">
                                        <span className="text-slate-400 mt-0.5">•</span>
                                        {partner.trim()}
                                    </li>
                                )) : (
                                    <li className="text-sm font-bold text-[#001B3D] flex items-start gap-3">
                                        <span className="text-slate-400 mt-0.5">•</span>
                                        Partenaire non spécifié
                                    </li>
                                )}
                                <li className="text-sm font-bold text-[#001B3D] flex items-start gap-3">
                                    <span className="text-slate-400 mt-0.5">•</span>
                                    UIDT (Sénégal)
                                </li>
                            </ul>
                        </div>
                        {/* Block 3 */}
                        <div className="bg-[#F8FAFC] p-8 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">DURÉE & CARACTÉRISTIQUES</p>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-bold text-[#001B3D]">{convention.duration || 'Durée non spécifiée'}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Classification : {convention.type || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#001B3D]">Taux de réalisation : {convention.completion_rate || '0'}%</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Indicateur : {convention.indicator || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Synthesis Section */}
                <div className="px-16 mb-12 space-y-6">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">SYNTHÈSE DE COOPÉRATION</h3>
                    <div className="text-[13px] text-[#001B3D] leading-relaxed font-medium space-y-4 whitespace-pre-wrap">
                        {convention.objectives || 'Aucune synthèse ou objectif spécifié pour cette convention.'}
                    </div>
                </div>

                {/* Conformity Box */}
                <div className="px-16 mb-20">
                    <div className="border-l-4 border-[#001B3D] bg-[#F8FAFC] p-8">
                        <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">CERTIFICATION DE CONFORMITÉ INSTITUTIONNELLE</h4>
                        <p className="text-[13px] text-[#001B3D] font-bold italic leading-relaxed">
                            "Nous certifions que ce protocole d'accord a été instruit conformément aux directives du conseil d'administration et aux procédures internes de l'UIDT. {convention.observations || 'Aucune anomalie ou observation majeure n\'a été constatée lors de l\'instruction.'}"
                        </p>
                    </div>
                </div>

                {/* Signatures Area */}
                <div className="px-16 mb-16 flex justify-between items-end">
                    {/* Secretariat Signature Area */}
                    <div className="text-center w-56 relative">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-12">SECRÉTARIAT GÉNÉRAL</p>
                        
                        {(isSigned || convention.status === 'attente_sg' || convention.status === 'pret_pour_signature') && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 opacity-90 -rotate-6">
                                <img src="/image/cache_sg.avif" alt="Cachet SG" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                        )}
                        
                        <div className="relative z-10 pt-10">
                            <p className="text-[13px] font-black text-[#001B3D]">Dr. Amadou FALL</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Secrétaire Général</p>
                        </div>
                    </div>

                    {/* Recteur Signature Area */}
                    <div className="text-center w-56 relative">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">LE RECTEUR DE L'UNIVERSITÉ</p>
                        
                        <div className="h-20 flex items-center justify-center mb-2">
                            {isSigned ? (
                                <img src="/image/signature_recteur.png" alt="Signature Recteur" className="h-16 object-contain opacity-90" onError={(e) => {
                                    if (e.target.src.includes('.png')) {
                                        e.target.src = '/image/signature_recteur.jpg';
                                    } else {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }
                                }}/>
                            ) : (
                                <div className="text-xs text-slate-300 italic border-b border-dashed border-slate-300 w-40 pb-2 text-center">En attente de signature</div>
                            )}
                            <div className="hidden text-xs text-slate-300 italic border-b border-dashed border-slate-300 w-40 pb-2 text-center">Signature Numérique</div>
                        </div>

                        <div className="relative z-10 border-t border-slate-200 pt-3">
                            <p className="text-[13px] font-black text-[#001B3D]">Pr. Mamadou Babacar NDIAYE</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Recteur UIDT</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-16 px-16">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">PAGE 1 DE 1 • UNIVERSITÉ IBA DER THIAM DE THIÈS • COOPMANAGER SYSTEMS</p>
                </div>

                {/* Footer Validation Blocks */}
                {isArchived && (
                    <div className="bg-[#F8FAFC] border-t border-slate-100 flex p-6 px-16">
                        <div className="flex-1 flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#001B3D] uppercase tracking-widest">Document Original Archivé</p>
                                <p className="text-[9px] text-slate-500 mt-1">
                                    La version physique certifiée a été numérisée et sécurisée sur la plateforme le {format(new Date(), 'dd/MM/yyyy à HH:mm')}.
                                </p>
                            </div>
                        </div>
                        <div className="w-px bg-slate-200 mx-6"></div>
                        <div className="flex items-center justify-center shrink-0">
                            <button className="flex items-center gap-2 text-[10px] font-black text-[#001B3D] hover:text-[#2E2F7F] uppercase tracking-widest transition-colors">
                                <span className="material-symbols-outlined text-[16px]">history</span>
                                Historique des Versions
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 0; size: A4; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; }
                    .no-print { display: none !important; }
                }
            `}} />
        </div>
    );
};

export default ConventionSummary;
