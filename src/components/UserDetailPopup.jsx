// UserDetailPopup.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/UserDetailPopup.css";

export default function UserDetailPopup({ clicked, onClose, userDoc }) {
  // Close on Escape key
  // console.log(clicked);
  // console.log(onclose);
  // console.log(userDoc);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        <div className="popup-header">
          <div className="popup-avatar-ring">
            <img
              src={clicked.picture}
              alt={clicked.name}
              className="popup-avatar"
            />
          </div>
          <h2>{clicked.name}</h2>
          <p className="popup-role">Looking for a Gym Partner</p>
        </div>

        <div className="popup-section">
          <span className="popup-highlight">Same Energy, Shared Goals 💪</span>
        </div>

        <div className="popup-section">
          <p>This person is working out nearby and open to partner up!</p>
          <p>
            Check their vibe and make your workouts more consistent and fun.
          </p>
        </div>

        {userDoc !== clicked.id ? (
          <div className="popup-buttons">
            <button className="popup-accept">Send Connect Request</button>
            <button className="popup-cancel" onClick={onClose}>
              Maybe Later
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>,
    document.body
  );
}
