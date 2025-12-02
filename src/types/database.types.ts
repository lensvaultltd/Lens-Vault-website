export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string;
                    wallet_address: string | null;
                    plan: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    name: string;
                    wallet_address?: string | null;
                    plan?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string;
                    wallet_address?: string | null;
                    plan?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            payments: {
                Row: {
                    id: string;
                    user_id: string;
                    plan_name: string;
                    amount: number;
                    payment_type: 'setup' | 'retainer';
                    reference: string;
                    status: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    plan_name: string;
                    amount: number;
                    payment_type: 'setup' | 'retainer';
                    reference: string;
                    status?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    plan_name?: string;
                    amount?: number;
                    payment_type?: 'setup' | 'retainer';
                    reference?: string;
                    status?: string;
                    created_at?: string;
                };
            };
            contact_messages: {
                Row: {
                    id: string;
                    name: string;
                    email: string;
                    message: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    email: string;
                    message: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    email?: string;
                    message?: string;
                    created_at?: string;
                };
            };
        };
    };
}

export interface User {
    id: string;
    email: string;
    name: string;
    walletAddress?: string;
    plan?: string;
}

export interface Payment {
    id: string;
    userId: string;
    planName: string;
    amount: number;
    paymentType: 'setup' | 'retainer';
    reference: string;
    status: string;
    createdAt: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}
