import React from 'react';
import { Smartphone, Monitor, Globe, Download, CheckCircle, Shield, Users, Zap, ChevronRight, Chrome } from 'lucide-react';

interface DownloadPageProps {
    onNavigate: (page: string) => void;
}

interface PlatformCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    requirements: string;
    size?: string;
    downloadUrl?: string;
    storeUrl?: string;
    comingSoon?: boolean;
    primary?: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
    icon,
    title,
    description,
    requirements,
    size,
    downloadUrl,
    storeUrl,
    comingSoon,
    primary
}) => (
    <div className={`glass-card p-8 hover:transform hover:-translate-y-2 transition-all duration-300 border ${primary ? 'border-forest-accent shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-forest-accent/50' : 'border-forest-700/30'}`}>
        <div className="flex items-start gap-6 mb-6">
            <div className={`p-4 rounded-2xl flex-shrink-0 ${primary ? 'bg-forest-accent text-forest-900' : 'bg-forest-800 text-forest-accent'}`}>
                {icon}
            </div>
            <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    {title}
                    {primary && <span className="bg-forest-accent text-forest-900 text-xs px-2 py-1 rounded-full font-bold">RECOMMENDED</span>}
                </h3>
                <p className="text-forest-200 mb-4">{description}</p>
                <div className="space-y-2 text-sm text-forest-300">
                    <p><strong className="text-white">Requirements:</strong> {requirements}</p>
                    {size && <p><strong className="text-white">Size:</strong> {size}</p>}
                </div>
            </div>
        </div>

        {comingSoon ? (
            <div className="bg-forest-800/50 border border-forest-700 rounded-full py-3 px-6 text-center">
                <span className="text-forest-accent font-semibold">Coming Soon</span>
            </div>
        ) : (
            <div className="flex flex-col gap-3">
                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        target={downloadUrl.startsWith('http') ? '_blank' : undefined}
                        className={`flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl ${primary ? 'bg-forest-accent hover:bg-white text-forest-900' : 'bg-forest-800 hover:bg-forest-700 text-white'}`}
                    >
                        <Download className="w-5 h-5" />
                        {primary ? 'Launch Web App' : 'Download Now'}
                    </a>
                )}
                {storeUrl && (
                    <a
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border border-forest-600 hover:bg-forest-800 text-white font-medium py-3 px-6 rounded-full transition-all"
                    >
                        <Globe className="w-5 h-5" />
                        View in Store
                    </a>
                )}
            </div>
        )}
    </div>
);

const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
    const features = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Military-Grade Encryption",
            description: "AES-256-GCM encryption keeps your passwords secure"
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Satellite Verification",
            description: "Location-based security for sensitive banking sites"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Family Sharing",
            description: "Share passwords securely with up to 6 family members"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Auto-Fill Everywhere",
            description: "Seamlessly fill passwords across all your apps and sites"
        }
    ];

    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('main')}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                </button>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-800/50 border border-forest-700 mb-6">
                        <Download className="w-5 h-5 text-forest-accent" />
                        <span className="text-forest-200 text-sm font-medium">Get Lens Vault</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Download & Access
                    </h1>

                    <p className="text-xl text-forest-200 max-w-3xl mx-auto leading-relaxed">
                        Access your vault from anywhere. Start with the Web App for instant access, install the Extension for seamless autofill, or get the Desktop app for offline power.
                    </p>
                </div>

                {/* Platform Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
                    {/* 1. Web App (Top Priority) */}
                    <PlatformCard
                        icon={<Globe className="w-8 h-8" />}
                        title="Web App"
                        description="Instant access from any browser. No installation required."
                        requirements="Modern Browser (Chome, Edge, Safari)"
                        downloadUrl="https://lens-vault.vercel.app"
                        primary={true}
                    />

                    {/* 2. Desktop App */}
                    <PlatformCard
                        icon={<Monitor className="w-8 h-8" />}
                        title="Windows Desktop"
                        description="Native application for Windows PCs. Offline access enabled."
                        requirements="Windows 10 or later"
                        size="~100 MB"
                        downloadUrl="#" // Placeholder for user to fill or update
                    />

                    {/* 3. Browser Extension */}
                    <PlatformCard
                        icon={<Chrome className="w-8 h-8" />}
                        title="Browser Extension"
                        description="Seamless autofill and login detection."
                        requirements="Chrome, Edge, Brave"
                        size="~2 MB"
                        storeUrl="https://chrome.google.com/webstore" // Placeholder
                    />

                    {/* 4. Mobile Apps (Coming Soon) */}
                    <div className="glass-card p-8 border border-forest-700/30 flex flex-col justify-center items-center text-center opacity-80">
                        <Smartphone className="w-12 h-12 text-forest-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Mobile Apps</h3>
                        <p className="text-forest-200 mb-6">Android & iOS</p>
                        <div className="bg-forest-800/50 border border-forest-700 rounded-full py-2 px-8">
                            <span className="text-forest-accent font-semibold tracking-wider">COMING SOON</span>
                        </div>
                    </div>
                </div>

                {/* Legacy Mobile Cards (Hidden or Merged above) - Keeping code clean */}

                {/* Features Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Why Choose Lens Vault?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-6 text-center border border-forest-700/30"
                            >
                                <div className="inline-flex p-3 bg-forest-800 text-forest-accent rounded-full mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-forest-200">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enterprise CTA */}
                <div className="glass-card p-8 md:p-12 text-center border border-forest-700/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-forest-accent to-transparent opacity-50"></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Need Enterprise Security?
                    </h2>

                    <p className="text-forest-200 text-lg mb-8 max-w-2xl mx-auto">
                        Lens Vault App is part of our complete cybersecurity suite.
                        Explore our professional vulnerability assessment and digital estate planning services.
                    </p>

                    <button
                        onClick={() => onNavigate('services')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-forest-accent hover:bg-white text-forest-900 font-bold rounded-full transition-all shadow-lg hover:shadow-xl"
                    >
                        Explore Our Services
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DownloadPage;
