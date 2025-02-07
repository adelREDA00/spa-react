import React from 'react'

function ImageModal({ imageUrl, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content">
      <img src={imageUrl} alt="Full size" />
    </div>
  </div>
  )
}

export default ImageModal