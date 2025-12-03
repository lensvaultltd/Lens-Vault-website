import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import * as dbService from '../services/databaseService';
import type { User } from '../types/database.types';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
