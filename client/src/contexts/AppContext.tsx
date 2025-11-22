import { createContext, useContext, useState, ReactNode } from "react";
import type { User, Resident, Collector, Authority, Language } from "@/types";

interface AppContextType {
  // User state
  user: User | null;
  profile: Resident | Collector | Authority | null;
  login: (user: User, profile: Resident | Collector | Authority) => void;
  logout: () => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Resident | Collector | Authority | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const login = (newUser: User, newProfile: Resident | Collector | Authority) => {
    setUser(newUser);
    setProfile(newProfile);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <AppContext.Provider value={{
      user,
      profile,
      login,
      logout,
      language,
      setLanguage,
      isDarkMode,
      toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
