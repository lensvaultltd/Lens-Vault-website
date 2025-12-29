import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react';

interface PrivacyPageProps {
    onNavigate: (page: string) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
    return (
        <section className="py-20 md:py-32 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
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

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-800/50 border border-forest-700 mb-6">
                        <Shield className="w-5 h-5 text-forest-accent" />
                        <span className="text-forest-200 text-sm font-medium">Your Privacy Matters</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
                    <p className="text-forest-300 text-lg">Last Updated: December 29, 2025</p>
                </div>

                {/* Content */}
                <div className="glass-card p-8 md:p-12 space-y-8 text-forest-100">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-forest-accent" />
                            Introduction
                        </h2>
                        <p className="leading-relaxed">
                            Lens Vault Ltd ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our password management and cybersecurity services, including our website, mobile applications, desktop applications, and browser extensions (collectively, the "Services").
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Database className="w-6 h-6 text-forest-accent" />
                            Information We Collect
                        </h2>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">1. Information You Provide</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Account Information:</strong> Email address, master password (encrypted), name</li>
                            <li><strong>Vault Data:</strong> Encrypted passwords, notes, and other sensitive information you store</li>
                            <li><strong>Payment Information:</strong> Processed securely through Paystack (we do not store card details)</li>
                            <li><strong>Profile Information:</strong> Optional profile photo, preferences, settings</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2. Automatically Collected Information</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                            <li><strong>Usage Data:</strong> Features used, login times, app interactions</li>
                            <li><strong>Location Data:</strong> IP address, approximate location (for satellite verification)</li>
                            <li><strong>Log Data:</strong> Error logs, performance metrics</li>
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <UserCheck className="w-6 h-6 text-forest-accent" />
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide, maintain, and improve our Services</li>
                            <li>Process payments and manage subscriptions</li>
                            <li>Verify your identity and prevent fraud</li>
                            <li>Send important notifications and updates</li>
                            <li>Provide customer support</li>
                            <li>Analyze usage patterns to improve user experience</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    {/* Zero-Knowledge Architecture */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-forest-accent" />
                            Zero-Knowledge Architecture
                        </h2>
                        <div className="bg-forest-800/30 border border-forest-700 rounded-lg p-6">
                            <p className="leading-relaxed mb-4">
                                <strong className="text-white">Important:</strong> Lens Vault uses zero-knowledge encryption. This means:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Your master password is never sent to our servers</li>
                                <li>All vault data is encrypted on your device before transmission</li>
                                <li>We cannot access, view, or recover your passwords</li>
                                <li>Only you can decrypt your data with your master password</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Sharing */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Globe className="w-6 h-6 text-forest-accent" />
                            Data Sharing and Disclosure
                        </h2>
                        <p className="leading-relaxed mb-4">We do not sell your personal information. We may share your information only in these circumstances:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Service Providers:</strong> Supabase (database), Paystack (payments), Google AI (security analysis)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                            <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
                        </ul>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-forest-accent" />
                            Data Security
                        </h2>
                        <p className="leading-relaxed mb-4">We implement industry-standard security measures:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>AES-256-GCM encryption for all vault data</li>
                            <li>TLS/SSL encryption for data in transit</li>
                            <li>Regular security audits and penetration testing</li>
                            <li>Secure data centers with physical security</li>
                            <li>Access controls and authentication mechanisms</li>
                        </ul>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Eye className="w-6 h-6 text-forest-accent" />
                            Your Rights
                        </h2>
                        <p className="leading-relaxed mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Export:</strong> Download your vault data in a portable format</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                            <li><strong>Object:</strong> Object to certain data processing activities</li>
                        </ul>
                        <p className="mt-4 text-sm">To exercise these rights, contact us at privacy@lensvault.com</p>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
                        <p className="leading-relaxed">
                            We retain your information for as long as your account is active or as needed to provide Services. After account deletion, we may retain certain information for legal compliance, fraud prevention, and legitimate business purposes. Encrypted vault data is permanently deleted upon account deletion.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
                        <p className="leading-relaxed">
                            Our Services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </section>

                    {/* International Data Transfers */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">International Data Transfers</h2>
                        <p className="leading-relaxed">
                            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                        <p className="leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the Services. Your continued use of the Services after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t border-forest-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="leading-relaxed mb-4">If you have questions about this Privacy Policy, please contact us:</p>
                        <div className="space-y-2">
                            <p><strong>Email:</strong> privacy@lensvault.com</p>
                            <p><strong>Address:</strong> Lens Vault Ltd, Nigeria</p>
                            <p><strong>Website:</strong> <a href="https://lensvault.com" className="text-forest-accent hover:underline">lensvault.com</a></p>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPage;
