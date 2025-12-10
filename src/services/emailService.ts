import emailjs from '@emailjs/browser';

// Initialize EmailJS with the user's public key
const PUBLIC_KEY = "88Otb6Y5RLzdSDlPH";
// User provided IDs:
const SERVICE_ID = "service_g2h1vuc";
const TEMPLATE_ID = "template_q063k5c";

export const initEmail = () => {
    emailjs.init(PUBLIC_KEY);
};

export const sendBookingConfirmation = async (details: {
    user_name: string;
    user_email: string;
    plan_name: string;
    booking_date: string;
    notes?: string;
}) => {
    try {
        const templateParams = {
            to_name: details.user_name,
            to_email: details.user_email,
            // These parameter names must match variables in the EmailJS User Template {{variable_name}}
            plan_name: details.plan_name,
            booking_date: details.booking_date,
            notes: details.notes || "No notes",
        };

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('SUCCESS!', response.status, response.text);
        return true;
    } catch (error) {
        console.error('FAILED to send email:', error);
        // Do not block the booking flow if email fails, just log it
        return false;
    }
};
