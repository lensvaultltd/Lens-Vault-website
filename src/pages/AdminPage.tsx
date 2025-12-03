import React, { useEffect, useState } from 'react';
import { getFeedback, getContactMessages } from '../services/databaseService';
import type { Feedback, ContactMessage } from '../types/database.types';
import { Star, MessageSquare, Mail, Loader, ArrowLeft } from 'lucide-react';

const AdminPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'feedback' | 'messages'>('feedback');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [feedbackData, messagesData] = await Promise.all([
                    getFeedback(),
                    getContactMessages()
                ]);
                setFeedback(feedbackData);
                setMessages(messagesData);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-forest-900 text-white">
                <Loader className="w-8 h-8 animate-spin text-forest-accent" />
            </div>
        );
    }

    return (
        <section className="py-24 min-h-screen bg-forest-900 text-white">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => onNavigate('main')}
                        className="p-2 hover:bg-forest-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>

                <div className="flex gap-4 mb-8 border-b border-forest-700">
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'feedback'
                                ? 'border-forest-accent text-forest-accent'
                                : 'border-transparent text-forest-400 hover:text-white'
                            }`}
                    >
                        Feedback ({feedback.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'messages'
                                ? 'border-forest-accent text-forest-accent'
                                : 'border-transparent text-forest-400 hover:text-white'
                            }`}
                    >
                        Messages ({messages.length})
                    </button>
                </div>

                {activeTab === 'feedback' ? (
                    <div className="grid gap-4">
                        {feedback.length === 0 ? (
                            <p className="text-forest-400 text-center py-12">No feedback yet.</p>
                        ) : (
                            feedback.map((item) => (
                                <div key={item.id} className="bg-forest-800/50 border border-forest-700 p-6 rounded-xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-forest-700 p-2 rounded-full">
                                                <MessageSquare className="w-5 h-5 text-forest-accent" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">
                                                    {item.userName || 'Anonymous'}
                                                </p>
                                                <p className="text-xs text-forest-400">
                                                    {item.userEmail || 'No email'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-forest-900 px-3 py-1 rounded-full">
                                            <span className="font-bold text-yellow-400">{item.rating || '-'}</span>
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        </div>
                                    </div>
                                    <p className="text-forest-200 leading-relaxed">{item.message}</p>
                                    <p className="text-xs text-forest-500 mt-4">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {messages.length === 0 ? (
                            <p className="text-forest-400 text-center py-12">No messages yet.</p>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="bg-forest-800/50 border border-forest-700 p-6 rounded-xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-forest-700 p-2 rounded-full">
                                                <Mail className="w-5 h-5 text-forest-accent" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{msg.name}</p>
                                                <p className="text-xs text-forest-400">{msg.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-forest-200 leading-relaxed">{msg.message}</p>
                                    <p className="text-xs text-forest-500 mt-4">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminPage;
