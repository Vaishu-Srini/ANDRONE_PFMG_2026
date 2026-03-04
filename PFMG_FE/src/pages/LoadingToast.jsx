/* vaishnavi Created on 29/12/2025 {10:30 am} */
import React from "react";

const LoadingToast = ({ text }) => {
  return (
    <div className="toast border-divider-invert">
      {/* Tailwind Animated Spinner */}
      <div className=" toast-icon toast-spinner"></div>

      <span className="text-primary text-toast ">{text}</span>
    </div>
  );
};

export default LoadingToast;
