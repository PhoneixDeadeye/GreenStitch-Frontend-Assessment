import React from 'react';
import Seat from './Seat';

/**
 * SeatGrid Component
 * 
 * Renders the grid of seats organized by rows.
 * 
 * @param {Object} props - Component props.
 * @param {Array} props.seats - 2D array representing the grid of seats.
 * @param {Function} props.onSeatClick - Handler for seat click events.
 * @param {Function} props.getSeatPrice - Function to get the price of a seat based on its row.
 * @returns {JSX.Element} The rendered SeatGrid component.
 */
const SeatGrid = ({ seats, onSeatClick, getSeatPrice }) => {
    return (
        <div className="seat-grid">
            {seats.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                    {/* Row Label (A, B, C...) */}
                    <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
                    {row.map((seat) => (
                        <Seat
                            key={seat.id}
                            seat={seat}
                            price={getSeatPrice(rowIndex)}
                            onClick={onSeatClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SeatGrid;
