import React from 'react';
import { motion } from 'framer-motion';
import { SEAT_STATUS } from '../utils/constants';

/**
 * Seat Component
 * 
 * Represents a single seat in the grid.
 * Handles interaction, display status, and accessibility.
 * Uses React.memo to prevent unnecessary re-renders.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.seat - The seat object containing status, row, and index.
 * @param {number} props.price - The price of the seat.
 * @param {Function} props.onClick - Handler for click events.
 * @returns {JSX.Element} The rendered Seat component.
 */
const Seat = React.memo(({ seat, price, onClick }) => {
    /**
     * Determines the seat type (Premium, Standard, Economy) based on the row index.
     * @param {number} row - The row index.
     * @returns {string} The seat type label.
     */
    const getSeatType = (row) => {
        if (row < 3) return 'Premium';
        if (row < 6) return 'Standard';
        return 'Economy';
    };

    /**
     * Generates the content for the tooltip.
     * @returns {string} Tooltip text describing the seat.
     */
    const getTooltipContent = () => {
        const rowLabel = String.fromCharCode(65 + seat.row);
        const seatLabel = seat.seat + 1;
        const type = getSeatType(seat.row);
        
        if (seat.status === SEAT_STATUS.BOOKED) {
            return `Row ${rowLabel} Seat ${seatLabel} - Booked`;
        }
        return `Row ${rowLabel} Seat ${seatLabel} | ${type} | ₹${price}`;
    };

    return (
        <motion.div
            className={`seat ${seat.status}`}
            onClick={() => onClick(seat.row, seat.seat)}
            data-tooltip-id="seat-tooltip"
            data-tooltip-content={getTooltipContent()}
            role="button"
            tabIndex={seat.status === SEAT_STATUS.BOOKED ? -1 : 0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick(seat.row, seat.seat);
                }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {seat.seat + 1}
        </motion.div>
    );
});

export default Seat;
