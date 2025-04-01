"use client"

import { useContext } from "react"
import { LanguageContext } from "@/lib/i18n"
import translations from "./translations"

export const useTranslation = () => {
  const { language } = useContext(LanguageContext)

  const t = (key: string, params?: Record<string, string>) => {
    let translation = translations[language]?.[key] || translations.zh[key] || key

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        const regex = new RegExp(`{{${param}}}`, "g")
        translation = translation.replace(regex, value)
      })
    }

    return translation
  }

  return { t, language }
}

