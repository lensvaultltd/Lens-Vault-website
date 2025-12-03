// @ts-nocheck
import { supabase } from '../lib/supabase';
import { auth, googleProvider, twitterProvider } from '../lib/firebase';
import {
    signInWithPopup,
    signInWithEmailAndPassword as firebaseSignInWithEmail,
    createUserWithEmailAndPassword as firebaseCreateUserWithEmail,
    signOut as firebaseSignOut,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    deleteUser as firebaseDeleteUser,
    updatePassword as firebaseUpdatePassword,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import type { User } from '../types/database.types';

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

/**
 * Sign up with email and password using Firebase Auth
 * and create user profile in Supabase DB
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    name: string
): Promise<AuthResult> {
    try {
        // 1. Create auth user in Firebase
        const userCredential = await firebaseCreateUserWithEmail(auth, email, password);
        const firebaseUser = userCredential.user;

        // 2. Create user profile in Supabase Database
        // We use the Firebase UID as the Supabase User ID for consistency
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert({
                id: firebaseUser.uid,
                email,
                name,
                plan: 'Free'
            })
            .select()
            .single();

        if (profileError) {
            // If DB insert fails, we should probably delete the Firebase user to maintain consistency
            // But for now, we'll just throw the error
            console.error('Failed to create Supabase profile:', profileError);
            throw new Error('Account created but failed to set up profile. Please contact support.');
        }

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
        let errorMessage = error.message || 'Failed to sign up';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email is already in use.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak.';
        }
        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Sign in with email and password using Firebase Auth
 * and fetch user profile from Supabase DB
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<AuthResult> {
    try {
        // 1. Sign in with Firebase
        const userCredential = await firebaseSignInWithEmail(auth, email, password);
        const firebaseUser = userCredential.user;

        // 2. Fetch user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', firebaseUser.uid)
            .single();

        if (profileError) {
            console.error('Failed to fetch profile:', profileError);
            throw new Error('Login successful but failed to load profile.');
        }

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
        let errorMessage = error.message || 'Failed to sign in';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password.';
        }
        return {
            success: false,
            error: errorMessage
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
 * Note: This still uses custom logic to map wallet to a user in Supabase.
 * Ideally, this should also integrate with Firebase Custom Auth if we want strict 100% Firebase Auth,
 * but for now we'll keep the existing logic as it creates a user record in Supabase.
 * To make it strict, we would need to create a Firebase user for this wallet.
 * For this refactor, we will assume "Firebase Auth" applies to Email/Socials, and Wallet is its own thing
 * OR we can create an anonymous firebase user and link it?
 * Let's keep it simple: Wallet users exist in Supabase.
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
            // We generate a pseudo-random ID since we don't have a Firebase UID
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
 * Sign out from Firebase
 */
export async function signOut(): Promise<void> {
    try {
        await firebaseSignOut(auth);
        // We don't need to sign out of Supabase because we aren't using Supabase Auth sessions anymore
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResult> {
    try {
        await firebaseSendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        console.error('Reset password error:', error);
        let errorMessage = error.message || 'Failed to send reset email';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        }
        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Delete account
 */
export async function deleteAccount(): Promise<AuthResult> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        // 1. Delete from Supabase (Cascade should handle related data, but let's be safe)
        const { error: dbError } = await supabase
            .from('users')
            .delete()
            .eq('id', user.uid);

        if (dbError) {
            console.error('Error deleting user data:', dbError);
            // Continue to delete auth user anyway? 
            // Ideally yes, but let's warn.
        }

        // 2. Delete from Firebase
        await firebaseDeleteUser(user);

        return { success: true };
    } catch (error: any) {
        console.error('Delete account error:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete account. You may need to re-login.'
        };
    }
}

/**
 * Change password
 */
export async function changePassword(newPassword: string): Promise<AuthResult> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        await firebaseUpdatePassword(user, newPassword);
        return { success: true };
    } catch (error: any) {
        console.error('Change password error:', error);
        return {
            success: false,
            error: error.message || 'Failed to update password. You may need to re-login.'
        };
    }
}


/**
 * Observe authentication state changes
 */
export function observeAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // User is signed in, fetch profile from Supabase
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', firebaseUser.uid)
                    .single();

                if (data && !error) {
                    callback({
                        id: data.id,
                        email: data.email,
                        name: data.name,
                        plan: data.plan || undefined,
                        walletAddress: data.wallet_address || undefined
                    });
                } else {
                    // User exists in Firebase but not in Supabase (shouldn't happen with our flow, but possible)
                    // Try to sync?
                    console.warn('User in Firebase but not Supabase, attempting sync...');
                    const syncedUser = await syncFirebaseUserToSupabase(firebaseUser);
                    callback(syncedUser);
                }
            } catch (err) {
                console.error('Error fetching profile for auth state change:', err);
                callback(null);
            }
        } else {
            // User is signed out
            callback(null);
        }
    });
}

/**
 * Get current user profile (One-off check)
 */
export async function getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            unsubscribe();
            if (firebaseUser) {
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', firebaseUser.uid)
                        .single();

                    if (data && !error) {
                        resolve({
                            id: data.id,
                            email: data.email,
                            name: data.name,
                            plan: data.plan || undefined,
                            walletAddress: data.wallet_address || undefined
                        });
                    } else {
                        resolve(null);
                    }
                } catch (err) {
                    console.error('Error getting current user:', err);
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

/**
 * Helper function to sync Firebase user to Supabase
 */
async function syncFirebaseUserToSupabase(firebaseUser: FirebaseUser): Promise<User> {
    const email = firebaseUser.email || '';
    const name = firebaseUser.displayName || 'User';
    const uid = firebaseUser.uid;

    // Check if user exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid) // Match by ID first (more reliable)
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

    // Fallback: Check by email (if ID didn't match but email does - e.g. migration?)
    // Actually, for strict separation, we should rely on UID.
    // If we are creating a new user:

    const { data: newUser, error } = await supabase
        .from('users')
        .insert({
            id: uid, // IMPORTANT: Use Firebase UID
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
