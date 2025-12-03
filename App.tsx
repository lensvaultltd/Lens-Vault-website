

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import { usePaystackPayment } from 'react-paystack';
import * as authService from './src/services/authService';
import * as dbService from './src/services/databaseService';
import { SocialLogin } from './src/components/SocialLogin';
import AnimatedBackground from './src/components/AnimatedBackground';
import type { User } from './src/types/database.types';
import {
    ShieldCheck, Users, Briefcase, Star, Crown, Lock, FileText, User as UserIcon, Mail, Loader,
    Menu, X, CheckCircle, Globe, Tag, ShieldAlert
} from 'lucide-react';

declare global {
    interface Window {
        ethereum: any;
    }
}

// --- SVG Icon Components ---

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <img src="/logo.png" alt="Lens Vault Logo" className={className} />
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
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(true);

    useEffect(() => {
        setIsMetaMaskInstalled(typeof window !== 'undefined' && !!window.ethereum);
    }, []);

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
            setIsMetaMaskInstalled(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {!account ? (
                isMetaMaskInstalled ? (
                    <button
                        onClick={connectWallet}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                    >
                        <ShieldCheck className="w-6 h-6" />
                        Connect Wallet to Login
                    </button>
                ) : (
                    <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <ShieldAlert className="w-6 h-6" />
                        Install MetaMask to Login
                    </a>
                )
            ) : (
                <div className="flex flex-col items-center gap-2 animate-fade-in">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full border border-green-200">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
                    </div>
                    <p className="text-xs text-green-600 font-semibold">Blockchain Verified</p>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-2 bg-red-50 p-2 rounded-md">
                    <ShieldAlert className="w-5 h-5" />
                    {error}
                </div>
            )}
        </div>
    );
};


// --- Auth Context ---
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, password: string, name: string) => Promise<boolean>;
    loginWithWallet: (walletAddress: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUserPlan: (plan: string) => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing session on mount and listen for changes
    useEffect(() => {
        const unsubscribe = authService.observeAuthState((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setError(null);
        setLoading(true);
        try {
            const result = await authService.signInWithEmail(email, password);
            if (result.success && result.user) {
                setUser(result.user);
                return true;
            } else {
                setError(result.error || 'Login failed');
                return false;
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, password: string, name: string): Promise<boolean> => {
        setError(null);
        setLoading(true);
        try {
            const result = await authService.signUpWithEmail(email, password, name);
            if (result.success && result.user) {
                setUser(result.user);
                return true;
            } else {
                setError(result.error || 'Signup failed');
                return false;
            }
        } catch (err: any) {
            setError(err.message || 'Signup failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginWithWallet = async (walletAddress: string): Promise<boolean> => {
        setError(null);
        setLoading(true);
        try {
            const result = await authService.signInWithWallet(walletAddress);
            if (result.success && result.user) {
                setUser(result.user);
                return true;
            } else {
                setError(result.error || 'Wallet login failed');
                return false;
            }
        } catch (err: any) {
            setError(err.message || 'Wallet login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setLoading(true);
        try {
            await authService.signOut();
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateUserPlan = async (plan: string): Promise<void> => {
        if (user) {
            try {
                const success = await dbService.updateUserPlan(user.id, plan);
                if (success) {
                    setUser({ ...user, plan });
                }
            } catch (err) {
                console.error('Update plan error:', err);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, loginWithWallet, logout, updateUserPlan, error }}>
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
        <header className="fixed top-0 left-0 right-0 z-50 text-white transition-all duration-300 py-4 md:py-6">
            <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('main'); }} className="flex items-center gap-2 text-xl md:text-2xl font-bold text-white tracking-wide z-50 relative">
                    <LogoIcon className="h-8 md:h-10 w-auto" />
                    Lens Vault
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10 text-white/90 font-medium text-lg">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('main'); }} className="hover:text-forest-accent transition-colors relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-forest-accent transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="hover:text-forest-accent transition-colors relative group">
                        Services
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-forest-accent transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('pricing'); }} className="hover:text-forest-accent transition-colors relative group">
                        Pricing
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-forest-accent transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="hover:text-forest-accent transition-colors relative group">
                        Contact
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-forest-accent transition-all group-hover:w-full"></span>
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white hover:text-gray-200 focus:outline-none z-50 relative">
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-forest-900/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('main'); }} className="text-3xl font-bold text-white hover:text-forest-accent transition-colors">Home</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('services'); }} className="text-3xl font-bold text-white hover:text-forest-accent transition-colors">Services</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('pricing'); }} className="text-3xl font-bold text-white hover:text-forest-accent transition-colors">Pricing</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="text-3xl font-bold text-white hover:text-forest-accent transition-colors">Contact</a>
            </div>
        </header>
    );
};

const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
    <footer className="text-white bg-forest-900 pt-16 pb-8 border-t border-forest-800">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
                {/* Brand Column */}
                <div className="md:col-span-1">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('main'); }} className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                        <LogoIcon className="h-8 w-auto" />
                        Lens Vault
                    </a>
                    <p className="text-forest-300 text-sm leading-relaxed">
                        The Digital Peace of Mind You Need. Protecting your digital life with proof-backed security.
                    </p>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Company</h3>
                    <ul className="space-y-2 text-forest-300">
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('main'); }} className="hover:text-forest-accent transition-colors">Home</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('services'); }} className="hover:text-forest-accent transition-colors">Services</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('pricing'); }} className="hover:text-forest-accent transition-colors">Pricing</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-forest-accent transition-colors">Contact</a></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Support</h3>
                    <ul className="space-y-2 text-forest-300">
                        <li><a href="#" className="hover:text-forest-accent transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-forest-accent transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-forest-accent transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-forest-accent transition-colors">FAQ</a></li>
                    </ul>
                </div>

                {/* Social Column */}
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Connect</h3>
                    <div className="flex gap-4">
                        <a href="https://twitter.com/LensVaultltd" target="_blank" rel="noopener noreferrer" className="bg-forest-800 p-2 rounded-full hover:bg-forest-accent hover:text-white transition-all text-forest-300">
                            <TwitterIcon className="w-5 h-5" />
                        </a>
                        <a href="https://instagram.com/lensvaultltd" target="_blank" rel="noopener noreferrer" className="bg-forest-800 p-2 rounded-full hover:bg-forest-accent hover:text-white transition-all text-forest-300">
                            <InstagramIcon className="w-5 h-5" />
                        </a>
                        <a href="https://www.linkedin.com/company/lens-vault/" target="_blank" rel="noopener noreferrer" className="bg-forest-800 p-2 rounded-full hover:bg-forest-accent hover:text-white transition-all text-forest-300">
                            <LinkedInIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-forest-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-forest-400">
                <p>&copy; {new Date().getFullYear()} Lens Vault Ltd. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </div>
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
    <div className="glass-card p-6 md:p-8 h-full flex flex-col items-start text-left hover:transform hover:-translate-y-2 transition-all duration-300 group">
        <div className="p-4 bg-forest-800 text-forest-accent rounded-full mb-6 shadow-inner group-hover:bg-forest-accent group-hover:text-forest-900 transition-colors">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-forest-200 flex-grow mb-6 leading-relaxed">{description}</p>
        <button onClick={() => onNavigate('services')} className="mt-auto font-bold text-forest-accent hover:text-white transition-colors flex items-center gap-2">
            Learn More <span className="text-xl">&rarr;</span>
        </button>
    </div>
);


const FeaturePill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center gap-3 glass-card p-4 shadow-md border border-forest-700/50">
        <div className="p-2 bg-forest-800 text-forest-accent rounded-full">
            {icon}
        </div>
        <span className="font-semibold text-white">{text}</span>
    </div>
);


// --- Page Components ---

const HeroSection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { login, user, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const success = await login(email, password);
            if (success) {
                // Redirect or show success
            } else {
                setErrorMsg('Invalid credentials');
            }
        } catch (err) {
            setErrorMsg('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-accent/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest-accent/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content */}
                <div className="text-left space-y-8">
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
                        Lens Vault <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-accent to-white">Build Your Mind</span>
                    </h1>
                    <p className="text-lg text-forest-300 max-w-xl leading-relaxed font-light">
                        Secure your digital presence with advanced cybersecurity solutions. Proof-backed protection for individuals and businesses.
                    </p>
                    <button
                        onClick={() => onNavigate('services')}
                        className="mt-8 px-10 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white hover:text-forest-900 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Get Started
                    </button>
                </div>

                {/* Right Login Card */}
                <div className="flex justify-center lg:justify-end">
                    {user ? (
                        <div className="glass-card p-6 md:p-10 w-full max-w-md text-center border border-forest-700/50">
                            <div className="w-20 h-20 bg-forest-800 rounded-full mx-auto mb-6 flex items-center justify-center border border-forest-700">
                                <UserIcon className="w-10 h-10 text-forest-accent" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-forest-300 mb-8">{user.name}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-forest-900/50 p-4 rounded-2xl border border-forest-700/50">
                                    <p className="text-xs text-forest-400 uppercase tracking-wider mb-1">Plan</p>
                                    <p className="text-forest-accent font-bold">{user.plan || 'Free'}</p>
                                </div>
                                <div className="bg-forest-900/50 p-4 rounded-2xl border border-forest-700/50">
                                    <p className="text-xs text-forest-400 uppercase tracking-wider mb-1">Status</p>
                                    <p className="text-green-400 font-bold">Active</p>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl transition-colors border border-red-500/20"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-md">
                            <h2 className="text-4xl font-bold text-white mb-10 text-center tracking-tight">Member Login</h2>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400 group-focus-within:text-forest-accent transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent border border-forest-600 rounded-full py-4 pl-14 pr-6 text-white placeholder-forest-500 focus:outline-none focus:border-forest-accent focus:ring-1 focus:ring-forest-accent transition-all"
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400 group-focus-within:text-forest-accent transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent border border-forest-600 rounded-full py-4 pl-14 pr-6 text-white placeholder-forest-500 focus:outline-none focus:border-forest-accent focus:ring-1 focus:ring-forest-accent transition-all"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm text-forest-300 px-2">
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                        <input type="checkbox" className="rounded border-forest-600 bg-transparent text-forest-accent focus:ring-offset-0 focus:ring-forest-accent" />
                                        Remember me
                                    </label>
                                    <a href="#" className="hover:text-white transition-colors">Forgot Password?</a>
                                </div>

                                {errorMsg && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{errorMsg}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-forest-accent to-forest-accentHover hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] text-white font-bold rounded-full transition-all transform hover:scale-[1.02] mt-4"
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>

                                <p className="text-center text-sm text-forest-400 mt-8">
                                    Not a member? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }} className="text-white font-semibold hover:underline ml-1">Sign up now</a>
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

const ServicesSection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection className="text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white">Comprehensive Protection for Everyone</h2>
                <p className="mt-4 max-w-2xl mx-auto text-white/80 text-lg">
                    We offer tailored cybersecurity packages to fit the unique needs of individuals, families, and businesses.
                </p>
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <AnimatedSection>
                    <ServiceCard
                        icon={<ShieldCheck className="w-7 h-7" />}
                        title="For Individuals"
                        description="Secure your personal digital footprint. We protect your online accounts, sensitive data, and personal devices from cyber threats."
                        onNavigate={onNavigate}
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <ServiceCard
                        icon={<Users className="w-7 h-7" />}
                        title="For Families"
                        description="Keep your loved ones safe online. Our family package includes parental controls, protection for all household devices, and education on safe internet practices."
                        onNavigate={onNavigate}
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <ServiceCard
                        icon={<Briefcase className="w-7 h-7" />}
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
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Why Lens Vault?</h2>
                        <p className="mt-4 text-white/90 text-lg">
                            In a world of digital uncertainty, we provide clarity and confidence. Our approach is built on three core pillars that set us apart.
                        </p>
                        <div className="mt-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-white">Proof-Backed Solutions</h3>
                                    <p className="text-white/80">We don't just promise security; we demonstrate it. Our methods are transparent and our results are verifiable, giving you tangible proof of your digital safety.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-white">Local Expertise</h3>
                                    <p className="text-white/80">Based in Nigeria, we have a deep understanding of the local digital landscape and its unique challenges. We provide culturally relevant and accessible support.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-white">Transparent Pricing</h3>
                                    <p className="text-white/80">No hidden fees or complex contracts. Our pricing is straightforward and honest, ensuring you know exactly what you're paying for.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
                <AnimatedSection className="flex justify-center items-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-10">
                            <FeaturePill icon={<Lock className="w-6 h-6" />} text="Data Encryption" />
                            <FeaturePill icon={<UserIcon className="w-6 h-6" />} text="Identity Protection" />
                        </div>
                        <div className="space-y-4">
                            <FeaturePill icon={<ShieldCheck className="w-6 h-6" />} text="Threat Monitoring" />
                            <FeaturePill icon={<Globe className="w-6 h-6" />} text="Network Security" />
                            <FeaturePill icon={<Tag className="w-6 h-6" />} text="Clear Pricing" />
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    </section>
);


const Testimonial: React.FC<{ quote: string; author: string; role: string; }> = ({ quote, author, role }) => (
    <div className="glass-card p-6 md:p-8 text-center h-full flex flex-col justify-center border border-forest-700/30">
        <div className="text-yellow-400 flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />)}
        </div>
        <p className="text-forest-100 italic mb-6">"{quote}"</p>
        <div>
            <p className="font-bold text-white">{author}</p>
            <p className="text-sm text-forest-accent font-medium">{role}</p>
        </div>
    </div>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <AnimatedSection className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Trusted by Clients</h2>
                <p className="mt-4 max-w-2xl mx-auto text-white/80">
                    Hear what our partners have to say about their experience with Lens Vault.
                </p>
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <AnimatedSection>
                    <Testimonial
                        quote="Lens Vault's security infrastructure allowed us to scale our web solutions with confidence. Their vulnerability assessment was an eye-opener."
                        author="Founder"
                        role="OrivonEdge"
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <Testimonial
                        quote="Protecting our community members online is paramount. Lens Vault provided the education and tools we needed to ensure everyone stays safe."
                        author="Founder"
                        role="The Savwomen"
                    />
                </AnimatedSection>
                <AnimatedSection>
                    <Testimonial
                        quote="As an innovation hub, intellectual property security is key. Lens Vault delivered a robust protection strategy for our startups."
                        author="Program Director"
                        role="Nile Collective Lab"
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
                <div className="glass-card p-8 md:p-16 text-center border border-forest-700/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-forest-accent to-transparent opacity-50"></div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white">Ready to Secure Your Digital World?</h2>
                    <p className="mt-4 max-w-xl mx-auto text-forest-200 text-lg">
                        Don't wait for a threat to become a reality. Take the first step towards digital peace of mind today.
                    </p>
                    <div className="mt-8">
                        <button onClick={() => onNavigate('contact')} className="font-bold px-8 py-4 rounded-full text-forest-900 bg-forest-accent hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg shadow-forest-accent/20">
                            Get a Free Consultation
                        </button>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const TrustedCollaboratorsSection: React.FC = () => (
    <section className="py-12 border-y border-white/5 bg-white/5">
        <div className="container mx-auto px-6">
            <p className="text-center text-forest-300 mb-8 uppercase tracking-widest text-sm font-semibold">Trusted Collaborators & Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
                <a href="https://www.orivonedge.dev/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-transform hover:scale-105">
                    <img src="/assets/orivon.png" alt="OrivonEdge" className="h-12 md:h-16 w-auto object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" />
                </a>
                <a href="https://www.instagram.com/thesavwomen/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-transform hover:scale-105">
                    <img src="/assets/savwomen.png" alt="The Savwomen" className="h-12 md:h-16 w-auto object-contain" />
                </a>
                <a href="https://www.linkedin.com/company/honoris-collective-lab-nile-university-of-nigeria?originalSubdomain=ng" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-transform hover:scale-105">
                    <img src="/assets/nile.png" alt="Nile Collective Lab" className="h-12 md:h-16 w-auto object-contain bg-white/10 rounded-lg p-1" />
                </a>
            </div>
        </div>
    </section>
);

const MainPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    return (
        <>
            <HeroSection onNavigate={onNavigate} />
            <TrustedCollaboratorsSection />
            <ServicesSection onNavigate={onNavigate} />
            <WhyChooseUsSection />
            <TestimonialsSection />
            <CallToActionSection onNavigate={onNavigate} />
        </>
    );
};

const ServicesPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const coreServices = [
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Vulnerability Assessment",
            description: "We take a close look at your accounts, devices, and online presence to identify weak points that put you at risk. From passwords to privacy settings, we show you exactly what needs fixing."
        },
        {
            icon: <Lock className="w-8 h-8" />,
            title: "Security Audit & Protection Setup",
            description: "We secure everything that matters — your social media, emails, devices, and identity. This includes password manager setup, 2FA across all accounts, device hardening, scam-prevention tools, and brand protection checks. You get a clear before-and-after report showing the improvements made."
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Digital Estate Planning",
            description: "We help you organize and protect your online assets for the future. You choose who can access what, how your accounts should be handled, and how private data should be preserved or deleted. It's modern peace of mind for the digital age."
        }
    ];

    const packages = [
        {
            icon: <UserIcon className="w-8 h-8" />,
            title: "Individual / Personal",
            description: "Complete protection for 1 person. Full vulnerability assessment, security setup, and digital estate planning tailored to your personal digital life.",
            coverage: "1 person"
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: "Influencer Protection",
            description: "Protection for 1 primary account plus social assistants. Extra monitoring and platform security to protect your brand and online presence.",
            coverage: "1 primary + social assistants"
        },
        {
            icon: <Briefcase className="w-8 h-8" />,
            title: "Brand",
            description: "Core team protection with account and device supervision for each staff member. Safeguard your brand reputation and business assets.",
            coverage: "Core team"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Family Package",
            description: "Comprehensive protection for up to 5 family members. Shared vault and common network security with scaled pricing for families.",
            coverage: "Up to 5 members"
        },
        {
            icon: <Briefcase className="w-8 h-8" />,
            title: "Team / SME",
            description: "Protection for small to medium enterprises with up to 10 users. Includes team training, shared security protocols, and economies of scale.",
            coverage: "Up to 10 users"
        },
        {
            icon: <Crown className="w-8 h-8" />,
            title: "VIP",
            description: "Premium protection for very important persons. Dedicated security analyst, priority support, and advanced threat intelligence for high-profile individuals.",
            coverage: "1 VIP + support team"
        }
    ];

    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <BackButton onClick={() => onNavigate('main')} />

                {/* Header */}
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">What Lens Vault Does</h1>
                    <p className="max-w-3xl mx-auto text-xl text-white/90 leading-relaxed">
                        Lens Vault protects your digital life with three essential services designed to keep you safe long before problems happen.
                    </p>
                </AnimatedSection>

                {/* Core Services */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Our Core Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coreServices.map((service, index) => (
                            <AnimatedSection key={index}>
                                <div className="glass-card p-6 md:p-8 h-full group hover:bg-forest-800/50 transition-colors">
                                    <div className="flex justify-center mb-6">
                                        <div className="p-4 bg-forest-800 text-forest-accent rounded-full shadow-inner group-hover:bg-forest-accent group-hover:text-forest-900 transition-colors">
                                            {service.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white text-center mb-4">{service.title}</h3>
                                    <p className="text-forest-200 text-center leading-relaxed">{service.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>

                {/* Service Packages */}
                <div>
                    <h2 className="text-3xl font-bold text-white text-center mb-4">Service Packages</h2>
                    <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
                        Choose the package that fits your needs. All packages include our core services tailored to your specific situation.
                    </p>
                    <div className="space-y-8">
                        {packages.map((pkg, index) => (
                            <AnimatedSection key={index}>
                                <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-forest-700/30">
                                    <div className="p-4 bg-forest-800 text-forest-accent rounded-full flex-shrink-0 shadow-inner">
                                        {pkg.icon}
                                    </div>
                                    <div className="flex-grow text-center md:text-left">
                                        <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
                                        <p className="text-sm text-forest-accent font-medium mb-3">{pkg.coverage}</p>
                                        <p className="text-forest-200 leading-relaxed">{pkg.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 mt-4 md:mt-0">
                                        <button onClick={() => onNavigate('pricing')} className="font-bold px-6 py-3 rounded-full text-forest-900 bg-forest-accent hover:bg-white transition-colors shadow-md shadow-forest-accent/20">
                                            View Pricing
                                        </button>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>

                {/* Additional Services */}
                <AnimatedSection className="mt-20">
                    <div className="glass-card p-6 md:p-10 text-center border border-forest-700/50">
                        <h2 className="text-3xl font-bold text-white mb-6">Additional Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div>
                                <h3 className="text-xl font-bold text-forest-accent mb-3">🔐 Lens Vault Password Manager</h3>
                                <p className="text-forest-200 leading-relaxed">
                                    An AI-driven tool built on Google AI Studio that helps you generate, manage, and secure passwords — while identifying weak spots in real time. Your personal digital guardian — simple, smart, and built for Nigerians who want peace of mind, not tech headaches.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-forest-accent mb-3">📊 Retainer Monitoring Plan</h3>
                                <p className="text-forest-200 leading-relaxed">
                                    Ongoing account checks, security updates, and quick-response support for premium clients. Because cybersecurity isn't one-time — it's a lifestyle of staying secure and confident online.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button onClick={() => onNavigate('contact')} className="font-bold px-8 py-4 rounded-full text-forest-900 bg-forest-accent hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg shadow-forest-accent/20">
                                Get Started Today
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
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
        features: string[];
        popular?: boolean;
    };

    const plans: Plan[] = [
        {
            name: "Individual",
            description: "For Individuals",
            setupCost: "₦150,000",
            retainer: "₦65,000",
            setupAmount: 15000000,
            retainerAmount: 6500000,
            icon: <ShieldCheck className="w-6 h-6" />,
            features: [
                "Vulnerability Assessment",
                "Personal Device Security",
                "Password Manager Setup",
                "2FA Implementation",
                "Email Security"
            ]
        },
        {
            name: "Influencer",
            description: "For Social Pros",
            setupCost: "₦200,000",
            retainer: "₦85,000",
            setupAmount: 20000000,
            retainerAmount: 8500000,
            icon: <Star className="w-6 h-6" />,
            features: [
                "Everything in Individual",
                "Social Media Hardening",
                "Account Recovery Support",
                "Brand Impersonation Checks",
                "Priority Support"
            ]
        },
        {
            name: "Family",
            description: "For Households",
            setupCost: "₦450,000",
            retainer: "₦160,000",
            setupAmount: 45000000,
            retainerAmount: 16000000,
            icon: <Users className="w-6 h-6" />,
            popular: true,
            features: [
                "Up to 5 Family Members",
                "Home Network Security",
                "Parental Control Setup",
                "Shared Password Vault",
                "Digital Estate Planning"
            ]
        },
        {
            name: "Brand",
            description: "For Growing Brands",
            setupCost: "₦300,000",
            retainer: "₦120,000",
            setupAmount: 30000000,
            retainerAmount: 12000000,
            icon: <Briefcase className="w-6 h-6" />,
            features: [
                "Core Team Protection",
                "Business Asset Security",
                "Employee Security Training",
                "Phishing Simulation",
                "Monthly Security Reports"
            ]
        },
        {
            name: "Team / SME",
            description: "For Enterprises",
            setupCost: "₦800,000",
            retainer: "₦380,000",
            setupAmount: 80000000,
            retainerAmount: 38000000,
            icon: <Briefcase className="w-6 h-6" />,
            features: [
                "Up to 10 Users",
                "Advanced Threat Protection",
                "Compliance Assistance",
                "Incident Response Plan",
                "Dedicated Account Manager"
            ]
        },
        {
            name: "VIP",
            description: "High-Profile",
            setupCost: "₦300,000",
            retainer: "₦180,000",
            setupAmount: 30000000,
            retainerAmount: 18000000,
            icon: <Crown className="w-6 h-6" />,
            features: [
                "Personal Security Detail",
                "24/7 Threat Monitoring",
                "Travel Security Advisory",
                "Crisis Management",
                "Concierge Service"
            ]
        },
    ];

    const PaystackHookButton = ({ plan, amount, label, className }: { plan: Plan, amount: number, label: string, className?: string }) => {
        const config = {
            reference: (new Date()).getTime().toString(),
            email: user?.email || "customer@example.com",
            amount: amount, // Amount is in kobo
            publicKey: 'pk_live_1efccc2535b9269d6737dd0557277d25e1e37a92', // Live Key provided by user
        };

        const initializePayment = usePaystackPayment(config);

        const onSuccess = async (reference: any) => {
            await updateUserPlan(`${plan.name} (${label})`);

            // Save payment record to database
            if (user) {
                await dbService.createPayment({
                    userId: user.id,
                    planName: plan.name,
                    amount: amount,
                    paymentType: label.includes('Setup') ? 'setup' : 'retainer',
                    reference: reference.reference || config.reference,
                    status: 'completed'
                });
            }

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
            }} className={`w-full font-bold px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${className}`}>
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
                <AnimatedSection className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Pricing Plans</h1>
                    <p className="max-w-2xl mx-auto text-xl text-forest-300">
                        Secure your digital life with a plan that fits your needs. Transparent pricing, no hidden fees.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <AnimatedSection key={index}>
                            <div className={`glass-card p-6 md:p-8 flex flex-col h-full transition-all duration-300 border relative group ${plan.popular ? 'border-forest-accent shadow-[0_0_30px_rgba(14,165,233,0.15)] scale-105 z-10' : 'border-forest-700/30 hover:border-forest-500/50'}`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-forest-accent text-forest-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${plan.popular ? 'bg-forest-accent text-forest-900' : 'bg-forest-800 text-forest-accent'}`}>
                                        {plan.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                                        <p className="text-sm text-forest-400">{plan.description}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="p-4 rounded-2xl bg-forest-900/50 border border-forest-700/30">
                                        <p className="text-xs text-forest-400 uppercase tracking-wider mb-1">One-Time Setup</p>
                                        <p className="text-3xl font-bold text-white">{plan.setupCost}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-forest-900/30 border border-forest-700/30">
                                        <p className="text-xs text-forest-400 uppercase tracking-wider mb-1">Monthly Retainer</p>
                                        <p className="text-2xl font-bold text-forest-200">{plan.retainer}</p>
                                    </div>
                                </div>

                                <div className="flex-grow mb-8">
                                    <p className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">What's Included:</p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-forest-300">
                                                <svg className="w-5 h-5 text-forest-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="leading-tight">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-3 mt-auto">
                                    <PaystackHookButton
                                        plan={plan}
                                        amount={plan.setupAmount}
                                        label="Pay Setup"
                                        className={plan.popular
                                            ? "bg-forest-accent hover:bg-white text-forest-900 hover:text-forest-900"
                                            : "bg-white text-forest-900 hover:bg-forest-200"}
                                    />
                                    <PaystackHookButton
                                        plan={plan}
                                        amount={plan.retainerAmount}
                                        label="Pay Retainer"
                                        className="bg-transparent border border-forest-600 text-white hover:bg-forest-800"
                                    />
                                    <button onClick={() => handleSelectPlan(plan)} className="text-xs text-forest-400 hover:text-white transition-colors block w-full text-center mt-4">
                                        Questions? Chat on WhatsApp
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

const ContactPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const success = await dbService.submitContactMessage(name, email, message);
            if (success) {
                setStatus('success');
                setName('');
                setEmail('');
                setMessage('');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <div className="grid md:grid-cols-2 gap-12">
                    <AnimatedSection>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Get in Touch</h1>
                        <p className="mt-4 text-lg text-white/80">
                            Have a question or need a custom quote? We're here to help. Reach out to us, and we'll get back to you as soon as possible.
                        </p>
                        <div className="mt-8 space-y-4 text-white/90">
                            <p className="flex items-center gap-3">
                                <Mail className="w-6 h-6 text-white" />
                                <strong>Email:</strong> <a href="mailto:lensvault@proton.me" className="hover:underline">lensvault@proton.me</a>
                            </p>
                            <p className="flex items-center gap-3">
                                <WhatsAppIcon className="w-6 h-6 text-white" />
                                <strong>WhatsApp:</strong> <a href="https://wa.me/2349068845666" target="_blank" rel="noopener noreferrer" className="hover:underline">+234 906 884 5666</a>
                            </p>
                        </div>
                        <div className="mt-8">
                            <p className="font-bold text-white mb-2">Follow us on social media:</p>
                            <div className="flex items-center gap-4">
                                <a href="https://instagram.com/lensvaultltd" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors"><span className="sr-only">Instagram</span><InstagramIcon className="w-7 h-7" /></a>
                                <a href="https://twitter.com/LensVaultltd" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors"><span className="sr-only">Twitter</span><TwitterIcon className="w-7 h-7" /></a>
                                <a href="https://www.linkedin.com/company/lens-vault/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors"><span className="sr-only">LinkedIn</span><LinkedInIcon className="w-7 h-7" /></a>
                            </div>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection>
                        <div className="glass-card p-6 md:p-8 border border-forest-700/30">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-forest-200">Full Name</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-forest-600 rounded-lg shadow-sm focus:ring-forest-accent focus:border-forest-accent bg-forest-800/50 backdrop-blur-sm text-white placeholder-forest-400" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-forest-200">Email Address</label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-forest-600 rounded-lg shadow-sm focus:ring-forest-accent focus:border-forest-accent bg-forest-800/50 backdrop-blur-sm text-white placeholder-forest-400" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-forest-200">Message</label>
                                    <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} required className="mt-1 block w-full px-4 py-3 border border-forest-600 rounded-lg shadow-sm focus:ring-forest-accent focus:border-forest-accent bg-forest-800/50 backdrop-blur-sm text-white placeholder-forest-400"></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full flex justify-center items-center font-bold px-6 py-3 rounded-lg text-forest-900 bg-forest-accent hover:bg-white transition-colors disabled:bg-forest-600 shadow-md"
                                    >
                                        {status === 'sending' && <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                                {status === 'success' && <p className="text-green-400 font-medium text-center">Message sent successfully!</p>}
                                {status === 'error' && <p className="text-red-400 font-medium text-center">Please fill out all fields.</p>}
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
    const [errorMsg, setErrorMsg] = React.useState('');
    const [walletAddress, setWalletAddress] = React.useState<string | null>(null);

    const { login, loginWithWallet, error } = useAuth();

    const handleWalletConnect = async (address: string) => {
        setWalletAddress(address);
        setStatus('loggingIn');
        try {
            const success = await loginWithWallet(address);
            if (success) {
                onNavigate('main');
            } else {
                setErrorMsg('Failed to authenticate with wallet');
                setStatus('error');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Wallet authentication failed');
            setStatus('error');
        }
    };

    const handleSocialLoginSuccess = (user: any) => {
        onNavigate('main');
    };

    const handleSocialLoginError = (error: string) => {
        setErrorMsg(error);
        setStatus('error');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loggingIn');
        setErrorMsg('');

        try {
            const success = await login(email, password);
            if (success) {
                onNavigate('main');
            } else {
                setStatus('error');
                setErrorMsg(error || 'Invalid email or password.');
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Login failed');
        }
    };

    return (
        <section className="py-24 md:py-32 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <div className="max-w-md mx-auto">
                    <AnimatedSection>
                        <div className="glass-card p-6 md:p-10 relative">
                            {/* Close button */}
                            <button
                                onClick={() => onNavigate('main')}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-800/70 text-white transition-colors"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="login-email" className="block text-sm font-medium text-white/90 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-b-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="login-password" className="block text-sm font-medium text-white/90 mb-2">Password</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-b-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center text-white/80 cursor-pointer">
                                        <input type="checkbox" className="mr-2 rounded" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-white/80 hover:text-white transition-colors">Forgot Password?</a>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === 'loggingIn'}
                                        className="w-full flex justify-center items-center font-bold px-6 py-3 rounded-lg text-white bg-gray-900/80 hover:bg-gray-900 transition-colors disabled:bg-gray-600/50 shadow-lg"
                                    >
                                        {status === 'loggingIn' && <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                                        {status === 'loggingIn' ? 'Signing In...' : 'Login'}
                                    </button>
                                </div>
                                {status === 'error' && <p className="text-red-300 text-center font-medium">{errorMsg}</p>}
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-white/70">
                                    Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }} className="text-white hover:underline font-medium">Register</a>
                                </p>
                            </div>

                            {/* Social login section */}
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <h3 className="text-center text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Or continue with</h3>
                                <SocialLogin onSuccess={handleSocialLoginSuccess} onError={handleSocialLoginError} />
                            </div>

                            {/* Blockchain login section */}
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <h3 className="text-center text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Or login with blockchain</h3>
                                <WalletConnect onConnect={handleWalletConnect} />
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};


const SignupPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'signingUp' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = React.useState('');

    const { signup, error } = useAuth();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('signingUp');
        setErrorMsg('');

        try {
            const success = await signup(email, password, name);
            if (success) {
                onNavigate('main');
            } else {
                setStatus('error');
                setErrorMsg(error || 'Signup failed. Email may already exist.');
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Signup failed');
        }
    };

    return (
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-6">
                <BackButton onClick={() => onNavigate('main')} />
                <div className="max-w-md mx-auto">
                    <AnimatedSection>
                        <div className="glass-card p-6 md:p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
                                <p className="mt-2 text-gray-600">Join Lens Vault and secure your digital life.</p>
                            </div>
                            <form onSubmit={handleSignup} className="space-y-6">
                                <div>
                                    <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="signup-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm" />
                                </div>
                                <div>
                                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="signup-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm" />
                                </div>
                                <div>
                                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" id="signup-password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm" />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === 'signingUp'}
                                        className="w-full flex justify-center items-center font-bold px-6 py-3 rounded-lg text-white bg-gray-900/80 hover:bg-gray-900 transition-colors disabled:bg-gray-400 shadow-md"
                                    >
                                        {status === 'signingUp' && <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                                        {status === 'signingUp' ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                </div>
                                {status === 'error' && <p className="text-red-600 text-center font-medium">{errorMsg}</p>}
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="text-blue-600 hover:underline font-medium">Log in</a>
                                </p>
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
            <div className="flex flex-col min-h-screen relative">
                <AnimatedBackground />
                <Header onNavigate={handleNavigate} />
                <main className="flex-grow z-10">
                    {renderPage()}
                </main>
                <Footer onNavigate={handleNavigate} />
            </div>
        </AuthProvider>
    );
};

export default App;