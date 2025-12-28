import React from 'react';
import { Smartphone, Monitor, Globe, Download, CheckCircle, Shield, Users, Zap, ChevronRight } from 'lucide-react';

interface DownloadPageProps {
    onNavigate: (page: string) => void;
}

interface PlatformCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    requirements: string;
    size: string;
    downloadUrl?: string;
    storeUrl?: string;
    comingSoon?: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
    icon,
    title,
    description,
    requirements,
    size,
    downloadUrl,
    storeUrl,
    comingSoon
}) => (
    <div className="glass-card p-8 hover:transform hover:-translate-y-2 transition-all duration-300 border border-forest-700/30">
        <div className="flex items-start gap-6 mb-6">
            <div className="p-4 bg-forest-800 text-forest-accent rounded-2xl flex-shrink-0">
                {icon}
            </div>
            <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-forest-200 mb-4">{description}</p>
                <div className="space-y-2 text-sm text-forest-300">
                    <p><strong className="text-white">Requirements:</strong> {requirements}</p>
                    <p><strong className="text-white">Size:</strong> {size}</p>
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
                        className="flex items-center justify-center gap-2 bg-forest-accent hover:bg-white text-forest-900 font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl"
                    >
                        <Download className="w-5 h-5" />
                        Download Now
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
                        <span className="text-forest-200 text-sm font-medium">Available on All Platforms</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Download Lens Vault
                    </h1>

                    <p className="text-xl text-forest-200 max-w-3xl mx-auto leading-relaxed">
                        Secure your passwords across all your devices. Military-grade encryption,
                        satellite verification, and family sharing — all in one app.
                    </p>
                </div>

                {/* Platform Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    <PlatformCard
                        icon={<Smartphone className="w-8 h-8" />}
                        title="Android"
                        description="Get Lens Vault on your Android phone or tablet"
                        requirements="Android 8.0 or later"
                        size="~15 MB"
                        comingSoon={true}
                    />

                    <PlatformCard
                        icon={<Smartphone className="w-8 h-8" />}
                        title="iOS"
                        description="Download from the App Store for iPhone and iPad"
                        requirements="iOS 13.0 or later"
                        size="~20 MB"
                        comingSoon={true}
                    />

                    <PlatformCard
                        icon={<Monitor className="w-8 h-8" />}
                        title="Windows"
                        description="Desktop app for Windows PCs"
                        requirements="Windows 10 or later"
                        size="~50 MB"
                        comingSoon={true}
                    />

                    <PlatformCard
                        icon={<Globe className="w-8 h-8" />}
                        title="Browser Extension"
                        description="Add to Chrome, Edge, Brave, or Opera"
                        requirements="Chrome 88+, Edge 88+"
                        size="~2 MB"
                        storeUrl="https://chrome.google.com/webstore"
                    />
                </div>

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

                {/* Security Trust Section */}
                <div className="glass-card p-8 md:p-12 mb-20 border border-forest-700/30">
                    <div className="text-center mb-8">
                        <Shield className="w-16 h-16 text-forest-accent mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Built by Cybersecurity Experts
                        </h2>
                        <p className="text-forest-200 max-w-2xl mx-auto">
                            Lens Vault is developed by a trusted cybersecurity firm serving enterprises worldwide.
                            We bring professional-grade security to your personal password management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3 text-forest-200">
                            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                            <span>Zero-knowledge architecture</span>
                        </div>
                        <div className="flex items-center gap-3 text-forest-200">
                            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                            <span>End-to-end encryption</span>
                        </div>
                        <div className="flex items-center gap-3 text-forest-200">
                            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                            <span>Regular security audits</span>
                        </div>
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
