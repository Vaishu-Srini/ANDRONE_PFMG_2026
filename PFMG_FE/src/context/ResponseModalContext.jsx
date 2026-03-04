import { createContext, useContext, useState } from "react";
import ResponseModal from "../pages/responseModal";

const ResponseModalContext = createContext(null);

export function ResponseModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const open = ({ type = "info", title, message, onConfirm }) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const close = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ResponseModalContext.Provider value={{ open, close }}>
      {children}

      <ResponseModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={close} // Cancel
        onConfirm={() => {
          close();
          modal.onConfirm?.();
        }}
      />
    </ResponseModalContext.Provider>
  );
}

/**
 * Hook to use response modal
 */
export function useResponseModal() {
  const ctx = useContext(ResponseModalContext);
  if (!ctx) {
    throw new Error(
      "useResponseModal must be used inside ResponseModalProvider"
    );
  }
  return ctx;
}
