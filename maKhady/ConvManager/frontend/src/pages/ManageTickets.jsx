import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { format } from 'date-fns';

const ManageTickets = () => {
    const { t } = useLanguage();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/admin/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/admin/tickets/${id}`, { status: newStatus });
            fetchTickets();
            if (selectedTicket?.id === id) {
                setSelectedTicket(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour du statut:", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#2E2F7F] uppercase tracking-tighter mb-2">Gestion du Support</h1>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] opacity-60">Consulter et résoudre les demandes d'assistance</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-black text-[#2E2F7F] uppercase tracking-widest">{tickets.length} TICKETS ACTIFS</span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-gray-50/50">
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            <th className="px-8 py-6">Utilisateur</th>
                            <th className="px-8 py-6">Sujet</th>
                            <th className="px-8 py-6">Type</th>
                            <th className="px-8 py-6">Priorité</th>
                            <th className="px-8 py-6">Statut</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-40">
                                        <div className="w-8 h-8 border-3 border-[#2E2F7F]/20 border-t-[#2E2F7F] rounded-full animate-spin"></div>
                                        <span className="text-xs font-black uppercase tracking-widest">Chargement des tickets...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : tickets.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                        <span className="material-symbols-outlined text-5xl">confirmation_number</span>
                                        <span className="text-xs font-black uppercase tracking-widest">Aucun ticket en attente</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#2E2F7F]/5 flex items-center justify-center text-[#2E2F7F] font-black text-xs border border-[#2E2F7F]/10">
                                                {ticket.user?.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[#2E2F7F] uppercase tracking-tight">{ticket.user?.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{ticket.user?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-slate-700 line-clamp-1">{ticket.subject}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-gray-100 px-2 py-1 rounded-md">{ticket.type}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                            ticket.priority === 'urgent' ? 'bg-red-50 text-red-500 border border-red-100' :
                                            ticket.priority === 'high' ? 'bg-orange-50 text-orange-500 border border-orange-100' :
                                            'bg-blue-50 text-blue-500 border border-blue-100'
                                        }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border shadow-sm ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="w-10 h-10 rounded-xl bg-[#2E2F7F] text-white flex items-center justify-center hover:bg-[#F7931E] transition-all shadow-lg shadow-[#2E2F7F]/20"
                                        >
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="absolute inset-0 bg-[#2E2F7F]/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-12 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(selectedTicket.status)} border-2`}>
                                        <span className="material-symbols-outlined text-2xl">confirmation_number</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#2E2F7F] uppercase tracking-tight">Détails du Ticket #{selectedTicket.id}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ouvert le {format(new Date(selectedTicket.created_at), 'dd/MM/yyyy à HH:mm')}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-[#2E2F7F] transition-colors">
                                    <span className="material-symbols-outlined text-3xl">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Utilisateur</p>
                                    <p className="text-sm font-black text-[#2E2F7F] uppercase">{selectedTicket.user?.name}</p>
                                    <p className="text-xs font-bold text-slate-500">{selectedTicket.user?.email}</p>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type & Priorité</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-[#2E2F7F] uppercase">{selectedTicket.type}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="text-xs font-black text-orange-500 uppercase">{selectedTicket.priority}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sujet & Message</p>
                                <h4 className="text-lg font-black text-[#2E2F7F] mb-4 uppercase leading-tight">{selectedTicket.subject}</h4>
                                <div className="p-6 bg-[#2E2F7F]/5 rounded-2xl border border-[#2E2F7F]/10">
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Changer le statut :</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => updateStatus(selectedTicket.id, 'in_progress')}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                selectedTicket.status === 'in_progress' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                            }`}
                                        >
                                            En cours
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(selectedTicket.id, 'resolved')}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                selectedTicket.status === 'resolved' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                        >
                                            Résolu
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
                                >
                                    Fermer la vue
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ManageTickets;
