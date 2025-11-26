import React from 'react';

/**
 * SeatStats Component
 * 
 * Displays the current statistics of the seat booking system.
 * Shows counts for Available, Selected, and Booked seats.
 * 
 * @param {Object} props - Component props.
 * @param {number} props.availableCount - Number of available seats.
 * @param {number} props.selectedCount - Number of selected seats.
 * @param {number} props.bookedCount - Number of booked seats.
 * @returns {JSX.Element} The rendered SeatStats component.
 */
const SeatStats = ({ availableCount, selectedCount, bookedCount }) => {
    return (
        <div className="info-panel">
            <div className="info-item">
                <span className="info-label">Available:</span>
                <span className="info-value">{availableCount}</span>
            </div>
            <div className="info-item">
                <span className="info-label">Selected:</span>
                <span className="info-value">{selectedCount}</span>
            </div>
            <div className="info-item">
                <span className="info-label">Booked:</span>
                <span className="info-value">{bookedCount}</span>
            </div>
        </div>
    );
};

export default SeatStats;
