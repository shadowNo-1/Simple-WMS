"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Import translations
import translations from "./translations"

// Define language settings
export const LANGUAGES = {
  zh: "中文",
  en: "English",
}

export const DEFAULT_LANGUAGE = "zh"

// Language Context
type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
}

export const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
})

// Language Provider Component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedLanguage = localStorage.getItem("language")
    if (storedLanguage && Object.keys(LANGUAGES).includes(storedLanguage)) {
      setLanguageState(storedLanguage)
      document.documentElement.lang = storedLanguage
    }
  }, [])

  const setLanguage = (lang: string) => {
    if (Object.keys(LANGUAGES).includes(lang)) {
      setLanguageState(lang)
      localStorage.setItem("language", lang)
      document.documentElement.lang = lang
    }
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

// Hooks
export const useLanguage = () => useContext(LanguageContext)

export const useTranslation = () => {
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const t = (key: string, params?: Record<string, string>) => {
    if (!mounted) return key

    const translation = translations[language]?.[key] || translations.zh[key] || key

    if (params) {
      return Object.entries(params).reduce((acc, [param, value]) => acc.replace(`{{${param}}}`, value), translation)
    }

    return translation
  }

  return { t, language }
}

