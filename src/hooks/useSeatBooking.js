import { useState, useMemo, useCallback } from 'react';
import { SEAT_STATUS, SEAT_PRICES, CONFIG } from '../utils/constants';
import { toast } from 'react-toastify';

/**
 * Custom hook to manage seat booking logic.
 * Handles seat initialization, selection, booking, pricing, and validation rules.
 * 
 * @returns {Object} An object containing state and handler functions for the seat booking system.
 */
export const useSeatBooking = () => {
    /**
     * Initializes the seats state.
     * Tries to load from localStorage first, otherwise creates a new grid based on CONFIG.
     */
    const initializeSeats = () => {
        const savedSeats = localStorage.getItem('seatBookingData');
        if (savedSeats) {
            return JSON.parse(savedSeats);
        }
        const seats = [];
        for (let row = 0; row < CONFIG.ROWS; row++) {
            const rowSeats = [];
            for (let seat = 0; seat < CONFIG.SEATS_PER_ROW; seat++) {
                rowSeats.push({
                    id: `${row}-${seat}`,
                    row: row,
                    seat: seat,
                    status: SEAT_STATUS.AVAILABLE
                });
            }
            seats.push(rowSeats);
        }
        return seats;
    };

    const [seats, setSeats] = useState(initializeSeats);

    // --- Derived State (Memoized) ---

    /**
     * List of currently selected seats.
     */
    const selectedSeats = useMemo(() => {
        const selected = [];
        seats.forEach(row => {
            row.forEach(seat => {
                if (seat.status === SEAT_STATUS.SELECTED) {
                    selected.push(seat);
                }
            });
        });
        return selected;
    }, [seats]);

    const selectedCount = selectedSeats.length;

    /**
     * Count of currently booked seats.
     */
    const bookedCount = useMemo(() => {
        return seats.reduce((acc, row) => 
            acc + row.filter(seat => seat.status === SEAT_STATUS.BOOKED).length, 0);
    }, [seats]);

    /**
     * Count of available seats.
     */
    const availableCount = useMemo(() => {
        return seats.reduce((acc, row) => 
            acc + row.filter(seat => seat.status === SEAT_STATUS.AVAILABLE).length, 0);
    }, [seats]);

    /**
     * Calculates the price of a seat based on its row index.
     * @param {number} row - The row index.
     * @returns {number} The price of the seat.
     */
    const getSeatPrice = useCallback((row) => {
        if (row < 3) return SEAT_PRICES.PREMIUM;
        if (row < 6) return SEAT_PRICES.STANDARD;
        return SEAT_PRICES.ECONOMY;
    }, []);

    /**
     * Total price of all selected seats.
     */
    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat.row), 0);
    }, [selectedSeats, getSeatPrice]);

    // --- Validation Logic ---

    /**
     * Validates the "Gap Rule" for a specific row.
     * Ensures that no single empty seat is left between booked/selected seats.
     * 
     * @param {Array} rowSeats - Array of seat objects for a specific row.
     * @returns {boolean} True if the rule is satisfied, False otherwise.
     */
    const validateGapRule = (rowSeats) => {
        // Find all occupied seats (Selected or Booked) in this row
        const occupiedIndices = rowSeats
            .map((seat, index) => (seat.status === SEAT_STATUS.SELECTED || seat.status === SEAT_STATUS.BOOKED) ? index : -1)
            .filter(index => index !== -1);

        // If less than 2 occupied seats, no gaps to check between them
        if (occupiedIndices.length < 2) return true;

        // Check for gaps between occupied seats
        for (let i = 0; i < occupiedIndices.length - 1; i++) {
            const current = occupiedIndices[i];
            const next = occupiedIndices[i + 1];

            // If the difference is greater than 1, there is at least one seat in between.
            // Since we collected ALL occupied seats, the seats in between MUST be Available.
            if (next - current > 1) {
                // We found a gap. Now we need to check if this gap involves a SELECTED seat.
                // If the gap is purely between BOOKED seats (e.g. Booked [Available] Booked), it might be allowed by legacy data.
                // But the rule says "Seat selection must not create a pattern".
                // So we strictly enforce: No available gaps between ANY occupied seats in the modified row.
                return false;
            }
        }
        return true;
    };

    /**
     * Handles the click event on a seat.
     * Toggles selection state and validates constraints (Max seats, Gap rule).
     * 
     * @param {number} rowIndex - The row index of the clicked seat.
     * @param {number} seatIndex - The column index of the clicked seat.
     */
    const handleSeatClick = useCallback((rowIndex, seatIndex) => {
        const currentSeat = seats[rowIndex][seatIndex];
        
        if (currentSeat.status === SEAT_STATUS.BOOKED) return;

        // Check Max Limit
        if (currentSeat.status === SEAT_STATUS.AVAILABLE) {
            if (selectedCount >= CONFIG.MAX_SEATS_PER_BOOKING) {
                toast.error(`You can only select up to ${CONFIG.MAX_SEATS_PER_BOOKING} seats`);
                return;
            }
        }

        // Create a copy of the specific row to validate
        const newRow = seats[rowIndex].map((seat, sIndex) => {
            if (sIndex !== seatIndex) return seat;
            return {
                ...seat,
                status: seat.status === SEAT_STATUS.AVAILABLE 
                    ? SEAT_STATUS.SELECTED 
                    : SEAT_STATUS.AVAILABLE
            };
        });

        // Validate only the modified row
        if (!validateGapRule(newRow)) {
            toast.warning(`Invalid selection! You cannot leave a single empty seat between selected/booked seats.`);
            return;
        }

        // Update state
        setSeats(prevSeats => prevSeats.map((row, rIndex) => 
            rIndex === rowIndex ? newRow : row
        ));

    }, [seats, selectedCount]);

    const handleBookSeats = () => {
        if (selectedCount === 0) {
            toast.info("Please select at least one seat to book.");
            return;
        }

        const newSeats = seats.map(row => 
            row.map(seat => ({
                ...seat,
                status: seat.status === SEAT_STATUS.SELECTED ? SEAT_STATUS.BOOKED : seat.status
            }))
        );
        setSeats(newSeats);
        localStorage.setItem('seatBookingData', JSON.stringify(newSeats));
        toast.success('Booking Confirmed!');
    };

    const handleClearSelection = () => {
        const newSeats = seats.map(row => 
            row.map(seat => ({
                ...seat,
                status: seat.status === SEAT_STATUS.SELECTED ? SEAT_STATUS.AVAILABLE : seat.status
            }))
        );
        setSeats(newSeats);
    };

    const handleReset = () => {
        localStorage.removeItem('seatBookingData');
        const resetSeats = [];
        for (let row = 0; row < CONFIG.ROWS; row++) {
            const rowSeats = [];
            for (let seat = 0; seat < CONFIG.SEATS_PER_ROW; seat++) {
                rowSeats.push({
                    id: `${row}-${seat}`,
                    row: row,
                    seat: seat,
                    status: SEAT_STATUS.AVAILABLE
                });
            }
            resetSeats.push(rowSeats);
        }
        setSeats(resetSeats);
        toast.info("System reset successfully.");
    };

    return {
        seats,
        selectedSeats,
        selectedCount,
        bookedCount,
        availableCount,
        totalPrice,
        handleSeatClick,
        handleBookSeats,
        handleClearSelection,
        handleReset,
        getSeatPrice
    };
};
