import { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminModeCtx {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

const Ctx = createContext<AdminModeCtx>({ isAdmin: false, login: () => {}, logout: () => {} });

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('vd_admin_auth') === '1');

  const login = () => {
    sessionStorage.setItem('vd_admin_auth', '1');
    setIsAdmin(true);
  };

  const logout = () => {
    sessionStorage.removeItem('vd_admin_auth');
    setIsAdmin(false);
  };

  return <Ctx.Provider value={{ isAdmin, login, logout }}>{children}</Ctx.Provider>;
}

export function useAdminMode() { return useContext(Ctx); }