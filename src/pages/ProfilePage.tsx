import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as dbService from '../services/databaseService';
import { changePassword, deleteAccount } from '../services/authService';
import {
    User as UserIcon, Settings, LogOut, ChevronRight, CheckCircle, ShieldCheck, Mail, ShieldAlert,
    Camera, Phone, MapPin, Save, Search, Loader
} from 'lucide-react';

const ProfilePage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
    const [isEditing, setIsEditing] = useState(false);

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    // Security Stats State
    const [securityStats, setSecurityStats] = useState<{
        score: number;
        scans: number;
        threats: number;
        lastScan: string;
    }>({ score: 0, scans: 0, threats: 0, lastScan: 'Never' });
    const [isScanning, setIsScanning] = useState(false);

    // Security Settings State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [recommendations, setRecommendations] = useState<string[]>([]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setEmailNotifications(user.emailNotifications || false);
            loadSecurityStats();
        }
    }, [user]);

    const loadSecurityStats = async () => {
        if (!user) return;
        const stats = await dbService.getSecurityStats(user.id);
        if (stats) {
            setSecurityStats({
                score: stats.securityScore,
                scans: stats.scansRun,
                threats: stats.threatsFound,
                lastScan: new Date(stats.lastScanDate).toLocaleString()
            });
        } else {
            // Initialize default stats if none exist
            await dbService.updateSecurityStats(user.id, {
                securityScore: 85,
                scansRun: 0,
                threatsFound: 0,
                lastScanDate: new Date().toISOString()
            });
            setSecurityStats({
                score: 85,
                scans: 0,
                threats: 0,
                lastScan: 'Just now'
            });
        }
    };

    const handleScanNow = async () => {
        if (!user) return;
        setIsScanning(true);
        setRecommendations([]);

        // Simulate scanning process
        setTimeout(async () => {
            const newScore = Math.floor(Math.random() * (100 - 80 + 1)) + 80; // Random score 80-100
            const newThreats = newScore < 90 ? Math.floor(Math.random() * 3) + 1 : 0;

            await dbService.updateSecurityStats(user.id, {
                securityScore: newScore,
                scansRun: securityStats.scans + 1,
                threatsFound: newThreats,
                lastScanDate: new Date().toISOString()
            });

            // Generate recommendations if score < 100
            if (newScore < 100) {
                const recs = [
                    "Enable 2FA authentication",
                    "Update your recovery email",
                    "Review recent login activity",
                    "Strengthen your password"
                ];
                // Pick random recommendations based on how low the score is
                const count = newScore < 90 ? 3 : 1;
                setRecommendations(recs.slice(0, count));

                // Simulate sending email if enabled
                if (emailNotifications) {
                    // In a real app, this would call an API endpoint to send the email
                    console.log("Sending security report email to", user.email);
                    alert(`Security Report sent to ${user.email}`);
                }
            }

            await loadSecurityStats();
            setIsScanning(false);
        }, 2000);
    };

    const handleToggleEmailNotifications = async () => {
        if (!user) return;
        const newValue = !emailNotifications;
        setEmailNotifications(newValue);
        await dbService.updateUserProfile(user.id, { emailNotifications: newValue });
    };

    if (!user) {
        onNavigate('login');
        return null;
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordStatus('error');
            setPasswordMsg('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordStatus('error');
            setPasswordMsg('Password must be at least 6 characters');
            return;
        }

        setPasswordStatus('loading');
        const result = await changePassword(newPassword);
        if (result.success) {
            setPasswordStatus('success');
            setPasswordMsg('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPasswordStatus('error');
            setPasswordMsg(result.error || 'Failed to update password');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setIsDeleting(true);
            const result = await deleteAccount();
            if (result.success) {
                await logout();
                onNavigate('main');
            } else {
                alert(result.error || 'Failed to delete account');
                setIsDeleting(false);
            }
        }
    };

    return (
        <section className="min-h-screen bg-forest-900 flex flex-col pt-20">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-forest-800 to-forest-900 pb-12 pt-8 px-6 md:px-12 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-forest-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="container mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <p className="text-forest-accent font-bold tracking-wider text-sm mb-2 uppercase">User Profile</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Hello, {user.name.split(' ')[0]}</h1>
                            <p className="text-forest-300 max-w-xl">
                                This is your profile page. You can manage your personal information, security settings, and account preferences here.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-forest-900/50 border border-forest-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-forest-accent w-48 md:w-64"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-forest-800/50 p-1 pr-4 rounded-full border border-forest-700">
                                <div className="w-8 h-8 bg-forest-accent rounded-full flex items-center justify-center text-forest-900 font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-white text-sm font-medium">{user.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            onClick={() => { setActiveTab('profile'); setIsEditing(true); }}
                            className="px-6 py-2 bg-forest-accent text-forest-900 font-bold rounded-lg hover:bg-white transition-colors shadow-lg shadow-forest-accent/20"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 flex-grow">
                <div className="grid md:grid-cols-12 gap-8 h-full">
                    {/* Sidebar Navigation (Desktop) */}
                    <div className="hidden md:block md:col-span-3 lg:col-span-3">
                        <div className="glass-card p-6 border border-forest-700/50 h-full flex flex-col">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-20 h-20 bg-forest-800 rounded-full flex items-center justify-center border-2 border-forest-accent mb-3">
                                    <UserIcon className="w-10 h-10 text-forest-accent" />
                                </div>
                                <h3 className="text-white font-bold text-lg">{user.name}</h3>
                                <p className="text-forest-400 text-sm">{user.email}</p>
                            </div>

                            <nav className="space-y-2 flex-grow">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${activeTab === 'profile' ? 'bg-forest-accent text-forest-900 font-bold shadow-md' : 'text-forest-300 hover:bg-forest-800 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <UserIcon className="w-5 h-5" />
                                        <span>My Profile</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0'}`} />
                                </button>

                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-forest-accent text-forest-900 font-bold shadow-md' : 'text-forest-300 hover:bg-forest-800 hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5" />
                                        <span>Settings</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 ${activeTab === 'settings' ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                            </nav>

                            <div className="mt-8 pt-6 border-t border-forest-700/50">
                                <button
                                    onClick={() => { logout(); onNavigate('main'); }}
                                    className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-9 lg:col-span-9">
                        {/* Mobile Tabs */}
                        <div className="md:hidden flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === 'profile' ? 'bg-forest-accent text-forest-900 font-bold' : 'bg-forest-800 text-forest-300 border border-forest-700'}`}
                            >
                                <UserIcon className="w-4 h-4" />
                                My Profile
                            </button>

                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeTab === 'settings' ? 'bg-forest-accent text-forest-900 font-bold' : 'bg-forest-800 text-forest-300 border border-forest-700'}`}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                        </div>

                        <div className="glass-card p-6 md:p-8 border border-forest-700/50 h-full">
                            {/* Success Notification */}
                            {passwordStatus === 'success' && (
                                <div className="mb-6 bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-2 rounded-lg flex items-center gap-2 animate-fade-in-down">
                                    <CheckCircle className="w-4 h-4" />
                                    Changes saved successfully
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div className="animate-fade-in space-y-6">
                                    {/* Bento Grid Layout */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                        {/* Profile Card - Spans 2 columns */}
                                        <div className="md:col-span-2 bg-gradient-to-br from-forest-900/80 to-forest-900/40 p-8 rounded-3xl border border-forest-700/30 backdrop-blur-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-forest-accent/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-forest-accent/10"></div>

                                            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center border-2 border-forest-700 shadow-xl">
                                                        <span className="text-4xl font-bold text-forest-accent">{name.charAt(0)}</span>
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 bg-forest-900 rounded-lg p-1.5 border border-forest-700 shadow-lg">
                                                        <ShieldCheck className="w-5 h-5 text-forest-accent" />
                                                    </div>
                                                </div>

                                                <div className="flex-1 text-center md:text-left">
                                                    <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
                                                    <p className="text-forest-300 mb-6 flex items-center justify-center md:justify-start gap-2">
                                                        <Mail className="w-4 h-4" /> {email}
                                                    </p>

                                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                                        <span className="px-4 py-1.5 bg-forest-accent/10 text-forest-accent text-sm font-bold rounded-full border border-forest-accent/20">
                                                            {user?.plan || 'Free Plan'}
                                                        </span>
                                                        <span className="px-4 py-1.5 bg-forest-800/50 text-forest-300 text-sm font-medium rounded-full border border-forest-700/50">
                                                            Member since {new Date().getFullYear()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security Overview Card - Takes 1 column */}
                                        <div className="bg-gradient-to-br from-forest-800/30 to-forest-900/30 p-6 rounded-2xl border border-forest-700/30 h-fit relative overflow-hidden group hover:border-forest-accent/30 transition-colors">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-forest-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-forest-accent/10 transition-colors"></div>

                                            <div className="flex items-center justify-between mb-6 relative z-10">
                                                <h3 className="text-lg font-bold text-white">Security Overview</h3>
                                                <div className={`flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full border ${securityStats.threats > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                                                    {securityStats.threats > 0 ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                                    {securityStats.threats > 0 ? 'Attention Needed' : 'Protected'}
                                                </div>
                                            </div>

                                            <div className="text-center mb-8 relative z-10">
                                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forest-900 border-4 border-forest-800 mb-4 relative">
                                                    <span className="text-2xl font-bold text-white">{securityStats.score}</span>
                                                    <span className={`absolute top-0 right-0 w-4 h-4 border-2 border-forest-900 rounded-full ${securityStats.score >= 90 ? 'bg-green-500' : securityStats.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                                                </div>
                                                <h4 className="text-xl font-bold text-white">Security Score</h4>
                                                <p className="text-forest-400 text-sm">{securityStats.score >= 90 ? 'Your account is secure' : 'Improvements available'}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 border-t border-forest-700/50 pt-6 relative z-10">
                                                <div className="text-center p-3 bg-forest-900/50 rounded-lg">
                                                    <p className="text-2xl font-bold text-white">{securityStats.scans}</p>
                                                    <p className="text-xs text-forest-400 uppercase tracking-wider">Scans Run</p>
                                                </div>
                                                <div className="text-center p-3 bg-forest-900/50 rounded-lg">
                                                    <p className={`text-2xl font-bold ${securityStats.threats > 0 ? 'text-red-400' : 'text-white'}`}>{securityStats.threats}</p>
                                                    <p className="text-xs text-forest-400 uppercase tracking-wider">Threats Found</p>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-forest-700/50 text-center">
                                                <p className="text-xs text-forest-400 mb-4">Last scan: <span className="text-forest-200">{securityStats.lastScan}</span></p>
                                                <button
                                                    onClick={handleScanNow}
                                                    disabled={isScanning}
                                                    className="w-full py-2 bg-forest-accent/10 hover:bg-forest-accent/20 text-forest-accent font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {isScanning ? <Loader className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                                    {isScanning ? 'Scanning...' : 'Scan Now'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Personal Info - Spans 3 columns (Full width) */}
                                        <div className="md:col-span-3 bg-forest-900/30 p-6 rounded-2xl border border-forest-700/30">
                                            <div className="flex items-center gap-6 mb-6">
                                                <div className="relative group cursor-pointer">
                                                    <div className="w-20 h-20 bg-forest-800 rounded-full flex items-center justify-center border-2 border-forest-accent overflow-hidden">
                                                        <UserIcon className="w-10 h-10 text-forest-accent" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Camera className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">Personal Information</h3>
                                                    <p className="text-forest-400 text-sm">Manage your personal details</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-xs font-medium text-forest-400 mb-1 uppercase tracking-wide">Full Name</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            className="w-full bg-forest-900/50 border border-forest-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-forest-accent"
                                                        />
                                                    ) : (
                                                        <p className="text-white text-lg font-medium">{name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-forest-400 mb-1 uppercase tracking-wide">Email Address</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="w-full bg-forest-900/50 border border-forest-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-forest-accent"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-white text-lg">
                                                            <Mail className="w-4 h-4 text-forest-500" />
                                                            {email}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-forest-400 mb-1 uppercase tracking-wide">Phone Number</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="tel"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            placeholder="+1 (555) 000-0000"
                                                            className="w-full bg-forest-900/50 border border-forest-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-forest-accent"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-white text-lg">
                                                            <Phone className="w-4 h-4 text-forest-500" />
                                                            {phone || <span className="text-forest-500 italic text-sm">Not set</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-forest-400 mb-1 uppercase tracking-wide">Location</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={location}
                                                            onChange={(e) => setLocation(e.target.value)}
                                                            placeholder="New York, USA"
                                                            className="w-full bg-forest-900/50 border border-forest-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-forest-accent"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-white text-lg">
                                                            <MapPin className="w-4 h-4 text-forest-500" />
                                                            {location || <span className="text-forest-500 italic text-sm">Not set</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="mt-6 flex justify-end">
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="flex items-center gap-2 px-6 py-2 bg-forest-accent text-forest-900 font-bold rounded-lg hover:bg-white transition-colors"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        Save Changes
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Recommendations Section - Conditional */}
                                        {recommendations.length > 0 && (
                                            <div className="md:col-span-3 bg-red-500/10 p-6 rounded-2xl border border-red-500/30 animate-fade-in">
                                                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                                                    <ShieldAlert className="w-5 h-5" />
                                                    Security Recommendations
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {recommendations.map((rec, index) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                                                            <div className="p-1 bg-red-500/20 rounded-full mt-0.5">
                                                                <ShieldAlert className="w-3 h-3 text-red-400" />
                                                            </div>
                                                            <span className="text-forest-200 text-sm">{rec}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="animate-fade-in space-y-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

                                    <div className="bg-forest-900/30 p-6 rounded-xl border border-forest-700/50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                                    <Mail className="w-5 h-5 text-forest-accent" />
                                                    Email Security Reports
                                                </h3>
                                                <p className="text-forest-400 text-sm">
                                                    Receive detailed recommendations via email when your security score is low.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleToggleEmailNotifications}
                                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${emailNotifications ? 'bg-forest-accent' : 'bg-forest-700'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${emailNotifications ? 'right-1' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-forest-900/30 p-6 rounded-xl border border-forest-700/50">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Lock className="w-5 h-5 text-forest-accent" />
                                            Change Password
                                        </h3>
                                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-forest-300 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full bg-forest-900/50 border border-forest-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-forest-accent"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-forest-300 mb-2">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-forest-900/50 border border-forest-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-forest-accent"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            {passwordMsg && (
                                                <p className={`text-sm ${passwordStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {passwordMsg}
                                                </p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={passwordStatus === 'loading' || !newPassword}
                                                className="px-6 py-3 bg-forest-accent text-forest-900 font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                                            >
                                                {passwordStatus === 'loading' ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </form>
                                    </div>

                                    <div className="bg-red-900/10 p-6 rounded-xl border border-red-900/30">
                                        <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                                            <ShieldAlert className="w-5 h-5" />
                                            Danger Zone
                                        </h3>
                                        <p className="text-forest-300 mb-6 text-sm">
                                            Deleting your account is permanent. All your data and protection history will be wiped.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={isDeleting}
                                            className="px-6 py-3 border border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
