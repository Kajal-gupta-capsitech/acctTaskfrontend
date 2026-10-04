import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    let msg = "Operation completed";
    if (typeof message === "string") {
      msg = message;
    } else if (message?.response?.data?.message) {
      msg = message.response.data.message;
    } else if (message?.message) {
      msg = message.message;
    }

    setToast({ message: msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const showSuccess = (msg) => showToast(msg, "success");
  const showError = (msg) => showToast(msg, "error");
  const showInfo = (msg) => showToast(msg, "info");

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showToast }}>
      {children}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 2147483647,
            backgroundColor:
              toast.type === "success"
                ? "#107c10"
                : toast.type === "error"
                ? "#d13438"
                : "#0078d4",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "6px",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "260px",
            maxWidth: "420px",
            wordBreak: "break-word",
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showSuccess: (msg) => console.log("Success Toast:", msg),
      showError: (msg) => console.error("Error Toast:", msg),
      showInfo: (msg) => console.log("Info Toast:", msg),
      showToast: (msg) => console.log("Toast:", msg),
    };
  }
  return context;
};
