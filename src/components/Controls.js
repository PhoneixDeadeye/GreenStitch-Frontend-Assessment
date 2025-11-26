import React from 'react';

/**
 * Controls Component
 * 
 * Renders the action buttons for the booking system.
 * Handles the "Book", "Clear", and "Reset" actions.
 * Includes a local confirmation modal for the booking action.
 * 
 * @param {Object} props - Component props.
 * @param {Function} props.onBook - Handler for the book action.
 * @param {Function} props.onClear - Handler for clearing the selection.
 * @param {Function} props.onReset - Handler for resetting the system.
 * @param {number} props.selectedCount - The number of currently selected seats.
 * @returns {JSX.Element} The rendered Controls component.
 */
const Controls = ({ onBook, onClear, onReset, selectedCount }) => {
    const [showConfirm, setShowConfirm] = React.useState(false);

    /**
     * Handles the click on the "Book" button.
     * Shows a confirmation modal if seats are selected, otherwise triggers the onBook handler (which likely shows an error).
     */
    const handleBookClick = () => {
        if (selectedCount > 0) {
            setShowConfirm(true);
        } else {
            onBook(); // Will trigger the toast warning
        }
    };

    /**
     * Confirms the booking and closes the local modal.
     */
    const confirmBooking = () => {
        onBook();
        setShowConfirm(false);
    };

    return (
        <div className="control-panel">
            <button
                className="btn btn-book"
                onClick={handleBookClick}
            >
                Book Selected Seats ({selectedCount})
            </button>
            <button
                className="btn btn-clear"
                onClick={onClear}
                disabled={selectedCount === 0}
            >
                Clear Selection
            </button>
            <button
                className="btn btn-reset"
                onClick={onReset}
            >
                Reset All
            </button>

            {/* Local Confirmation Modal for Booking */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Booking</h3>
                        <p>Are you sure you want to book {selectedCount} seats?</p>
                        <div className="modal-actions">
                            <button className="btn btn-book" onClick={confirmBooking}>Confirm</button>
                            <button className="btn btn-clear" onClick={() => setShowConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Controls;
