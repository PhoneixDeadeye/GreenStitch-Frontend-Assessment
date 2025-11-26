import React from 'react';

/**
 * BookingSummary Component
 * 
 * Displays the total price of the selected seats and a pricing legend.
 * 
 * @param {Object} props - Component props.
 * @param {number} props.totalPrice - The calculated total price of selected seats.
 * @returns {JSX.Element} The rendered BookingSummary component.
 */
const BookingSummary = ({ totalPrice }) => {
    return (
        <div className="pricing-info">
            <p>Selected Seats Total: <strong>₹{totalPrice}</strong></p>
            <p className="price-note">Premium (A-C): ₹1000 | Standard (D-F): ₹750 | Economy (G-H): ₹500</p>
        </div>
    );
};

export default BookingSummary;
