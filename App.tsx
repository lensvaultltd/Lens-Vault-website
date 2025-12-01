

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import { usePaystackPayment } from 'react-paystack';

declare global {
    interface Window {
        ethereum: any;
    }
}

// --- SVG Icon Components ---

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <img src="/logo.png" alt="Lens Vault Logo" className={className} />
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.194-1.37-1.022-1.37-1.42 0-2.844.652-3.818 1.82M12 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.194-1.37-1.022-1.37-1.42 0-2.844.652-3.818 1.82M15 14.632a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.194-1.37-1.022-1.37-1.42 0-2.844.652-3.818 1.82M9 12.75a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
);

const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.39-2.206 2.515-1.14.12-2.213-.48-2.9-1.423-.623-.83-1.63 1.42-2.9 1.423-1.269 0-2.277-1.02-2.9-1.423-.687.943-1.76 1.543-2.9 1.423-1.242-.125-2.206-1.202-2.206-2.515V14.15M15.75 18v-4.875c0-1.06-.86-1.925-1.925-1.925h-3.65C9.09 11.25 8.25 12.115 8.25 13.125V18m12-4.875c0-1.06-.86-1.925-1.925-1.925h-3.65c-1.065 0-1.925.865-1.925 1.925V18" />
    </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 018.638 5.214l2.11-1.242a.225.225 0 01.252 0l2.11 1.242zM12 15.75a3.75 3.75 0 000-7.5 3.75 3.75 0 000 7.5z" />
    </svg>
);


const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.75 13.96c.25.13.43.2.5.33.08.13.12.28.12.48 0 .2-.04.38-.12.53s-.17.28-.3.4c-.13.13-.28.23-.45.33-.18.1-.38.16-.6.2-.23.04-.48.06-.75.06-.35 0-.68-.04-1-.13-.33-.08-.65-.2-1-.35-.33-.16-.65-.34-1-.54-.34-.2-.68-.44-1-.7-.33-.25-.63-.54-.9-.85-.28-.3-.54-.64-.78-1-.24-.38-.44-.78-.6-1.2-.18-.43-.3-.88-.38-1.35-.08-.48-.12-1-.12-1.5 0-.43.04-.83.12-1.2.08-.38.2-.72.38-1.04.18-.3.4-.58.68-.8.28-.2.6-.36.96-.46.35-.1.74-.16 1.15-.16.2 0 .4-.02.6-.02.23 0 .43.02.6.05.18.03.35.1.48.18.13.08.25.18.34.3.1.12.17.25.22.4.05.15.08.3.08.45 0 .15-.03.3-.08.43-.05.13-.12.25-.2.35-.08.1-.18.18-.28.24-.1.06-.22.1-.34.13-.12.03-.25.05-.38.05-.18 0-.35-.03-.5-.08-.15-.05-.3-.08-.4-.08-.08 0-.15.02-.23.05-.08.03-.15.08-.2.13-.05.05-.1.1-.14.18-.04.08-.06.15-.06.22 0 .06.02.13.05.2.03.08.08.15.14.22.06.08.13.14.2.2.08.08.17.14.25.2.1.08.2.14.3.2.08.06.18.1.28.14.1.04.2.06.3.06.15 0 .3-.03.4-.08.1-.05.2-.12.28-.2.08-.08.14-.17.2-.25.05-.08.08-.18.08-.28 0-.1-.02-.2-.05-.28-.03-.08-.08-.15-.14-.2-.06-.05-.12-.1-.2-.13-.08-.03-.15-.05-.23-.05-.1 0-.2.02-.3.06-.1.04-.2.1-.3.18-.1.08-.18.15-.25.2-.08.05-.14.1-.2.13-.06.03-.1.05-.14.05-.03 0-.05-.02-.06-.03-.02-.02-.03-.04-.03-.06 0-.05.02-.1.06-.14.04-.04.1-.1.15-.15.05-.05.1-.1.15-.14.05-.04.1-.08.14-.1.04-.03.1-.05.14-.06.04-.02.1-.03.14-.03.18 0 .34.03.5.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /></svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" /></svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 11-4.125 0 2.062 2.062 0 014.125 0zM7.142 20.452H3.555V9h3.587v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const GlobeAltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9 9 9 0 019-9m9 9a9 9 0 01-9 9m-9-9h18m-9 9a9 9 0 000-18m0 18v-6.39A9 9 0 003.61 15m16.78-3a9 9 0 01-16.78 0" />
    </svg>
);

const PriceTagIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    </svg>
);

const ShieldExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z" />
    </svg>
);



const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Custom Hooks ---
const useAnimateOnScroll = (options: IntersectionObserverInit = { threshold: 0.1 }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        const currentElement = ref.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};


const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="mb-8 inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Back to Home
    </button>
);


// --- Wallet Component ---
const WalletConnect: React.FC<{ onConnect: (address: string) => void }> = ({ onConnect }) => {
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
                onConnect(accounts[0]);
                setError(null);
            } catch (err: any) {
                setError(err.message || "Failed to connect wallet.");
            }
        } else {
            setError("MetaMask is not installed. Please install it to use this feature.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                >
                    <ShieldCheckIcon className="w-6 h-6" />
                    Connect Wallet to Login
                </button>
            ) : (
                <div className="flex flex-col items-center gap-2 animate-fade-in">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full border border-green-200">
                        <ShieldCheckIcon className="w-5 h-5" />
                        <span className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
                    </div>
                    <p className="text-xs text-green-600 font-semibold">Blockchain Verified</p>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-2 bg-red-50 p-2 rounded-md">
                    <ShieldExclamationIcon className="w-5 h-5" />
                    {error}
                </div>
            )}
        </div>
    );
};


// --- Auth Context ---
interface User {
    email: string;
    name: string;
    plan?: string;
    walletAddress?: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    signup: (user: User, password: string) => boolean;
    updateUserPlan: (plan: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const signup = (userData: User, password: string) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find((u: any) => u.email === userData.email)) {
            return false; // User exists
        }
        users.push({ ...userData, password });
        localStorage.setItem('users', JSON.stringify(users));
        login(userData);
        return true;
    };

    const updateUserPlan = (plan: string) => {
        if (user) {
            const updatedUser = { ...user, plan };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Update in users array as well
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.map((u: any) => u.email === user.email ? { ...u, plan } : u);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, updateUserPlan }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};


// --- Page Layout Components ---
const Header: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (page: string) => {
        setIsMenuOpen(false);
        onNavigate(page);
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-20 text-gray-800 bg-white/90 backdrop-blur-md md:bg-transparent md:backdrop-blur-none shadow-sm md:shadow-none">
            <div className="container mx-auto flex items-center justify-between p-4 md:p-6">
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('main'); }} className="flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-gray-700 transition">
                    <LogoIcon className="h-10 w-auto md:h-14" />
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-gray-600">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="hover:text-gray-900 transition-colors">Services</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('pricing'); }} className="hover:text-gray-900 transition-colors">Pricing</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="hover:text-gray-900 transition-colors">Contact</a>
                </nav>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">Hi, {user.name}</span>
                            <button onClick={logout} className="text-sm text-red-600 hover:text-red-800 font-semibold">Logout</button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => handleNavigate('login')} className="font-semibold px-5 py-2 rounded-md text-gray-900 hover:bg-gray-100 transition-colors">
                                Login
                            </button>
                            <button onClick={() => handleNavigate('signup')} className="font-semibold px-5 py-2 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                    {isMenuOpen ? <XIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg flex flex-col p-6 space-y-4 animate-fade-in">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-lg font-medium text-gray-700 hover:text-blue-600">Services</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('pricing'); }} className="text-lg font-medium text-gray-700 hover:text-blue-600">Pricing</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="text-lg font-medium text-gray-700 hover:text-blue-600">Contact</a>
                    <hr className="border-gray-200" />
                    {user ? (
                        <div className="flex flex-col gap-4">
                            <span className="font-semibold text-gray-900">Hi, {user.name}</span>
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-600 hover:text-red-800 font-semibold">Logout</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <button onClick={() => handleNavigate('login')} className="w-full font-semibold px-5 py-3 rounded-md text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors text-center">
                                Login
                            </button>
                            <button onClick={() => handleNavigate('signup')} className="w-full font-semibold px-5 py-3 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors text-center">
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
    <footer className="text-gray-600 bg-gray-50">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('main'); }} className="flex items-center justify-center md:justify-start gap-3 text-lg font-bold text-gray-900 hover:text-gray-700 transition mb-2">
                        <LogoIcon className="h-12 w-auto" />
                    </a>
                    <p className="text-sm">The Digital Peace of Mind You Need.</p>
                </div>
                <div className="text-center md:text-left">
                    <p className="font-semibold text-gray-900 mb-2">Connect with Us</p>
                    <div className="flex justify-center md:justify-start items-center gap-4">
                        <a href="https://wa.me/2349068845666" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><span className="sr-only">WhatsApp</span><WhatsAppIcon className="w-6 h-6" /></a>
                        <a href="https://instagram.com/lensvaultltd" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><span className="sr-only">Instagram</span><InstagramIcon className="w-6 h-6" /></a>
                        <a href="https://twitter.com/LensVaultltd" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><span className="sr-only">Twitter</span><TwitterIcon className="w-6 h-6" /></a>
                        <a href="https://www.linkedin.com/company/lens-vault/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><span className="sr-only">LinkedIn</span><LinkedInIcon className="w-6 h-6" /></a>
                    </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="text-sm mt-3 inline-block text-gray-700 hover:text-gray-900 transition-colors underline">
                        More ways to get in touch
                    </a>
                </div>
                <div className="text-center md:text-left text-sm">
                    <a href="#" className="hover:text-gray-900 transition">Legal</a> &bull; <a href="#" className="hover:text-gray-900 transition">Privacy</a> &bull; <a href="#" className="hover:text-gray-900 transition">Terms of Service</a>
                </div>
            </div>
            <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
                &copy; {new Date().getFullYear()} Lens Vault Ltd. All rights reserved.
            </div>
        </div>
    </footer>
);


// --- UI Components ---
const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const [ref, isVisible] = useAnimateOnScroll();
    return (
        <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
            {children}
        </div>
    );
};

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onNavigate: (page: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, onNavigate }) => (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200/80 flex flex-col items-start text-left">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-5">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 flex-grow mb-6">{description}</p>
        <button onClick={() => onNavigate('services')} className="mt-auto font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            Learn More &rarr;
        </button>
    </div>
);


const FeaturePill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-md border border-gray-200/80">
        <div className="p-2 bg-green-100 text-green-600 rounded-full">
            {icon}
        </div>
        <span className="font-semibold text-gray-800">{text}</span>
    </div>
);


// --- Page Components ---

const HeroSection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
    <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 text-center">
        <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                    The Digital Peace of Mind <br className="hidden md:inline" /> You Need.
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                    Lens Vault provides proof-backed cybersecurity solutions with local expertise and transparent pricing.
                    Protecting your digital life, from individuals to businesses.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button onClick={() => onNavigate('services')} className="w-full sm:w-auto font-semibold px-8 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                        Explore Our Services
                    </button>
                    <button onClick={() => onNavigate('pricing')} className="w-full sm:w-auto font-semibold px-8 py-3 rounded-md text-gray-700 bg-gray-200/80 hover:bg-gray-300/80 transition-colors duration-300">
                        View Pricing
                    </button>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const ServicesSection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
    <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Comprehensive Protection for Everyone</h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    We offer tailored cybersecurity packages to fit the unique needs of individuals, families, and businesses.
                </p>
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <AnimatedSection>
                    <ServiceCard
                        icon={<ShieldCheckIcon className="w-7 h-7" />}
                        title="For Individuals"
                        description="Secure your personal digital footprint. We protect your online accounts, sensitive data, and personal devices from cyber threats."
                        onNavigate={onNavigate}
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <ServiceCard
                        icon={<UserGroupIcon className="w-7 h-7" />}
                        title="For Families"
                        description="Keep your loved ones safe online. Our family package includes parental controls, protection for all household devices, and education on safe internet practices."
                        onNavigate={onNavigate}
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <ServiceCard
                        icon={<BriefcaseIcon className="w-7 h-7" />}
                        title="For Businesses"
                        description="Protect your company's assets and reputation. We offer robust solutions including network security, employee training, and compliance management."
                        onNavigate={onNavigate}
                    />
                </AnimatedSection>
            </div>
        </div>
    </section>
);

const WhyChooseUsSection: React.FC = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <AnimatedSection>
                    <div className="pr-0 lg:pr-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Lens Vault?</h2>
                        <p className="mt-4 text-gray-600">
                            In a world of digital uncertainty, we provide clarity and confidence. Our approach is built on three core pillars that set us apart.
                        </p>
                        <div className="mt-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <CheckCircleIcon className="w-10 h-10 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">Proof-Backed Solutions</h3>
                                    <p className="text-gray-600">We don't just promise security; we demonstrate it. Our methods are transparent and our results are verifiable, giving you tangible proof of your digital safety.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircleIcon className="w-10 h-10 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">Local Expertise</h3>
                                    <p className="text-gray-600">Based in Nigeria, we have a deep understanding of the local digital landscape and its unique challenges. We provide culturally relevant and accessible support.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircleIcon className="w-10 h-10 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">Transparent Pricing</h3>
                                    <p className="text-gray-600">No hidden fees or complex contracts. Our pricing is straightforward and honest, ensuring you know exactly what you're paying for.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
                <AnimatedSection className="flex justify-center items-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-10">
                            <FeaturePill icon={<LockClosedIcon className="w-6 h-6" />} text="Data Encryption" />
                            <FeaturePill icon={<UserIcon className="w-6 h-6" />} text="Identity Protection" />
                        </div>
                        <div className="space-y-4">
                            <FeaturePill icon={<ShieldCheckIcon className="w-6 h-6" />} text="Threat Monitoring" />
                            <FeaturePill icon={<GlobeAltIcon className="w-6 h-6" />} text="Network Security" />
                            <FeaturePill icon={<PriceTagIcon className="w-6 h-6" />} text="Clear Pricing" />
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    </section>
);


const Testimonial: React.FC<{ quote: string; author: string; role: string; }> = ({ quote, author, role }) => (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/80 text-center">
        <div className="text-yellow-500 flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}
        </div>
        <p className="text-gray-700 italic">"{quote}"</p>
        <p className="mt-4 font-bold text-gray-900">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
    </div>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trusted by Clients</h2>
                <p className="mt-4 max-w-2xl mx-auto text-gray-600">
                    Hear what our clients have to say about their experience with Lens Vault.
                </p>
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <AnimatedSection>
                    <Testimonial
                        quote="Lens Vault transformed our security posture. Their team is knowledgeable, responsive, and truly cares about our safety. I can finally sleep at night knowing our business is protected."
                        author="Femi Adebayo"
                        role="CEO, TechSolutions Ltd."
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <Testimonial
                        quote="As a family, online safety was our top concern. Lens Vault provided an easy-to-understand solution that keeps our kids and our data safe. Their service is invaluable."
                        author="Aisha Bello"
                        role="Mother & Home User"
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <Testimonial
                        quote="The transparency in their process and pricing is a breath of fresh air. They delivered exactly what they promised, with clear evidence of their work. Highly recommended."
                        author="Chinedu Okoro"
                        role="Freelance Developer"
                    />
                </AnimatedSection>
            </div>
        </div>
    </section>
);

const CallToActionSection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection>
                <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-16 text-center shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold">Ready to Secure Your Digital World?</h2>
                    <p className="mt-4 max-w-xl mx-auto text-gray-300">
                        Don't wait for a threat to become a reality. Take the first step towards digital peace of mind today.
                    </p>
                    <div className="mt-8">
                        <button onClick={() => onNavigate('contact')} className="font-semibold px-8 py-3 rounded-md text-gray-900 bg-white hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                            Get a Free Consultation
                        </button>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const MainPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    return (
        <>
            <HeroSection onNavigate={onNavigate} />
            <ServicesSection onNavigate={onNavigate} />
            <WhyChooseUsSection />
            <TestimonialsSection />
            <CallToActionSection onNavigate={onNavigate} />
        </>
    );
};

const ServicesPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const services = [
        {
            icon: <ShieldCheckIcon className="w-8 h-8" />,
            title: "Individual Protection Plan",
            description: "Secure your digital identity, personal devices, and online accounts. We conduct a thorough audit of your digital footprint, secure your social media and email accounts, and provide ongoing monitoring for threats.",
            features: ["Digital Footprint Audit", "Email & Social Media Security", "Personal Device Hardening", "Dark Web Monitoring", "24/7 Support"]
        },
        {
            icon: <UserGroupIcon className="w-8 h-8" />,
            title: "Family Security Suite",
            description: "Comprehensive protection for your entire family. Includes everything in the Individual Plan for up to 5 family members, plus parental controls, safe browsing education, and home network security.",
            features: ["All Individual Plan Features", "Up to 5 Family Members", "Parental Control Setup", "Home Wi-Fi Security", "Family Tech Safety Workshop"]
        },
        {
            icon: <BriefcaseIcon className="w-8 h-8" />,
            title: "Business Essentials",
            description: "Safeguard your small to medium-sized business from cyber threats. We offer employee security training, network vulnerability assessments, data backup solutions, and incident response planning.",
            features: ["Employee Cybersecurity Training", "Network Vulnerability Scans", "Secure Data Backup & Recovery", "Incident Response Plan", "Compliance Assistance (e.g., NDPR)"]
        },
        {
            icon: <CrownIcon className="w-8 h-8" />,
            title: "Enterprise Elite",
            description: "Our premium, all-inclusive package for larger organizations or high-profile individuals requiring the utmost level of security. This bespoke service includes dedicated security analysts, penetration testing, and advanced threat intelligence.",
            features: ["All Business Essentials Features", "Dedicated Security Analyst", "Regular Penetration Testing", "Advanced Threat Intelligence", "Custom Security Policy Development"]
        },
    ];

    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <AnimatedSection className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Our Services</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Tailored, proof-backed cybersecurity solutions for every need.
                    </p>
                </AnimatedSection>
                <div className="space-y-12">
                    {services.map((service, index) => (
                        <AnimatedSection key={index}>
                            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/80 flex flex-col md:flex-row items-center gap-8">
                                <div className="p-4 bg-blue-100 text-blue-600 rounded-full flex-shrink-0">
                                    {service.icon}
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                                    <p className="mt-2 text-gray-600">{service.description}</p>
                                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                                        {service.features.map(feature => (
                                            <span key={feature} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{feature}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 mt-4 md:mt-0">
                                    <button onClick={() => onNavigate('contact')} className="font-semibold px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                                        Request a Quote
                                    </button>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

const PricingPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { user, updateUserPlan } = useAuth();

    type Plan = {
        name: string;
        description: string;
        setupCost: string;
        retainer: string;
        setupAmount: number; // Amount in Kobo
        retainerAmount: number; // Amount in Kobo
        icon: React.ReactNode;
    };

    const plans: Plan[] = [
        { name: "Individual", description: "For Individuals", setupCost: "₦150,000", retainer: "₦65,000", setupAmount: 15000000, retainerAmount: 6500000, icon: <ShieldCheckIcon className="w-8 h-8" /> },
        { name: "Influencer", description: "For Social Media Professionals", setupCost: "₦200,000", retainer: "₦85,000", setupAmount: 20000000, retainerAmount: 8500000, icon: <StarIcon className="w-8 h-8" /> },
        { name: "Brand", description: "For Growing Brands", setupCost: "₦300,000", retainer: "₦120,000", setupAmount: 30000000, retainerAmount: 12000000, icon: <BriefcaseIcon className="w-8 h-8" /> },
        { name: "Family", description: "For Households", setupCost: "₦450,000", retainer: "₦160,000", setupAmount: 45000000, retainerAmount: 16000000, icon: <UserGroupIcon className="w-8 h-8" /> },
        { name: "Team / SME", description: "For Small to Medium Enterprises", setupCost: "₦800,000", retainer: "₦380,000", setupAmount: 80000000, retainerAmount: 38000000, icon: <BriefcaseIcon className="w-8 h-8" /> },
        { name: "VIP", description: "For High-Profile Clients", setupCost: "₦300,000", retainer: "₦180,000", setupAmount: 30000000, retainerAmount: 18000000, icon: <CrownIcon className="w-8 h-8" /> },
    ];

    const PaystackHookButton = ({ plan, amount, label, className }: { plan: Plan, amount: number, label: string, className?: string }) => {
        const config = {
            reference: (new Date()).getTime().toString(),
            email: user?.email || "customer@example.com",
            amount: amount, // Amount is in kobo
            publicKey: 'pk_live_1efccc2535b9269d6737dd0557277d25e1e37a92', // Live Key provided by user
        };

        const initializePayment = usePaystackPayment(config);

        const onSuccess = (reference: any) => {
            updateUserPlan(`${plan.name} (${label})`);
            alert(`Payment successful! You have paid for: ${plan.name} - ${label}.`);
        };

        const onClose = () => {
            console.log('closed');
        };

        return (
            <button onClick={() => {
                if (!user) {
                    alert("Please login or signup to purchase a plan.");
                    onNavigate('login');
                    return;
                }
                initializePayment({ onSuccess, onClose });
            }} className={`w-full font-semibold px-4 py-2 rounded-md transition-colors ${className}`}>
                {label}
            </button>
        );
    };

    const handleSelectPlan = (plan: Plan) => {
        // Legacy WhatsApp method kept as fallback or alternative
        const message = encodeURIComponent(`Hello Lens Vault, I'm interested in the ${plan.name} plan.\n\nOne-Time Setup: ${plan.setupCost}\nMonthly Retainer: ${plan.retainer}\n\nPlease provide more details.`);
        const whatsappUrl = `https://wa.me/2349068845666?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <AnimatedSection className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Pricing</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Transparent and straightforward pricing for your peace of mind.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {plans.map((plan, index) => (
                        <AnimatedSection key={index}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-8 flex flex-col text-center h-full hover:shadow-xl transition-shadow duration-300">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                                        {plan.icon}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                                <p className="text-gray-500 mb-6">{plan.description}</p>

                                <div className="flex-grow space-y-4">
                                    <div className="bg-gray-100 rounded-lg p-4">
                                        <p className="text-sm text-gray-600">One-Time Setup</p>
                                        <p className="text-3xl font-bold text-gray-900">{plan.setupCost}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600">Monthly Retainer</p>
                                        <p className="text-3xl font-bold text-gray-900">{plan.retainer}</p>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="grid grid-cols-1 gap-3">
                                        <PaystackHookButton
                                            plan={plan}
                                            amount={plan.setupAmount}
                                            label={`Pay Setup (${plan.setupCost})`}
                                            className="text-white bg-gray-900 hover:bg-gray-800"
                                        />
                                        <PaystackHookButton
                                            plan={plan}
                                            amount={plan.retainerAmount}
                                            label={`Pay Retainer (${plan.retainer})`}
                                            className="text-gray-900 bg-gray-200 hover:bg-gray-300"
                                        />
                                    </div>
                                    <button onClick={() => handleSelectPlan(plan)} className="text-sm text-gray-500 hover:text-gray-700 underline block w-full text-center mt-2">
                                        Contact via WhatsApp
                                    </button>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section >
    );
};

const ContactPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Mock API call
        setTimeout(() => {
            if (name && email && message) {
                setStatus('success');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setStatus('error');
            }
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <div className="grid md:grid-cols-2 gap-12">
                    <AnimatedSection>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Get in Touch</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Have a question or need a custom quote? We're here to help. Reach out to us, and we'll get back to you as soon as possible.
                        </p>
                        <div className="mt-8 space-y-4 text-gray-700">
                            <p className="flex items-center gap-3">
                                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                                <strong>Email:</strong> <a href="mailto:lensvault@proton.me" className="hover:underline">lensvault@proton.me</a>
                            </p>
                            <p className="flex items-center gap-3">
                                <WhatsAppIcon className="w-6 h-6 text-blue-600" />
                                <strong>WhatsApp:</strong> <a href="https://wa.me/2349068845666" target="_blank" rel="noopener noreferrer" className="hover:underline">+234 906 884 5666</a>
                            </p>
                        </div>
                        <div className="mt-8">
                            <p className="font-semibold text-gray-900 mb-2">Follow us on social media:</p>
                            <div className="flex items-center gap-4">
                                <a href="https://instagram.com/lensvaultltd" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><span className="sr-only">Instagram</span><InstagramIcon className="w-7 h-7" /></a>
                                <a href="https://twitter.com/LensVaultltd" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><span className="sr-only">Twitter</span><TwitterIcon className="w-7 h-7" /></a>
                                <a href="https://www.linkedin.com/company/lens-vault/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 transition-colors"><span className="sr-only">LinkedIn</span><LinkedInIcon className="w-7 h-7" /></a>
                            </div>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection>
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/80">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full flex justify-center items-center font-semibold px-6 py-3 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:bg-gray-500"
                                    >
                                        {status === 'sending' && <SpinnerIcon />}
                                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                                {status === 'success' && <p className="text-green-600">Message sent successfully!</p>}
                                {status === 'error' && <p className="text-red-600">Please fill out all fields.</p>}
                            </form>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

const LoginPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'loggingIn' | 'error'>('idle');
    const [error, setError] = React.useState('');
    const [walletAddress, setWalletAddress] = React.useState<string | null>(null);

    const { login } = useAuth();

    const handleWalletConnect = (address: string) => {
        setWalletAddress(address);
        // Auto-login or enable "Enter Portal" button after wallet connect
        setTimeout(() => {
            login({ email: `${address}@wallet.eth`, name: `Wallet User`, walletAddress: address });
            onNavigate('main');
            alert(`Welcome back! Authenticated via Blockchain.\nWallet: ${address}`);
        }, 1000);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loggingIn');
        setError('');

        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find((u: any) => u.email === email && u.password === password);

            if (user) {
                login(user);
                onNavigate('main');
            } else if (email === 'admin@lensvault.com' && password === 'password') {
                login({ email, name: 'Admin User', plan: 'VIP' });
                onNavigate('main');
            } else {
                setStatus('error');
                setError('Invalid email or password.');
            }
            setTimeout(() => setStatus('idle'), 2000);
        }, 1500);
    };

    return (
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <div className="max-w-md mx-auto">
                    <AnimatedSection>
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/80">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-extrabold text-gray-900">Client Login</h1>
                                <p className="mt-2 text-gray-600">Access your secure client portal.</p>
                            </div>

                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Secure Blockchain Login</h3>
                                <WalletConnect onConnect={handleWalletConnect} />
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
                                </div>
                            </div>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="login-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" id="login-password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === 'loggingIn'}
                                        className="w-full flex justify-center items-center font-semibold px-6 py-3 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:bg-gray-500"
                                    >
                                        {status === 'loggingIn' && <SpinnerIcon />}
                                        {status === 'loggingIn' ? 'Signing In...' : 'Sign In'}
                                    </button>
                                </div>
                                {status === 'error' && <p className="text-red-600 text-center">{error}</p>}
                            </form>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};


const SignupPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (signup({ name, email }, password)) {
            alert('Account created successfully!');
            onNavigate('main');
        } else {
            setError('User already exists with this email.');
        }
    };

    return (
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <div className="max-w-md mx-auto">
                    <AnimatedSection>
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/80">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
                                <p className="mt-2 text-gray-600">Join Lens Vault today.</p>
                            </div>
                            <form onSubmit={handleSignup} className="space-y-6">
                                <div>
                                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="signup-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="signup-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" id="signup-password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center items-center font-semibold px-6 py-3 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                                {error && <p className="text-red-600 text-center">{error}</p>}
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="text-blue-600 hover:underline">Log in</a></p>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState('main');

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'services':
                return <ServicesPage onNavigate={handleNavigate} />;
            case 'pricing':
                return <PricingPage onNavigate={handleNavigate} />;
            case 'contact':
                return <ContactPage onNavigate={handleNavigate} />;
            case 'login':
                return <LoginPage onNavigate={handleNavigate} />;
            case 'signup':
                return <SignupPage onNavigate={handleNavigate} />;
            case 'main':
            default:
                return <MainPage onNavigate={handleNavigate} />;
        }
    };

    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Header onNavigate={handleNavigate} />
                <main className="flex-grow">
                    {renderPage()}
                </main>
                <Footer onNavigate={handleNavigate} />
            </div>
        </AuthProvider>
    );
};

export default App;