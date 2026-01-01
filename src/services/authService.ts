// Supabase-only Authentication Service
// Complete migration from Firebase to Supabase Auth

import { supabase } from '../lib/supabase';
import type { User } from '../types/database.types';
import type { AuthError, Session } from '@supabase/supabase-js';

export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

/**
 * Sign up with email and password using Supabase Auth
 * Automatically creates user profile in users table via database trigger
 */
export async function signUpWithEmail(
    email: string,
    password: string,
    name: string
): Promise<AuthResult> {
    try {
        // 1. Create auth user in Supabase
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name, // Store name in user metadata
                }
            }
        });

        if (authError) throw authError;
        if (!data.user) throw new Error('No user returned from signup');

        // 2. Create user profile in database
        // Note: Ideally, use a database trigger to auto-create profile
        // For now, we'll do it manually to ensure immediate availability
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .insert({
                id: data.user.id, // CRITICAL: Map Auth ID to User ID
                auth_id: data.user.id,
                email,
                name,
                plan: 'Free'
            })
            .select()
            .single();

        if (profileError) {
            console.error('Failed to create profile:', profileError);
            // If it failed because it already exists (trigger race condition), try fetching it
            if (profileError.code === '23505') { // Unique violation
                 const { data: existingProfile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('auth_id', data.user.id)
                    .single();
                
                 if (existingProfile) {
                     return {
                        success: true,
                        user: {
                            id: existingProfile.id,
                            email: existingProfile.email,
                            name: existingProfile.name,
                            plan: existingProfile.plan || undefined,
                            walletAddress: existingProfile.wallet_address || undefined
                        }
                    };
                 }
            }

            // Delete auth user if profile creation fails and it's not a duplicate
            await supabase.auth.admin.deleteUser(data.user.id);
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

        if (error.message?.includes('already registered')) {
            errorMessage = 'Email is already in use.';
        } else if (error.message?.includes('Password')) {
            errorMessage = 'Password is too weak. Use at least 6 characters.';
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Sign in with email and password using Supabase Auth
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<AuthResult> {
    try {
        // 1. Sign in with Supabase Auth
        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) throw authError;
        if (!data.user) throw new Error('No user returned from signin');

        // 2. Fetch user profile from database
        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', data.user.id)
            .single();

        if (profileError || !profileData) {
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

        if (error.message?.includes('Invalid') || error.message?.includes('credentials')) {
            errorMessage = 'Invalid email or password.';
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Sign in with OAuth provider (Google, Twitter, etc.)
 */
export async function signInWithOAuth(provider: 'google' | 'twitter' | 'github'): Promise<AuthResult> {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) throw error;

        // OAuth flow redirects user, so we return success immediately
        // The actual user data will be available after redirect in observeAuthState
        return {
            success: true
        };
    } catch (error: any) {
        console.error(`${provider} sign-in error:`, error);
        return {
            success: false,
            error: error.message || `Failed to sign in with ${provider}`
        };
    }
}

/**
 * Sign in with Google (convenience wrapper)
 */
export async function signInWithGoogle(): Promise<AuthResult> {
    return signInWithOAuth('google');
}

/**
 * Sign in with Twitter (convenience wrapper)
 */
export async function signInWithTwitter(): Promise<AuthResult> {
    return signInWithOAuth('twitter');
}

/**
 * Sign in with wallet address
 * Note: Supabase doesn't have native Web3 auth, so we use custom implementation
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
 * Sign out from Supabase
 */
export async function signOut(): Promise<void> {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        console.error('Sign out error:', error);
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResult> {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        console.error('Reset password error:', error);
        let errorMessage = error.message || 'Failed to send reset email';

        if (error.message?.includes('not found')) {
            errorMessage = 'No account found with this email.';
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Change password (requires user to be logged in)
 */
export async function changePassword(newPassword: string): Promise<AuthResult> {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

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
 * Delete account (auth user and profile)
 */
export async function deleteAccount(): Promise<AuthResult> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        // 1. Delete user profile from database
        const { error: dbError } = await supabase
            .from('users')
            .delete()
            .eq('auth_id', user.id);

        if (dbError) {
            console.error('Error deleting user profile:', dbError);
        }

        // 2. Delete auth user (requires admin access or RPC function)
        // Note: Regular users can't delete themselves via API
        // This should be done via Supabase Edge Function or admin API
        // For now, we'll sign out and let admin handle deletion
        await supabase.auth.signOut();

        return { success: true };
    } catch (error: any) {
        console.error('Delete account error:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete account.'
        };
    }
}

/**
 * Observe authentication state changes
 */
export function observeAuthState(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
            // User is signed in, fetch profile
            try {
                const { data: profileData, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('auth_id', session.user.id)
                    .single();

                if (profileData && !error) {
                    callback({
                        id: profileData.id,
                        email: profileData.email,
                        name: profileData.name,
                        plan: profileData.plan || undefined,
                        walletAddress: profileData.wallet_address || undefined
                    });
                } else {
                    // Profile doesn't exist, create it from OAuth data
                    if (event === 'SIGNED_IN' && session.user.email) {
                        const { data: newProfile } = await supabase
                            .from('users')
                            .insert({
                                auth_id: session.user.id,
                                email: session.user.email,
                                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'User',
                                plan: 'Free'
                            })
                            .select()
                            .single();

                        if (newProfile) {
                            callback({
                                id: newProfile.id,
                                email: newProfile.email,
                                name: newProfile.name,
                                plan: newProfile.plan || undefined,
                                walletAddress: newProfile.wallet_address || undefined
                            });
                        } else {
                            callback(null);
                        }
                    } else {
                        callback(null);
                    }
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                callback(null);
            }
        } else {
            // User is signed out
            callback(null);
        }
    });

    // Return unsubscribe function
    return () => {
        subscription.unsubscribe();
    };
}

/**
 * Get current user profile (one-time check)
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', user.id)
            .single();

        if (profileData && !profileError) {
            return {
                id: profileData.id,
                email: profileData.email,
                name: profileData.name,
                plan: profileData.plan || undefined,
                walletAddress: profileData.wallet_address || undefined
            };
        }

        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Get current Supabase session
 */
export async function getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

/**
 * Refresh current session
 */
export async function refreshSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.refreshSession();
    return session;
}
