import React from 'react';
import { signInWithGoogle, signInWithTwitter } from '../services/authService';

interface SocialLoginProps {
    onSuccess: (user: any) => void;
    onError: (error: string) => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
);

export const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError }) => {
    const [loading, setLoading] = React.useState<'google' | 'twitter' | null>(null);

    const handleGoogleLogin = async () => {
        setLoading('google');
        try {
            const result = await signInWithGoogle();
            if (result.success && result.user) {
                onSuccess(result.user);
            } else {
                onError(result.error || 'Failed to sign in with Google');
            }
        } catch (error: any) {
            onError(error.message || 'Failed to sign in with Google');
        } finally {
            setLoading(null);
        }
    };

    const handleTwitterLogin = async () => {
        setLoading('twitter');
        try {
            const result = await signInWithTwitter();
            if (result.success && result.user) {
                onSuccess(result.user);
            } else {
                onError(result.error || 'Failed to sign in with Twitter');
            }
        } catch (error: any) {
            onError(error.message || 'Failed to sign in with Twitter');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleGoogleLogin}
                disabled={loading !== null}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading === 'google' ? (
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                ) : (
                    <GoogleIcon className="w-5 h-5" />
                )}
                <span>Continue with Google</span>
            </button>

            <button
                onClick={handleTwitterLogin}
                disabled={loading !== null}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1DA1F2] text-white font-semibold rounded-lg hover:bg-[#1a8cd8] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading === 'twitter' ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                ) : (
                    <TwitterIcon className="w-5 h-5" />
                )}
                <span>Continue with Twitter</span>
            </button>
        </div>
    );
};
