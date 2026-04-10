import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Help = () => {
    const { t } = useLanguage();

    const sections = [
        {
            title: "Le Circuit de Validation",
            icon: "account_tree",
            content: "CoopManager suit un circuit institutionnel rigoureux pour garantir la conformité des conventions.",
            steps: [
                { label: "Brouillon", desc: "Le porteur de projet prépare les données et les indicateurs du dossier." },
                { label: "Soumission", desc: "Le dossier est envoyé à la Direction de la Coopération pour instruction." },
                { label: "Validation Direction", desc: "Le Directeur examine et valide la faisabilité stratégique du projet." },
                { label: "Signature Rectorale", desc: "Le Recteur appose la validation finale numérique pour activation." }
            ]
        },
        {
            title: "Glossaire des Indicateurs (KPI)",
            icon: "analytics",
            content: "Chaque convention est pilotée par des indicateurs de performance clés.",
            items: [
                { label: "Cible (Target)", desc: "L'objectif numérique à atteindre d'ici la fin de la convention." },
                { label: "Valeur Actuelle", desc: "Le niveau de réalisation constaté sur le terrain par le porteur." },
                { label: "Taux de Réalisation", desc: "Calculé automatiquement : (Valeur Actuelle / Cible) * 100." }
            ]
        },
        {
            title: "Guide des Acteurs",
            icon: "groups",
            content: "Comprendre les responsabilités de chaque intervenant dans l'application.",
            roles: [
                { name: "Porteur de Projet", desc: "Initialise les dossiers, définit les KPIs et gère les documents." },
                { name: "Directeur Coopération", desc: "Instruit les dossiers, vérifie l'alignement stratégique et valide la première étape." },
                { name: "Recteur", desc: "Assure la signature institutionnelle finale et le pilotage de haut niveau." }
            ]
        }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-12 pb-20"
        >
            {/* Header */}
            <div className="bg-[#001D3D] p-16 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-[#001D3D]/20">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-px bg-[#B68F40]"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#B68F40]">Documentation Officielle</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight leading-tight uppercase max-w-2xl">
                        CENTRE D'AIDE & GUIDE DES PROCÉDURES UIDT
                    </h1>
                    <p className="text-sm font-medium text-white/60 max-w-xl leading-relaxed">
                        Bienvenue dans votre espace d'assistance. Ce guide interactif vous accompagne dans la gestion, la validation et le pilotage de vos conventions de coopération.
                    </p>
                </div>
                <div className="absolute top-1/2 right-10 -translate-y-1/2 text-white/[0.05] pointer-events-none rotate-12">
                    <span className="material-symbols-outlined text-[300px]">help_center</span>
                </div>
            </div>

            {/* Quick Links / Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl hover:shadow-black/5 transition-all group">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#B68F40] group-hover:bg-[#001D3D] group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm border border-gray-100">
                                <span className="material-symbols-outlined text-[28px]">{section.icon}</span>
                            </div>
                            <h3 className="text-lg font-black text-[#001D3D] tracking-tight">{section.title}</h3>
                        </div>
                        <p className="text-[11px] font-medium text-gray-400 mb-8 leading-relaxed uppercase tracking-widest">{section.content}</p>
                        
                        <div className="space-y-6 flex-1">
                            {section.steps && section.steps.map((step, sidx) => (
                                <div key={sidx} className="flex gap-4 relative">
                                    {sidx < section.steps.length - 1 && <div className="absolute left-[9px] top-6 bottom-[-24px] w-[2px] bg-gray-50"></div>}
                                    <div className="w-5 h-5 rounded-full border-2 border-[#B68F40] bg-white z-10 flex items-center justify-center text-[9px] font-black text-[#B68F40]">{sidx + 1}</div>
                                    <div className="space-y-1 pt-0.5">
                                        <h4 className="text-[11px] font-black text-[#001D3D] uppercase tracking-wide">{step.label}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}

                            {section.items && section.items.map((item, iidx) => (
                                <div key={iidx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                                    <h4 className="text-[11px] font-black text-[#001D3D] uppercase tracking-wide mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#B68F40]"></div>
                                        {item.label}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}

                            {section.roles && section.roles.map((role, ridx) => (
                                <div key={ridx} className="flex gap-4 items-start py-2">
                                    <span className="material-symbols-outlined text-[18px] text-gray-300">verified_user</span>
                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-black text-[#001D3D] uppercase tracking-wide">{role.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{role.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Assistance Section */}
            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-500 border border-green-100">
                        <span className="material-symbols-outlined text-[40px]">support_agent</span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-[#001D3D]">Besoin d'une assistance technique ?</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            Contacter la Direction des Systèmes d'Information (DSI) ou la Direction de la Coopération pour toute question bloquante.
                        </p>
                    </div>
                </div>
                <button className="px-12 py-5 bg-[#001D3D] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#001D3D]/20 hover:scale-105 active:scale-95 transition-all">
                    {t('ouvrir_ticket')}
                </button>
            </div>
        </motion.div>
    );
};

export default Help;
