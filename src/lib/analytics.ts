// Analytics utility for tracking user behavior and events
// Supports Google Analytics, Mixpanel, or custom analytics

interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
}

class Analytics {
    private isEnabled: boolean;
    private isDevelopment: boolean;

    constructor() {
        this.isDevelopment = import.meta.env.DEV;
        this.isEnabled = !this.isDevelopment; // Disable in development
    }

    // Initialize analytics (call this in App.tsx)
    init() {
        if (!this.isEnabled) {
            console.log('[Analytics] Disabled in development mode');
            return;
        }

        // TODO: Initialize Google Analytics
        // Example:
        // gtag('config', 'GA_MEASUREMENT_ID');

        // TODO: Initialize Mixpanel
        // Example:
        // mixpanel.init('YOUR_PROJECT_TOKEN');
    }

    // Track page views
    pageView(path: string, title?: string) {
        if (!this.isEnabled) return;

        // TODO: Send to Google Analytics
        // gtag('event', 'page_view', { page_path: path, page_title: title });

        // TODO: Send to Mixpanel
        // mixpanel.track('Page View', { path, title });

        if (this.isDevelopment) {
            console.log('[Analytics] Page View:', path, title);
        }
    }

    // Track custom events
    event(event: AnalyticsEvent) {
        if (!this.isEnabled) return;

        const { category, action, label, value } = event;

        // TODO: Send to Google Analytics
        // gtag('event', action, {
        //     event_category: category,
        //     event_label: label,
        //     value: value
        // });

        // TODO: Send to Mixpanel
        // mixpanel.track(action, { category, label, value });

        if (this.isDevelopment) {
            console.log('[Analytics] Event:', event);
        }
    }

    // Track user signup
    signup(method: string) {
        this.event({
            category: 'User',
            action: 'Signup',
            label: method
        });
    }

    // Track user login
    login(method: string) {
        this.event({
            category: 'User',
            action: 'Login',
            label: method
        });
    }

    // Track subscription purchase
    purchase(planId: string, amount: number) {
        this.event({
            category: 'Conversion',
            action: 'Purchase',
            label: planId,
            value: amount
        });
    }

    // Track feature usage
    featureUsed(featureName: string) {
        this.event({
            category: 'Feature',
            action: 'Used',
            label: featureName
        });
    }

    // Track errors
    error(errorMessage: string, errorType?: string) {
        this.event({
            category: 'Error',
            action: errorType || 'Unknown',
            label: errorMessage
        });
    }

    // Identify user (for Mixpanel, etc.)
    identify(userId: string, traits?: Record<string, any>) {
        if (!this.isEnabled) return;

        // TODO: Identify user in Mixpanel
        // mixpanel.identify(userId);
        // mixpanel.people.set(traits);

        if (this.isDevelopment) {
            console.log('[Analytics] Identify:', userId, traits);
        }
    }
}

export const analytics = new Analytics();
