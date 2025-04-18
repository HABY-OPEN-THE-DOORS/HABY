"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

/**
 * Componente CustomCaptcha - Implementa un captcha matemático simple
 * @param onValidate - Función callback que se llama cuando el captcha es validado
 * @returns Componente React con el captcha
 */
interface CustomCaptchaProps {
  onValidate: (isValid: boolean) => void
}

export function CustomCaptcha({ onValidate }: CustomCaptchaProps) {
  const [captchaQuestion, setCaptchaQuestion] = useState("")
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const { t } = useLanguage()

  // Genera un problema matemático aleatorio
  const generateCaptcha = () => {
    const operations = ["+", "-", "×"]
    const operation = operations[Math.floor(Math.random() * operations.length)]

    let num1, num2, answer

    if (operation === "+") {
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      answer = num1 + num2
    } else if (operation === "-") {
      num1 = Math.floor(Math.random() * 10) + 5
      num2 = Math.floor(Math.random() * 5) + 1
      answer = num1 - num2
    } else {
      // "×"
      num1 = Math.floor(Math.random() * 5) + 1
      num2 = Math.floor(Math.random() * 5) + 1
      answer = num1 * num2
    }

    setCaptchaQuestion(`${num1} ${operation} ${num2} = ?`)
    setCaptchaAnswer(answer.toString())
    setUserAnswer("")
    setIsValid(null)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserAnswer(value)

    if (value) {
      const valid = value === captchaAnswer
      setIsValid(valid)
      onValidate(valid)
    } else {
      setIsValid(null)
      onValidate(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="captcha" className="text-sm font-medium">
          {t("captcha.title")}
        </Label>
        <Button variant="ghost" size="sm" onClick={generateCaptcha} type="button" className="h-8 px-3 text-xs">
          <RefreshCw className="h-3 w-3 mr-1" />
          {t("captcha.refresh")}
        </Button>
      </div>

      <div
        className={cn(
          "flex items-center p-3 border rounded-md bg-muted/20",
          isValid === true ? "border-green-500" : isValid === false ? "border-red-500" : "border-input",
        )}
      >
        <div className="flex-1 flex items-center justify-between">
          <div className="font-mono text-base font-medium">{captchaQuestion}</div>
          <div className="relative">
            <Input
              id="captcha"
              value={userAnswer}
              onChange={handleInputChange}
              className={cn(
                "w-16 text-center text-base font-medium h-9",
                isValid === true
                  ? "border-green-500 focus-visible:ring-green-500"
                  : isValid === false
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "",
              )}
              placeholder="?"
              maxLength={3}
              aria-invalid={isValid === false}
              aria-describedby={isValid === false ? "captcha-error" : undefined}
            />
            {isValid !== null && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {isValid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isValid === false && (
        <p id="captcha-error" className="text-xs text-red-500 mt-1 flex items-center">
          <XCircle className="h-3 w-3 mr-1" />
          {t("captcha.incorrect")}
        </p>
      )}
    </div>
  )
}
