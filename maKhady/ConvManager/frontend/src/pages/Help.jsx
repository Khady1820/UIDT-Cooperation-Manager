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
                { label: "1. Brouillon / Edition", desc: "Le porteur de projet prépare les données stratégiques et les indicateurs." },
                { label: "2. Pré-validation (Chef)", desc: "Examen par le Chef de Division pour vérifier la cohérence et la complétude." },
                { label: "3. Instruction (Direction)", desc: "Le dossier est envoyé à la Direction de la Coopération pour première instruction." },
                { label: "4. Visa Juridique", desc: "Le Service Juridique certifie la conformité légale et le respect des règlementations." },
                { label: "5. Contrôle Final", desc: "La Direction effectue une vérification finale avant transmission au Rectorat." },
                { label: "6. Signature Rectorale", desc: "Le Recteur appose la validation finale pour l'officialisation de l'accord." }
            ]
        },
        {
            title: "Glossaire & KPIs",
            icon: "analytics",
            content: "Indicateurs de performance pour le pilotage stratégique.",
            items: [
                { label: "Cible (Target)", desc: "L'objectif numérique à atteindre d'ici la fin de la convention." },
                { label: "Identifiant UIDT", desc: "Numéro de dossier unique (ex: UIDT-2026-001) généré automatiquement." },
                { label: "Taux de Réalisation", desc: "Indice automatique mesurant l'état d'avancement des objectifs." }
            ]
        },
        {
            title: "Guide des Acteurs",
            icon: "groups",
            content: "Comprendre les responsabilités de chaque pôle institutionnel.",
            roles: [
                { name: "Porteur de Projet", desc: "Initialise les dossiers, définit les KPIs et gère les documents." },
                { name: "Chef de Division", desc: "Vérifie la pertinence académique et pré-valide le dossier." },
                { name: "Directeur Coopération", desc: "Instruit les dossiers, assure l'arbitrage et le contrôle final." },
                { name: "Service Juridique", desc: "Garantit la conformité et la sécurité juridique des partenariats." },
                { name: "Recteur", desc: "Assure la signature institutionnelle et le pilotage de haut niveau." }
            ]
        },
        {
            title: "Questions Fréquentes",
            icon: "quiz",
            content: "Réponses aux questions courantes sur le fonctionnement du système.",
            items: [
                { label: "Pourquoi justifier chaque décision ?", desc: "Les commentaires sont obligatoires pour garantir la transparence et l'auditabilité du circuit." },
                { label: "Que signifie un retour 'Visa Refusé' ?", desc: "Le dossier présente des non-conformités juridiques. Il retourne à l'instruction pour correction." },
                { label: "Qui génère le numéro de dossier ?", desc: "Le système attribue le numéro UIDT-YYYY-XXX dès que le porteur soumet le projet." }
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

            {/* Feature Highlight: Notifications */}
            <div className="bg-gradient-to-r from-white to-gray-50 p-10 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative group">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-indigo-50/30 -skew-x-12 translate-x-1/2"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-10 items-center">
                    <div className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                        <div className="w-16 h-16 bg-[#001D3D] text-white rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="material-symbols-outlined text-[32px]">notifications_active</span>
                        </div>
                        <h3 className="text-lg font-black text-[#001D3D] uppercase tracking-tight">Système de<br/>Notification</h3>
                    </div>
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Alertes Temps Réel", desc: "Soyez notifié instantanément lors d'un changement de statut de dossier.", icon: "bolt" },
                            { title: "Rapports Hebdo", desc: "Recevez un résumé des performances KPI par e-mail chaque lundi.", icon: "mail" },
                            { title: "Historique d’Audit", desc: "Consultez le fil d'activité pour tracer chaque action effectuée.", icon: "history" }
                        ].map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#B68F40] text-sm">{item.icon}</span>
                                    <h4 className="text-[11px] font-black text-[#001D3D] uppercase tracking-widest">{item.title}</h4>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
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
