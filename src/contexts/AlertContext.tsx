"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface AlertContextProps {
  alertTitle: string;
  alertDescription: string;
  alertVisible: boolean;
  alertColor: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showAlert: (title: string, description: string, color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger') => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertColor, setAlertColor] = useState<'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('default');

  const showAlert = (title: string, description: string, color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger') => {
    setAlertTitle(title);
    setAlertDescription(description);
    setAlertColor(color);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  return (
    <AlertContext.Provider value={{ alertTitle, alertDescription, alertVisible, alertColor, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};