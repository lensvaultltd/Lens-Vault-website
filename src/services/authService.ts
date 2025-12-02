import { supabase } from '../lib/supabase';
import { auth, googleProvider, twitterProvider } from '../lib/firebase';
import {
    signInWithPopup,
    signInWithEmailAndPassword as firebaseSignInWithEmail,
    createUserWithEmailAndPassword as firebaseCreateUserWithEmail,
    signOut as firebaseSignOut,
    User as FirebaseUser
} from 'firebase/auth';
import type { User } from '../types/database.types';

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

/**
 * Sign up with email and password using Supabase
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    name: string
): Promise<AuthResult> {
    try {
        // Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name
                }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user returned from signup');

        // Create user profile in database
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                name,
                plan: 'Free'
            })
            .select()
            .single();

        if (profileError) throw profileError;

        return {
            success: true,
            user: {
                id: profileData.id,
                email: profileData.email,
                name: profileData.name,
                plan: profileData.plan || undefined,
                walletAddress: profileData.wallet_address || undefined
            }
        };
    } catch (error: any) {
        console.error('Signup error:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign up'
        };
    }
}

/**
 * Sign in with email and password using Supabase
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<AuthResult> {
    try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user returned from login');

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) throw profileError;

        return {
            success: true,
            user: {
                id: profileData.id,
                email: profileData.email,
                name: profileData.name,
                plan: profileData.plan || undefined,
                walletAddress: profileData.wallet_address || undefined
            }
        };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in'
        };
    }
}

/**
 * Sign in with Google using Firebase
 */
export async function signInWithGoogle(): Promise<AuthResult> {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Create or update user in Supabase
        const user = await syncFirebaseUserToSupabase(firebaseUser);

        return {
            success: true,
            user
        };
    } catch (error: any) {
        console.error('Google sign-in error:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in with Google'
        };
    }
}

/**
 * Sign in with Twitter using Firebase
 */
export async function signInWithTwitter(): Promise<AuthResult> {
    try {
        const result = await signInWithPopup(auth, twitterProvider);
        const firebaseUser = result.user;

        // Create or update user in Supabase
        const user = await syncFirebaseUserToSupabase(firebaseUser);

        return {
            success: true,
            user
        };
    } catch (error: any) {
        console.error('Twitter sign-in error:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in with Twitter'
        };
    }
}

/**
 * Sign in with wallet address
 */
export async function signInWithWallet(walletAddress: string): Promise<AuthResult> {
    try {
        // Check if user exists with this wallet address
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        if (existingUser) {
            // User exists, return their profile
            return {
                success: true,
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    name: existingUser.name,
                    plan: existingUser.plan || undefined,
                    walletAddress: existingUser.wallet_address || undefined
                }
            };
        } else {
            // Create new user with wallet
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    email: `${walletAddress}@wallet.eth`,
                    name: 'Wallet User',
                    wallet_address: walletAddress,
                    plan: 'Free'
                })
                .select()
                .single();

            if (createError) throw createError;

            return {
                success: true,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    plan: newUser.plan || undefined,
                    walletAddress: newUser.wallet_address || undefined
                }
            };
        }
    } catch (error: any) {
        console.error('Wallet sign-in error:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in with wallet'
        };
    }
}

/**
 * Sign out from both Supabase and Firebase
 */
export async function signOut(): Promise<void> {
    try {
        await Promise.all([
            supabase.auth.signOut(),
            firebaseSignOut(auth)
        ]);
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

/**
 * Get current session from Supabase
 */
export async function getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const session = await getCurrentSession();
        if (!session?.user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            email: data.email,
            name: data.name,
            plan: data.plan || undefined,
            walletAddress: data.wallet_address || undefined
        };
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

/**
 * Helper function to sync Firebase user to Supabase
 */
async function syncFirebaseUserToSupabase(firebaseUser: FirebaseUser): Promise<User> {
    const email = firebaseUser.email || '';
    const name = firebaseUser.displayName || 'User';

    // Check if user exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (existingUser) {
        return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            plan: existingUser.plan || undefined,
            walletAddress: existingUser.wallet_address || undefined
        };
    }

    // Create new user
    const { data: newUser, error } = await supabase
        .from('users')
        .insert({
            email,
            name,
            plan: 'Free'
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan || undefined,
        walletAddress: newUser.wallet_address || undefined
    };
}
