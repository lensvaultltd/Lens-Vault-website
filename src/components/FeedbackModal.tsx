import React, { useState } from 'react';
import { X, Star, MessageSquare, Send, Loader } from 'lucide-react';
import { submitFeedback } from '../services/databaseService';
import { useAuth } from '../context/AuthContext';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setStatus('submitting');
        try {
            const success = await submitFeedback(user?.id || null, message, rating || undefined);
            if (success) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setMessage('');
                    setRating(0);
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-forest-900 border border-forest-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-forest-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-forest-800 p-3 rounded-full">
                            <MessageSquare className="w-6 h-6 text-forest-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Your Feedback</h2>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-forest-300">Your feedback helps us improve Lens Vault.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-forest-300 mb-2">
                                    How would you rate your experience?
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-forest-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="feedback-message" className="block text-sm font-medium text-forest-300 mb-2">
                                    Tell us what you think
                                </label>
                                <textarea
                                    id="feedback-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full bg-forest-800/50 border border-forest-600 rounded-xl p-4 text-white placeholder-forest-500 focus:outline-none focus:border-forest-accent focus:ring-1 focus:ring-forest-accent transition-all resize-none"
                                    placeholder="Share your suggestions, report a bug, or just say hi..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting' || !message.trim()}
                                className="w-full py-3 bg-forest-accent hover:bg-white hover:text-forest-900 text-forest-900 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Feedback
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {status === 'error' && (
                                <p className="text-red-400 text-center text-sm">
                                    Something went wrong. Please try again.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
