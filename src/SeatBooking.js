import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSeatBooking } from './hooks/useSeatBooking';
import SeatGrid from './components/SeatGrid';
import BookingSummary from './components/BookingSummary';
import SeatStats from './components/SeatStats';
import Controls from './components/Controls';
import Legend from './components/Legend';
import ConfirmationModal from './components/ConfirmationModal';
import { Tooltip } from 'react-tooltip';
import './SeatBooking.css';

/**
 * SeatBooking Component
 * 
 * The main container for the Seat Booking Application.
 * It manages the global theme state and coordinates the interaction between
 * the seat grid, controls, and booking logic.
 * 
 * @returns {JSX.Element} The rendered SeatBooking component.
 */
const SeatBooking = () => {
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    // Destructure logic and state from the custom hook
    const {
        seats,
        selectedCount,
        bookedCount,
        availableCount,
        totalPrice,
        handleSeatClick,
        handleBookSeats,
        handleClearSelection,
        handleReset,
        getSeatPrice
    } = useSeatBooking();

    // Effect to apply the theme to the document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    /**
     * Toggles the application theme between 'light' and 'dark'.
     */
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const openResetModal = () => setIsResetModalOpen(true);
    const closeResetModal = () => setIsResetModalOpen(false);
    
    /**
     * Confirms the system reset action.
     * Calls the handleReset function from the hook and closes the modal.
     */
    const confirmReset = () => {
        handleReset();
        closeResetModal();
    };

    return (
        <div className="seat-booking-container">
            {/* Theme Toggle Button */}
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <h1>GreenStitch Seat Booking System</h1>

            {/* Statistics Section */}
            <SeatStats 
                availableCount={availableCount}
                selectedCount={selectedCount}
                bookedCount={bookedCount}
            />

            {/* Legend Section */}
            <Legend />

            {/* Main Seat Grid */}
            <SeatGrid 
                seats={seats} 
                onSeatClick={handleSeatClick} 
                getSeatPrice={getSeatPrice}
            />

            {/* Booking Summary Section */}
            <BookingSummary 
                totalPrice={totalPrice} 
            />

            {/* Action Controls */}
            <Controls
                selectedCount={selectedCount}
                onBook={handleBookSeats}
                onClear={handleClearSelection}
                onReset={openResetModal}
            />

            {/* Reset Confirmation Modal */}
            <ConfirmationModal 
                isOpen={isResetModalOpen}
                onClose={closeResetModal}
                onConfirm={confirmReset}
                title="Reset System"
                message="Are you sure you want to reset the entire system? All bookings will be lost."
            />

            {/* Global Toast Notifications */}
            <ToastContainer position="bottom-right" theme={theme} />
            
            {/* Global Tooltip Component */}
            <Tooltip id="seat-tooltip" place="top" />
        </div>
    );
};

export default SeatBooking;