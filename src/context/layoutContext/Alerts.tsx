"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert"; 

// Kiểu dữ liệu cho context
type ShowNotificationFn = (message: string, severity?: AlertColor) => void;

// Tạo context có kiểu dữ liệu rõ ràng
const NotificationContext = createContext<ShowNotificationFn | undefined>(
  undefined
);

// Props cho NotificationProvider
interface NotificationProviderProps {
  children: ReactNode;
}

// Kiểu cho state notification
interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showNotification: ShowNotificationFn = (message, severity = "info") => {
    setNotification({ open: true, message, severity });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Hook để sử dụng context
export const useNotification = (): ShowNotificationFn => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
