/* vaishnavi Created on 29/12/2025 {10:30 am} */
import React from "react";
import success from "../assets/images/Success.png";

const SuccessToast = ({ text }) => {
  return (
    <div className="toast border-divider-invert">
      <img src={success} className="toast-icon" />
      <span className="text-primary  text-toast ">{text}</span>
    </div>
  );
};

export default SuccessToast;
