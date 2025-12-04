import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword, deleteAccount } from '../services/authService';
import {
    User as UserIcon, Settings, LogOut, ChevronRight, CheckCircle, Mail,
    Camera, Phone, MapPin, Save, Search, Lock, ShieldAlert
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

    // Security Settings State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

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
                                This is your profile page. You can manage your personal information and account preferences here.
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
                                    {/* Bento Grid Layout - Adjusted for single column focus */}
                                    <div className="grid grid-cols-1 gap-6">

                                        {/* Profile Card - Spans full width */}
                                        <div className="bg-gradient-to-br from-forest-900/80 to-forest-900/40 p-8 rounded-3xl border border-forest-700/30 backdrop-blur-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-forest-accent/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-forest-accent/10"></div>

                                            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center border-2 border-forest-700 shadow-xl">
                                                        <span className="text-4xl font-bold text-forest-accent">{name.charAt(0)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 text-center md:text-left">
                                                    <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
                                                    <p className="text-forest-300 mb-6 flex items-center justify-center md:justify-start gap-2">
                                                        <Mail className="w-4 h-4" /> {email}
                                                    </p>

                                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">

                                                        <span className="px-4 py-1.5 bg-forest-800/50 text-forest-300 text-sm font-medium rounded-full border border-forest-700/50">
                                                            Member since {new Date().getFullYear()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personal Info - Spans full width */}
                                        <div className="bg-forest-900/30 p-6 rounded-2xl border border-forest-700/30">
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

                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="animate-fade-in space-y-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

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
