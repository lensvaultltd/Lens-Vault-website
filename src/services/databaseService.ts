// @ts-nocheck
import { supabase } from '../lib/supabase';
import type { User, Payment, ContactMessage, Feedback, SecurityStats } from '../types/database.types';

/**
 * Update user's plan
 */
export async function updateUserPlan(userId: string, plan: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('users')
            .update({ plan, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Update user plan error:', error);
        return false;
    }
}

/**
 * Create a payment record
 */
export async function createPayment(payment: {
    userId: string;
    planName: string;
    amount: number;
    paymentType: 'setup' | 'retainer';
    reference: string;
    status?: string;
}): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('payments')
            .insert({
                user_id: payment.userId,
                plan_name: payment.planName,
                amount: payment.amount,
                payment_type: payment.paymentType,
                reference: payment.reference,
                status: payment.status || 'completed'
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Create payment error:', error);
        return false;
    }
}

/**
 * Get user's payment history
 */
export async function getUserPayments(userId: string): Promise<Payment[]> {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(payment => ({
            id: payment.id,
            userId: payment.user_id,
            planName: payment.plan_name,
            amount: payment.amount,
            paymentType: payment.payment_type,
            reference: payment.reference,
            status: payment.status,
            createdAt: payment.created_at
        }));
    } catch (error) {
        console.error('Get user payments error:', error);
        return [];
    }
}

/**
 * Submit a contact form message
 */
export async function submitContactMessage(
    name: string,
    email: string,
    message: string
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('contact_messages')
            .insert({
                name,
                email,
                message
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Submit contact message error:', error);
        return false;
    }
}

/**
 * Get all contact messages (admin only)
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
    try {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(msg => ({
            id: msg.id,
            name: msg.name,
            email: msg.email,
            message: msg.message,
            createdAt: msg.created_at
        }));
    } catch (error) {
        console.error('Get contact messages error:', error);
        return [];
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<{
        name: string;
        email: string;
        walletAddress: string;
        emailNotifications: boolean;
    }>
): Promise<boolean> {
    try {
        const dbUpdates: any = {
            updated_at: new Date().toISOString()
        };

        if (updates.name) dbUpdates.name = updates.name;
        if (updates.email) dbUpdates.email = updates.email;
        if (updates.walletAddress !== undefined) dbUpdates.wallet_address = updates.walletAddress;
        if (updates.emailNotifications !== undefined) dbUpdates.email_notifications = updates.emailNotifications;

        const { error } = await supabase
            .from('users')
            .update(dbUpdates)
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Update user profile error:', error);
        return false;
    }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            email: data.email,
            name: data.name,
            plan: data.plan || undefined,
            walletAddress: data.wallet_address || undefined,
            emailNotifications: data.email_notifications || false
        };
    } catch (error) {
        console.error('Get user by ID error:', error);
        return null;
    }
}

/**
 * Submit feedback
 */
export async function submitFeedback(
    userId: string | null,
    message: string,
    rating?: number
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('feedback')
            .insert({
                user_id: userId,
                message,
                rating
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Submit feedback error:', error);
        return false;
    }
}

/**
 * Get all feedback (admin only)
 */
export async function getFeedback(): Promise<Feedback[]> {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select(`
                *,
                users (
                    name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(item => ({
            id: item.id,
            userId: item.user_id,
            userName: item.users?.name,
            userEmail: item.users?.email,
            message: item.message,
            rating: item.rating,
            createdAt: item.created_at
        }));
    } catch (error) {
        console.error('Get feedback error:', error);
        return [];
    }
}

/**
 * Get user security stats
 */
export async function getSecurityStats(userId: string): Promise<SecurityStats | null> {
    try {
        const { data, error } = await supabase
            .from('security_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // If no stats found, return null (UI can show defaults or create one)
            if (error.code === 'PGRST116') return null;
            throw error;
        }

        return {
            id: data.id,
            userId: data.user_id,
            securityScore: data.security_score,
            scansRun: data.scans_run,
            threatsFound: data.threats_found,
            lastScanDate: data.last_scan_date
        };
    } catch (error) {
        console.error('Get security stats error:', error);
        return null;
    }
}

/**
 * Update security stats (e.g. after a scan)
 */
export async function updateSecurityStats(
    userId: string,
    stats: Partial<{
        securityScore: number;
        scansRun: number;
        threatsFound: number;
        lastScanDate: string;
    }>
): Promise<boolean> {
    try {
        const dbUpdates: any = {
            updated_at: new Date().toISOString()
        };

        if (stats.securityScore !== undefined) dbUpdates.security_score = stats.securityScore;
        if (stats.scansRun !== undefined) dbUpdates.scans_run = stats.scansRun;
        if (stats.threatsFound !== undefined) dbUpdates.threats_found = stats.threatsFound;
        if (stats.lastScanDate !== undefined) dbUpdates.last_scan_date = stats.lastScanDate;

        // Upsert: update if exists, insert if not
        const { error } = await supabase
            .from('security_stats')
            .upsert({
                user_id: userId,
                ...dbUpdates
            }, { onConflict: 'user_id' });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Update security stats error:', error);
        return false;
    }
}
