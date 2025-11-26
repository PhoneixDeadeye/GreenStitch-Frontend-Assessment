import React from 'react';

/**
 * Legend Component
 * 
 * Displays a visual guide for the seat status colors.
 * Shows what Available, Selected, and Booked seats look like.
 * 
 * @returns {JSX.Element} The rendered Legend component.
 */
const Legend = () => {
    return (
        <div className="legend">
            <div className="legend-item">
                <div className="seat-demo available"></div>
                <span>Available</span>
            </div>
            <div className="legend-item">
                <div className="seat-demo selected"></div>
                <span>Selected</span>
            </div>
            <div className="legend-item">
                <div className="seat-demo booked"></div>
                <span>Booked</span>
            </div>
        </div>
    );
};

export default Legend;
