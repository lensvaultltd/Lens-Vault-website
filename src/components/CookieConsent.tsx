import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

interface CookieConsentProps {
    onAccept: () => void;
    onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show banner after 2 seconds
            setTimeout(() => setIsVisible(true), 2000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
        onAccept();
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setIsVisible(false);
        onDecline();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
            <div className="container mx-auto max-w-4xl">
                <div className="glass-card border border-forest-700 p-6 md:p-8 shadow-2xl">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-forest-800 rounded-full">
                            <Cookie className="w-6 h-6 text-forest-accent" />
                        </div>

                        <div className="flex-grow">
                            <h3 className="text-lg font-bold text-white mb-2">
                                We Value Your Privacy
                            </h3>
                            <p className="text-forest-300 text-sm mb-4">
                                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                                By clicking "Accept", you consent to our use of cookies.
                                Read our{' '}
                                <a href="#" className="text-forest-accent hover:underline">Privacy Policy</a>
                                {' '}and{' '}
                                <a href="#" className="text-forest-accent hover:underline">Cookie Policy</a>
                                {' '}to learn more.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="px-6 py-2 bg-forest-accent text-forest-900 font-bold rounded-lg hover:bg-white transition-colors"
                                >
                                    Accept All Cookies
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="px-6 py-2 border border-forest-600 text-white font-medium rounded-lg hover:bg-forest-800 transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleDecline}
                            className="flex-shrink-0 p-2 text-forest-400 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
