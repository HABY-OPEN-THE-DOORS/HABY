"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BookOpen } from "lucide-react"

interface JoinClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoinClass?: (classCode: string) => boolean
}

export function JoinClassDialog({ open, onOpenChange, onJoinClass }: JoinClassDialogProps) {
  const { toast } = useToast()
  const [isJoining, setIsJoining] = useState(false)

  // Definir el esquema de validación
  const formSchema = z.object({
    classCode: z.string().min(1, "El código de clase es obligatorio").length(6, "El código debe tener 6 caracteres"),
  })

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classCode: "",
    },
  })

  // Manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsJoining(true)
    try {
      let success = false

      if (onJoinClass) {
        success = onJoinClass(values.classCode)
      }

      if (success) {
        toast({
          title: "Inscripción exitosa",
          description: "Te has unido a la clase correctamente.",
        })
        onOpenChange(false)
        form.reset()
      } else {
        toast({
          title: "Código inválido",
          description: "No se encontró ninguna clase con ese código.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al unirse a la clase:", error)
      toast({
        title: "Error",
        description: "No se pudo unir a la clase. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Unirse a una clase</DialogTitle>
          <DialogDescription>
            Ingresa el código de clase proporcionado por tu profesor para unirte a una clase.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center my-4">
          <div className="rounded-full bg-primary/10 p-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="classCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de clase</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. ABC123"
                      {...field}
                      value={field.value.toUpperCase()}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="text-center text-lg tracking-widest font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-sm text-muted-foreground text-center">
              Pregunta a tu profesor por el código de clase. Es una combinación de 6 letras y números.
            </p>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isJoining}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isJoining} loadingText="Uniéndose...">
                Unirse
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
