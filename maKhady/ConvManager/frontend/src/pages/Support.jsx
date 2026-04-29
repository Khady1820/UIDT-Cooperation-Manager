import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Support = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'technical',
        subject: '',
        message: '',
        priority: 'medium'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/tickets', formData);
            setSubmitted(true);
        } catch (err) {
            console.error("Erreur lors de l'ouverture du ticket:", err);
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl shadow-[#2E2F7F]/10 border border-gray-100 dark:border-slate-800"
                >
                    <div className="w-24 h-24 bg-green-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                        <span className="material-symbols-outlined text-5xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-black text-[#2E2F7F] dark:text-white mb-4 uppercase">Ticket Ouvert avec Succès</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-10">
                        Votre demande a été transmise à la DSI. Un conseiller reviendra vers vous par email dans les plus brefs délais.
                    </p>
                    <button 
                        onClick={() => navigate('/help')}
                        className="w-full py-5 bg-[#2E2F7F] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2E2F7F]/20"
                    >
                        Retourner à l'Aide
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 max-w-4xl mx-auto"
        >
            {/* Header */}
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-[#2E2F7F] dark:text-white uppercase tracking-tighter mb-2">
                        Assistance Technique
                    </h1>
                    <p className="text-lg font-bold text-slate-500 uppercase tracking-widest opacity-60">
                        Ouvrir un ticket d'assistance UIDT
                    </p>
                </div>
                <button 
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-[#2E2F7F] dark:text-white hover:bg-gray-50 transition-all"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Type de demande</label>
                                <select 
                                    className="uidt-input w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="technical">Problème Technique</option>
                                    <option value="access">Accès / Compte</option>
                                    <option value="data">Données / Conventions</option>
                                    <option value="other">Autre demande</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Priorité</label>
                                <select 
                                    className="uidt-input w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    value={formData.priority}
                                    onChange={e => setFormData({...formData, priority: e.target.value})}
                                >
                                    <option value="low">Basse</option>
                                    <option value="medium">Moyenne</option>
                                    <option value="high">Haute</option>
                                    <option value="urgent">Urgent (Bloquant)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Sujet de la demande</label>
                            <input 
                                type="text"
                                required
                                placeholder="Ex: Impossible de télécharger un fichier PDF"
                                className="uidt-input w-full dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Description détaillée</label>
                            <textarea 
                                required
                                rows="6"
                                placeholder="Décrivez votre problème avec le plus de précisions possible..."
                                className="uidt-input w-full resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-[#2E2F7F] text-white rounded-[1.5rem] text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#2E2F7F]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Traitement...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">send</span>
                                    Envoyer le Ticket
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-[#2E2F7F] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#2E2F7F]/20">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined">info</span>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight mb-4">Informations</h3>
                        <p className="text-sm font-bold opacity-80 leading-relaxed mb-6">
                            Notre équipe support traite les demandes du lundi au vendredi, de 08h00 à 17h00.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-xs font-black opacity-60">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                RÉPONSE EN MOINS DE 24H
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
                        <h3 className="text-base font-black text-[#2E2F7F] dark:text-white uppercase tracking-tight mb-6 text-center">Contact Direct</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-xl">alternate_email</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email DSI</p>
                                    <p className="text-sm font-bold text-[#2E2F7F] dark:text-white">support@uidt.sn</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined text-xl">call</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Standard</p>
                                    <p className="text-sm font-bold text-[#2E2F7F] dark:text-white">+221 33 800 00 00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .uidt-input {
                    background-color: #F8F9FA;
                    border: 2px solid #F1F3F5;
                    border-radius: 1.25rem;
                    padding: 1.25rem 1.5rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #2E2F7F;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .uidt-input:focus {
                    border-color: #2E2F7F20;
                    background-color: white;
                    box-shadow: 0 0 0 10px #2E2F7F05;
                }
            `}} />
        </motion.div>
    );
};

export default Support;
