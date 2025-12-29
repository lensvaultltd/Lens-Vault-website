import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Scale, Shield } from 'lucide-react';

interface TermsPageProps {
    onNavigate: (page: string) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
                        <FileText className="w-5 h-5 text-forest-accent" />
                        <span className="text-forest-200 text-sm font-medium">Legal Agreement</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Terms of Service</h1>
                    <p className="text-forest-300 text-lg">Last Updated: December 29, 2025</p>
                </div>

                {/* Content */}
                <div className="glass-card p-8 md:p-12 space-y-8 text-forest-100">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Scale className="w-6 h-6 text-forest-accent" />
                            Agreement to Terms
                        </h2>
                        <p className="leading-relaxed">
                            These Terms of Service ("Terms") govern your access to and use of Lens Vault's password management and cybersecurity services ("Services") provided by Lens Vault Ltd ("Company," "we," "our," or "us"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, do not use our Services.
                        </p>
                    </section>

                    {/* Eligibility */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Eligibility</h2>
                        <p className="leading-relaxed mb-4">To use our Services, you must:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Be at least 13 years of age (or the age of majority in your jurisdiction)</li>
                            <li>Have the legal capacity to enter into binding contracts</li>
                            <li>Not be prohibited from using the Services under applicable laws</li>
                            <li>Provide accurate and complete registration information</li>
                        </ul>
                    </section>

                    {/* Account Responsibilities */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Account Responsibilities</h2>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Account Security</h3>
                        <p className="leading-relaxed mb-4">You are responsible for:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Maintaining the confidentiality of your master password</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized access</li>
                            <li>Using a strong, unique master password</li>
                        </ul>

                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mt-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-white mb-2">IMPORTANT: Master Password Recovery</p>
                                    <p className="text-sm">
                                        Due to our zero-knowledge architecture, we CANNOT recover or reset your master password. If you forget it, your vault data will be permanently inaccessible. Please store your master password securely.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Prohibited Activities</h3>
                        <p className="leading-relaxed mb-4">You agree NOT to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Use the Services for illegal purposes</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Reverse engineer, decompile, or disassemble the Services</li>
                            <li>Share your account with others</li>
                            <li>Use automated tools to access the Services without permission</li>
                            <li>Interfere with or disrupt the Services</li>
                            <li>Violate any applicable laws or regulations</li>
                        </ul>
                    </section>

                    {/* Subscription and Payment */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Subscription and Payment</h2>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Free and Premium Plans</h3>
                        <p className="leading-relaxed mb-4">
                            We offer both free and premium subscription plans. Premium features require a paid subscription. Prices are displayed in your local currency and may vary by region.
                        </p>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 Billing</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                            <li>Payments are processed securely through Paystack</li>
                            <li>You authorize us to charge your payment method automatically</li>
                            <li>Prices may change with 30 days' notice</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.3 Cancellation and Refunds</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>You may cancel your subscription at any time</li>
                            <li>Cancellation takes effect at the end of the current billing period</li>
                            <li>No refunds for partial months or unused time</li>
                            <li>Free trial cancellations do not incur charges</li>
                        </ul>
                    </section>

                    {/* Data and Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-forest-accent" />
                            4. Data and Privacy
                        </h2>
                        <p className="leading-relaxed mb-4">
                            Your use of the Services is also governed by our Privacy Policy. We use zero-knowledge encryption, meaning:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Your vault data is encrypted on your device before transmission</li>
                            <li>We cannot access, view, or recover your passwords</li>
                            <li>You are solely responsible for backing up your data</li>
                            <li>We are not liable for data loss due to forgotten master passwords</li>
                        </ul>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
                        <p className="leading-relaxed mb-4">
                            The Services, including all content, features, and functionality, are owned by Lens Vault Ltd and protected by copyright, trademark, and other intellectual property laws. You may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Copy, modify, or distribute our software or content</li>
                            <li>Use our trademarks without permission</li>
                            <li>Create derivative works based on our Services</li>
                        </ul>
                    </section>

                    {/* Disclaimers */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Disclaimers and Limitations of Liability</h2>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.1 Service Availability</h3>
                        <p className="leading-relaxed mb-4">
                            The Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not guarantee uninterrupted, error-free, or secure access to the Services.
                        </p>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.2 Limitation of Liability</h3>
                        <p className="leading-relaxed mb-4">
                            To the maximum extent permitted by law, Lens Vault Ltd shall not be liable for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Loss of data due to forgotten master passwords</li>
                            <li>Unauthorized access to your account</li>
                            <li>Service interruptions or downtime</li>
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Damages exceeding the amount you paid in the past 12 months</li>
                        </ul>
                    </section>

                    {/* Indemnification */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Indemnification</h2>
                        <p className="leading-relaxed">
                            You agree to indemnify and hold harmless Lens Vault Ltd from any claims, damages, losses, or expenses arising from your use of the Services, violation of these Terms, or infringement of any rights of others.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
                        <p className="leading-relaxed mb-4">
                            We may suspend or terminate your account at any time for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Violation of these Terms</li>
                            <li>Fraudulent or illegal activity</li>
                            <li>Non-payment of subscription fees</li>
                            <li>Any reason with or without notice</li>
                        </ul>
                        <p className="mt-4 leading-relaxed">
                            Upon termination, your right to use the Services ceases immediately. You may export your data before termination.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law and Dispute Resolution</h2>
                        <p className="leading-relaxed mb-4">
                            These Terms are governed by the laws of Nigeria. Any disputes shall be resolved through:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Good faith negotiations</li>
                            <li>Mediation (if negotiations fail)</li>
                            <li>Arbitration or courts in Nigeria (as a last resort)</li>
                        </ul>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
                        <p className="leading-relaxed">
                            We may modify these Terms at any time. We will notify you of significant changes by email or through the Services. Your continued use after changes constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    {/* Miscellaneous */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Miscellaneous</h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Lens Vault Ltd</li>
                            <li><strong>Severability:</strong> If any provision is invalid, the remaining provisions remain in effect</li>
                            <li><strong>Waiver:</strong> Failure to enforce any right does not waive that right</li>
                            <li><strong>Assignment:</strong> You may not assign these Terms; we may assign them without notice</li>
                        </ul>
                    </section>

                    {/* Contact */}
                    <section className="border-t border-forest-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-forest-accent" />
                            Contact Us
                        </h2>
                        <p className="leading-relaxed mb-4">If you have questions about these Terms, please contact us:</p>
                        <div className="space-y-2">
                            <p><strong>Email:</strong> legal@lensvault.com</p>
                            <p><strong>Address:</strong> Lens Vault Ltd, Nigeria</p>
                            <p><strong>Website:</strong> <a href="https://lensvault.com" className="text-forest-accent hover:underline">lensvault.com</a></p>
                        </div>
                    </section>

                    {/* Acceptance */}
                    <section className="bg-forest-800/30 border border-forest-700 rounded-lg p-6">
                        <p className="text-center font-semibold text-white">
                            By using Lens Vault, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </p>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default TermsPage;
