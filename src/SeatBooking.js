import React, { useState } from 'react';
import './SeatBooking.css';

const SEAT_STATUS = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked'
};

const SEAT_PRICES = {
    PREMIUM: 1000,  // Rows A-C (0-2)
    STANDARD: 750,  // Rows D-F (3-5)
    ECONOMY: 500    // Rows G-H (6-7)
};

const MAX_SEATS_PER_BOOKING = 8;

const SeatBooking = () => {
    const ROWS = 8;
    const SEATS_PER_ROW = 10;

    const initializeSeats = () => {
        const savedSeats = localStorage.getItem('seatBookingData');
        if (savedSeats) {
            return JSON.parse(savedSeats);
        }
        const seats = [];
        for (let row = 0; row < ROWS; row++) {
            const rowSeats = [];
            for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
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

    const [seats, setSeats] = useState(initializeSeats());

    // TODO: Implement all required functionality below

    const getSeatPrice = (row) => {
        if (row < 3) return SEAT_PRICES.PREMIUM;
        if (row < 6) return SEAT_PRICES.STANDARD;
        return SEAT_PRICES.ECONOMY;
    };
    
    const getSelectedCount = () => {
        return seats.reduce((acc, row) => 
            acc + row.filter(seat => seat.status === SEAT_STATUS.SELECTED).length, 0);
    };

    const getBookedCount = () => {
        return seats.reduce((acc, row) => 
            acc + row.filter(seat => seat.status === SEAT_STATUS.BOOKED).length, 0);
    };

    const getAvailableCount = () => {
        return seats.reduce((acc, row) => 
            acc + row.filter(seat => seat.status === SEAT_STATUS.AVAILABLE).length, 0);
    };

    const calculateTotalPrice = () => {
        return seats.reduce((acc, row, rowIndex) => {
            const selectedInRow = row.filter(seat => seat.status === SEAT_STATUS.SELECTED).length;
            return acc + (selectedInRow * getSeatPrice(rowIndex));
        }, 0);
    };

    const validateGapRule = () => {
        for (let row of seats) {
            for (let i = 0; i < row.length - 2; i++) {
                const left = row[i];
                const middle = row[i+1];
                const right = row[i+2];
                
                // Check for pattern: [Selected/Booked] [Available] [Selected/Booked]
                const isLeftOccupied = left.status === SEAT_STATUS.SELECTED || left.status === SEAT_STATUS.BOOKED;
                const isRightOccupied = right.status === SEAT_STATUS.SELECTED || right.status === SEAT_STATUS.BOOKED;
                const isMiddleAvailable = middle.status === SEAT_STATUS.AVAILABLE;

                if (isLeftOccupied && isRightOccupied && isMiddleAvailable) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleSeatClick = (rowIndex, seatIndex) => {
        const currentSeat = seats[rowIndex][seatIndex];
        
        if (currentSeat.status === SEAT_STATUS.BOOKED) return;

        if (currentSeat.status === SEAT_STATUS.AVAILABLE) {
            if (getSelectedCount() >= MAX_SEATS_PER_BOOKING) {
                alert(`You can only select up to ${MAX_SEATS_PER_BOOKING} seats`);
                return;
            }
        }

        const newSeats = seats.map((row, rIndex) => {
            if (rIndex !== rowIndex) return row;
            return row.map((seat, sIndex) => {
                if (sIndex !== seatIndex) return seat;
                return {
                    ...seat,
                    status: seat.status === SEAT_STATUS.AVAILABLE 
                        ? SEAT_STATUS.SELECTED 
                        : SEAT_STATUS.AVAILABLE
                };
            });
        });

        setSeats(newSeats);
    };

    const handleBookSeats = () => {
        if (!validateGapRule()) {
            alert("Invalid selection! You cannot leave a single empty seat between selected/booked seats.");
            return;
        }

        const selectedCount = getSelectedCount();
        const totalPrice = calculateTotalPrice();

        if (window.confirm(`Confirm booking for ${selectedCount} seats? Total Price: ₹${totalPrice}`)) {
            const newSeats = seats.map(row => 
                row.map(seat => ({
                    ...seat,
                    status: seat.status === SEAT_STATUS.SELECTED ? SEAT_STATUS.BOOKED : seat.status
                }))
            );
            setSeats(newSeats);
            localStorage.setItem('seatBookingData', JSON.stringify(newSeats));
            alert('Booking Confirmed!');
        }
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
        if(window.confirm("Are you sure you want to reset the entire system? All bookings will be lost.")) {
            localStorage.removeItem('seatBookingData');
            const resetSeats = [];
            for (let row = 0; row < ROWS; row++) {
                const rowSeats = [];
                for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
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
        }
    };

    return (
        <div className="seat-booking-container">
            <h1>GreenStitch Seat Booking System</h1>

            <div className="info-panel">
                <div className="info-item">
                    <span className="info-label">Available:</span>
                    <span className="info-value">{getAvailableCount()}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Selected:</span>
                    <span className="info-value">{getSelectedCount()}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Booked:</span>
                    <span className="info-value">{getBookedCount()}</span>
                </div>
            </div>

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

            <div className="seat-grid">
                {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="seat-row">
                        <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
                        {row.map((seat, seatIndex) => (
                            <div
                                key={seat.id}
                                className={`seat ${seat.status}`}
                                onClick={() => handleSeatClick(rowIndex, seatIndex)}
                            >
                                {seatIndex + 1}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="pricing-info">
                <p>Selected Seats Total: <strong>₹{calculateTotalPrice()}</strong></p>
                <p className="price-note">Premium (A-C): ₹1000 | Standard (D-F): ₹750 | Economy (G-H): ₹500</p>
            </div>

            <div className="control-panel">
                <button
                    className="btn btn-book"
                    onClick={handleBookSeats}
                    disabled={getSelectedCount() === 0}
                >
                    Book Selected Seats ({getSelectedCount()})
                </button>
                <button
                    className="btn btn-clear"
                    onClick={handleClearSelection}
                    disabled={getSelectedCount() === 0}
                >
                    Clear Selection
                </button>
                <button
                    className="btn btn-reset"
                    onClick={handleReset}
                >
                    Reset All
                </button>
            </div>
        </div>
    );
};

export default SeatBooking;
