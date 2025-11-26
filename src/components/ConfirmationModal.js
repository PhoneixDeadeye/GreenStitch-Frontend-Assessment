import React from 'react';

/**
 * ConfirmationModal Component
 * 
 * A reusable modal component for confirming actions.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is currently open.
 * @param {Function} props.onClose - Handler to close the modal.
 * @param {Function} props.onConfirm - Handler to confirm the action.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.message - The message body of the modal.
 * @returns {JSX.Element|null} The rendered modal or null if not open.
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn btn-reset" onClick={onConfirm}>Yes, Reset</button>
                    <button className="btn btn-clear" onClick={onClose} style={{ background: '#7f8c8d' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;