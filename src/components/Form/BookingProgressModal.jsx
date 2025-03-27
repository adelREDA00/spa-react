import React, { useState, useEffect } from 'react';

const BookingProgressModal = ({ isOpen }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0); // Reset progress when closed
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 1; // Increase to 90%
        clearInterval(interval); // Stop at 90%
        return prev;
      });
    }, 67); // ~6 seconds to 90%

    return () => clearInterval(interval); // Cleanup on unmount or when isOpen changes
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="Prog-modal-overlay">
      <div className="Prog-modal-content">
        <div className="Prog-progress-bar-container">
          <div className="Prog-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default BookingProgressModal;