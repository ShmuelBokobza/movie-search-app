import { useCallback, useEffect, useState } from "react";

interface AuthHook {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const useAuth = (): AuthHook => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        setIsAuthenticated(!!event.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = useCallback((token: string): void => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("favorites");
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
};

export default useAuth;
