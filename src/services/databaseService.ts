import { supabase } from '../lib/supabase';
import type { User, Payment, ContactMessage } from '../types/database.types';

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
    }>
): Promise<boolean> {
    try {
        const dbUpdates: any = {
            updated_at: new Date().toISOString()
        };

        if (updates.name) dbUpdates.name = updates.name;
        if (updates.email) dbUpdates.email = updates.email;
        if (updates.walletAddress !== undefined) dbUpdates.wallet_address = updates.walletAddress;

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
            walletAddress: data.wallet_address || undefined
        };
    } catch (error) {
        console.error('Get user by ID error:', error);
        return null;
    }
}
