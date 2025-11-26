/**
 * Seat Status Constants
 * Defines the possible states of a seat.
 */
export const SEAT_STATUS = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked'
};

/**
 * Seat Pricing Constants
 * Defines the price for each tier of seats.
 */
export const SEAT_PRICES = {
    PREMIUM: 1000,  // Rows A-C (0-2)
    STANDARD: 750,  // Rows D-F (3-5)
    ECONOMY: 500    // Rows G-H (6-7)
};

/**
 * Application Configuration
 * General configuration settings for the seat grid and booking rules.
 */
export const CONFIG = {
    ROWS: 8,
    SEATS_PER_ROW: 10,
    MAX_SEATS_PER_BOOKING: 8
};
