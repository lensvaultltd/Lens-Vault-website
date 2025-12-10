import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle, ArrowLeft, CheckCircle, Phone, MessageCircle, HelpCircle, Loader } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { createBooking, getUserBookings, updateBooking } from '../services/databaseService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Assuming standard routing, but codebase uses prop onNavigate

interface BookingPageProps {
    onNavigate: (page: string) => void;
    bookingData: {
        planName: string;
        isTeam: boolean;
    } | null;
}

const BookingPage: React.FC<BookingPageProps> = ({ onNavigate, bookingData }) => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [existingBookings, setExistingBookings] = useState<any[]>([]);
    const [showMyBookings, setShowMyBookings] = useState(false);

    // Default to individual if no data (e.g. direct access/dev testing)
    const isTeam = bookingData?.isTeam ?? false;
    const planName = bookingData?.planName || "Session";

    // Time slots generation
    const timeSlots = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
    ];

    useEffect(() => {
        if (user) {
            loadBookings();
        }
    }, [user]);

    const loadBookings = async () => {
        if (!user) return;
        const bookings = await getUserBookings(user.id);
        setExistingBookings(bookings);
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !user) return;
        setStatus('submitting');

        // Combine date and time
        const bookingDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':');
        bookingDateTime.setHours(parseInt(hours), parseInt(minutes));

        const success = await createBooking({
            userId: user.id,
            planName: planName,
            bookingDate: bookingDateTime.toISOString(),
            notes: isTeam ? "Team Session (4hrs)" : "Individual Session (3hrs)"
        });

        if (success) {
            setStatus('success');
            loadBookings();
        } else {
            setStatus('error');
        }
    };

    // Styling for DayPicker to match theme roughly
    const css = `
        .rdp { --rdp-cell-size: 45px; --rdp-accent-color: #0ea5e9; --rdp-background-color: #0c4a6e; margin: 0; }
        .rdp-day_selected:not([disabled]) { font-weight: bold; background-color: var(--rdp-accent-color); }
        .rdp-day:hover:not([disabled]) { background-color: #0c4a6e; color: white; }
    `;

    if (status === 'success') {
        return (
            <section className="py-24 md:py-32 min-h-screen flex items-center justify-center">
                <div className="text-center p-8 glass-card max-w-lg mx-auto border border-forest-accent/50 animate-fade-in-up">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
                    <p className="text-forest-200 mb-8">
                        Your session for <strong>{planName}</strong> has been scheduled for<br />
                        <span className="text-white font-bold text-xl">
                            {selectedDate && format(selectedDate, 'MMMM do, yyyy')} at {selectedTime}
                        </span>
                    </p>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => setStatus('idle')} className="bg-forest-800 text-white px-6 py-3 rounded-full hover:bg-forest-700 transition">
                            Book Another Session
                        </button>
                        <button onClick={() => onNavigate('main')} className="text-forest-400 hover:text-white transition">
                            Back to Home
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 md:py-32 min-h-screen">
            <style>{css}</style>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => onNavigate('main')}
                        className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>
                    <button
                        onClick={() => setShowMyBookings(!showMyBookings)}
                        className="inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg bg-forest-800 text-white hover:bg-forest-700 transition-colors"
                    >
                        <CalendarIcon className="w-5 h-5" />
                        {showMyBookings ? "New Booking" : "My Bookings"}
                    </button>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            {showMyBookings ? "Your Appointments" : `Book Your ${planName}`}
                        </h1>
                        <p className="text-forest-200 text-lg max-w-2xl mx-auto">
                            {showMyBookings
                                ? "Manage your upcoming security sessions."
                                : "Select a date and time to lock in your session."}
                        </p>
                    </div>

                    {showMyBookings ? (
                        <div className="grid gap-4 max-w-3xl mx-auto">
                            {existingBookings.length === 0 ? (
                                <div className="text-center py-12 glass-card">
                                    <p className="text-forest-300 text-lg">No appointments found.</p>
                                    <button onClick={() => setShowMyBookings(false)} className="mt-4 text-forest-accent hover:underline">Book one now</button>
                                </div>
                            ) : (
                                existingBookings.map(b => (
                                    <div key={b.id} className="glass-card p-6 flex justify-between items-center border-l-4 border-l-forest-accent">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{b.planName}</h3>
                                            <p className="text-forest-200 flex items-center gap-2 mt-1">
                                                <CalendarIcon className="w-4 h-4" />
                                                {format(new Date(b.bookingDate), 'MMMM do, yyyy - h:mm a')}
                                            </p>
                                            <span className="inline-block mt-3 px-3 py-1 bg-green-900/50 text-green-300 text-xs rounded-full uppercase tracking-wider font-bold">
                                                {b.status}
                                            </span>
                                        </div>
                                        {/* Future: Add Reschedule Button here */}
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Calendar Section */}
                            <div className="lg:col-span-8 flex flex-col md:flex-row gap-8 glass-card p-8">
                                <div className="flex-shrink-0 bg-white rounded-xl p-4 shadow-inner text-gray-900">
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={{ before: new Date() }} // Disable past dates
                                        className="m-0"
                                    />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-forest-accent" />
                                        Available Times ({selectedDate ? format(selectedDate, 'MMM do') : 'Select Date'})
                                    </h3>

                                    {!selectedDate ? (
                                        <p className="text-forest-300 italic">Please select a date from the calendar first.</p>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-3">
                                            {timeSlots.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-3 px-4 rounded-lg font-bold transition-all ${selectedTime === time
                                                            ? 'bg-forest-accent text-forest-900 shadow-lg scale-105'
                                                            : 'bg-forest-800/50 text-forest-200 hover:bg-forest-700 hover:text-white'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {selectedDate && selectedTime && (
                                        <div className="mt-8 pt-6 border-t border-forest-700/50 animate-fade-in">
                                            <button
                                                onClick={handleBooking}
                                                disabled={status === 'submitting'}
                                                className="w-full bg-gradient-to-r from-forest-accent to-blue-500 hover:from-white hover:to-white hover:text-forest-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                                            >
                                                {status === 'submitting' ? (
                                                    <><Loader className="animate-spin w-5 h-5" /> Confirming...</>
                                                ) : (
                                                    `Confirm Appointment`
                                                )}
                                            </button>
                                            <p className="text-center text-xs text-forest-400 mt-3">
                                                You will receive a confirmation email shortly.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="glass-card p-6 border-l-4 border-l-forest-accent bg-forest-900/40 backdrop-blur-md">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <div className="p-2 bg-forest-accent/20 rounded-full">
                                            <CalendarIcon className="w-5 h-5 text-forest-accent" />
                                        </div>
                                        Booking Details
                                    </h3>
                                    <div className="space-y-4 text-forest-200 text-sm">
                                        <div className="flex justify-between border-b border-forest-700/30 pb-2">
                                            <span>Service Type:</span>
                                            <span className="font-bold text-white text-right">{planName}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-forest-700/30 pb-2">
                                            <span>Duration:</span>
                                            <span className="font-bold text-white">{isTeam ? '4 Hours / Day' : '3 Hours'}</span>
                                        </div>
                                        <div className="p-3 bg-forest-800/50 rounded-lg text-xs leading-relaxed">
                                            {isTeam
                                                ? "Note: For Team plans, please book 2 separate slots within the week for the full 8-hour training."
                                                : "Note: This is a single 3-hour intensive session."}
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card p-6 border border-forest-700/50 bg-forest-800/20">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-forest-accent" />
                                        Need Help?
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="text-sm text-forest-200">
                                            <p className="mb-2">Need a custom time? Reach out directly.</p>
                                            <a href="https://wa.me/2349068845666" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-forest-accent transition-colors font-medium">
                                                <Phone className="w-4 h-4" />
                                                +234 906 884 5666
                                            </a>
                                        </div>
                                        <div className="pt-4 border-t border-forest-700/30">
                                            <a
                                                href={`https://wa.me/2349068845666?text=${encodeURIComponent("Hello, I'd like to claim my free 10-min consultation.")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-600 text-white py-2 px-4 rounded-lg text-sm font-bold transition-all shadow-md"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Free 10-min Chat
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BookingPage;
