import React from "react";
import { createPortal } from "react-dom";

const ResponseModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "Ok",
}) => {
  // If not open, don't render anything
  if (!isOpen) return null;

  const themes = {
    success: {
      icon: "✓",
      color: "bg-emerald-600",
      text: "text-emerald-500",
      glow: "bg-emerald-500/10",
    },
    error: {
      icon: "✕",
      color: "bg-red-500",
      text: "text-red-500",
      glow: "bg-red-500/10",
    },
    delete: {
      icon: "🗑",
      color: "bg-[#EF2323]",
      text: "text-[#EF2323]",
      glow: "bg-[#EF2323]/10",
    },
    info: {
      icon: "i",
      color: "bg-indigo-500",
      text: "text-indigo-400",
      glow: "bg-indigo-500/10",
    },
  };

  const theme = themes[type] || themes.info;

  // Use createPortal to inject this at the bottom of the body
  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal Card */}
      <div
        className="w-full max-w-[420px] bg-[#2D2F33] rounded-[32px] p-10 shadow-2xl flex flex-col items-center text-center border border-white/5 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* Dynamic Icon with Glow */}
        <div
          className={`w-16 h-16 ${theme.glow} rounded-full flex items-center justify-center mb-8 relative`}
        >
          <span className={`text-2xl font-bold ${theme.text}`}>
            {theme.icon}
          </span>
          <div
            className={`absolute inset-0 rounded-full animate-pulse ${theme.glow}`}
          ></div>
        </div>

        {/* Text Content */}
        <h2 className="text-white text-3xl font-medium tracking-tight mb-4">
          {title}
        </h2>
        <p className="text-[#9CA3AF] text-[16px] leading-relaxed mb-10 px-4">
          {message}
        </p>

        {/* Action Buttons */}
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`w-full py-4 rounded-xl text-white text-lg font-semibold transition-all active:scale-[0.98] hover:opacity-90 ${theme.color}`}
          >
            {confirmText}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-full py-4 rounded-xl bg-transparent border border-[#4B5563] text-[#D1D5DB] text-lg font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ResponseModal;
