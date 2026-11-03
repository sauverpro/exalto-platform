import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "fr" | "rw";

const translations = {
  en: {
    home: "Home",
    shop: "Shop",
    about: "About",
    wholesale: "Wholesale",
    export: "Export",
    contact: "Contact",
    search: "Search",
    cart: "Shopping cart",
    wishlist: "Wishlist",
    account: "Account",
    dashboard: "My Dashboard",
    signOut: "Sign Out",
    signIn: "Sign In",
    orderNow: "Order Now",
    adminPortal: "Admin Portal",
    language: "Language",
  },
  fr: {
    home: "Accueil",
    shop: "Boutique",
    about: "À propos",
    wholesale: "Grossiste",
    export: "Exportation",
    contact: "Contact",
    search: "Rechercher",
    cart: "Panier",
    wishlist: "Favoris",
    account: "Compte",
    dashboard: "Mon tableau de bord",
    signOut: "Se déconnecter",
    signIn: "Se connecter",
    orderNow: "Commander",
    adminPortal: "Portail administrateur",
    language: "Langue",
  },
  rw: {
    home: "Ahabanza",
    shop: "Gura",
    about: "Ibyerekeye",
    wholesale: "Gucuruza byinshi",
    export: "Kohereza hanze",
    contact: "Tuvugishe",
    search: "Shakisha",
    cart: "Igarete",
    wishlist: "Ibikunzwe",
    account: "Konti",
    dashboard: "Imbonerahamwe yanjye",
    signOut: "Sohoka",
    signIn: "Injira",
    orderNow: "Tegura ubu",
    adminPortal: "Ubuyobozi",
    language: "Ururimi",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("exalto-language");
    return saved === "fr" || saved === "rw" ? saved : "en";
  });

  const setLanguage = (nextLanguage: Language) =>
    setLanguageState(nextLanguage);

  useEffect(() => {
    localStorage.setItem("exalto-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) =>
        translations[language][key] ?? translations.en[key],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
