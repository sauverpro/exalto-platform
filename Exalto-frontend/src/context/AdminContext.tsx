import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminContextValue {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

// Demo admin credentials (in production, validate against a backend)
const ADMIN_EMAIL = "admin@exalto.com";
const ADMIN_PASSWORD = "Admin123!";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setAdminEmail(email);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, adminEmail, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
