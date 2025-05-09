"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CustomCaptchaProps {
  onValidate: (isValid: boolean) => void
}

type OperationType = "suma" | "resta" | "multiplicacion"

export function CustomCaptcha({ onValidate }: CustomCaptchaProps) {
  const [firstNumber, setFirstNumber] = useState(0)
  const [secondNumber, setSecondNumber] = useState(0)
  const [operation, setOperation] = useState<OperationType>("suma")
  const [answer, setAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [attempts, setAttempts] = useState(0)

  const generateProblem = () => {
    // Generar números aleatorios según la operación
    let num1 = 0
    let num2 = 0
    const randomOp = Math.floor(Math.random() * 3)

    switch (randomOp) {
      case 0: // Suma
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        setOperation("suma")
        break
      case 1: // Resta
        num1 = Math.floor(Math.random() * 20) + 10
        num2 = Math.floor(Math.random() * num1) + 1
        setOperation("resta")
        break
      case 2: // Multiplicación
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        setOperation("multiplicacion")
        break
    }

    setFirstNumber(num1)
    setSecondNumber(num2)
    setAnswer("")
    setIsCorrect(null)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  const checkAnswer = () => {
    let correctAnswer = 0

    switch (operation) {
      case "suma":
        correctAnswer = firstNumber + secondNumber
        break
      case "resta":
        correctAnswer = firstNumber - secondNumber
        break
      case "multiplicacion":
        correctAnswer = firstNumber * secondNumber
        break
    }

    const userAnswer = Number.parseInt(answer, 10)
    const result = userAnswer === correctAnswer

    setIsCorrect(result)
    onValidate(result)

    if (!result) {
      setAttempts(attempts + 1)
      // Si hay demasiados intentos fallidos, generar un nuevo problema
      if (attempts >= 2) {
        setTimeout(() => {
          generateProblem()
          setAttempts(0)
        }, 1500)
      }
    }
  }

  const getOperationSymbol = () => {
    switch (operation) {
      case "suma":
        return "+"
      case "resta":
        return "-"
      case "multiplicacion":
        return "×"
    }
  }

  const getOperationText = () => {
    switch (operation) {
      case "suma":
        return "suma"
      case "resta":
        return "resta"
      case "multiplicacion":
        return "multiplicación"
    }
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Verificación de seguridad</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateProblem}
          className="h-8 w-8 p-0"
          aria-label="Generar nuevo problema"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Por favor, resuelve esta operación de {getOperationText()}:</p>

        <div className="flex items-center justify-center p-3 bg-purple-50 rounded-md mb-3">
          <motion.span
            key={`${firstNumber}-${operation}-${secondNumber}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl font-bold text-purple-700"
          >
            {firstNumber} {getOperationSymbol()} {secondNumber} = ?
          </motion.span>
        </div>

        <div className="flex space-x-2">
          <Input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tu respuesta"
            className="flex-1"
            aria-label="Tu respuesta al problema matemático"
          />
          <Button onClick={checkAnswer} disabled={!answer} className="bg-purple-600 hover:bg-purple-700 text-white">
            Verificar
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-2 rounded-md text-sm ${
              isCorrect
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {isCorrect ? "¡Correcto! Verificación completada." : "Respuesta incorrecta. Por favor, intenta de nuevo."}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
