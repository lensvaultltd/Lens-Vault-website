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
                    email_notifications: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    name: string;
                    wallet_address?: string | null;
                    plan?: string | null;
                    email_notifications?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string;
                    wallet_address?: string | null;
                    plan?: string | null;
                    email_notifications?: boolean;
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
            feedback: {
                Row: {
                    id: string;
                    user_id: string | null;
                    message: string;
                    rating: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    message: string;
                    rating?: number | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string | null;
                    message?: string;
                    rating?: number | null;
                    created_at?: string;
                };
            };
            security_stats: {
                Row: {
                    id: string;
                    user_id: string;
                    security_score: number;
                    scans_run: number;
                    threats_found: number;
                    last_scan_date: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    security_score?: number;
                    scans_run?: number;
                    threats_found?: number;
                    last_scan_date?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    security_score?: number;
                    scans_run?: number;
                    threats_found?: number;
                    last_scan_date?: string;
                    updated_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}

export interface User {
    id: string;
    email: string;
    name: string;
    walletAddress?: string;
    plan?: string;
    emailNotifications?: boolean;
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

export interface Feedback {
    id: string;
    userId: string | null;
    userName?: string;
    userEmail?: string;
    message: string;
    rating?: number;
    createdAt: string;
}

export interface SecurityStats {
    id: string;
    userId: string;
    securityScore: number;
    scansRun: number;
    threatsFound: number;
    lastScanDate: string;
}
