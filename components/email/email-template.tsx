import type React from "react"
import { Logo } from "@/components/logo"

interface EmailTemplateProps {
  userName: string
  subject: string
  previewText?: string
  buttonText?: string
  buttonLink?: string
  language?: "es-MX" | "en-US"
  children: React.ReactNode
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  userName,
  subject,
  previewText,
  buttonText,
  buttonLink,
  language = "es-MX",
  children,
}) => {
  const translations = {
    "es-MX": {
      greeting: "Hola",
      footer: "Si tienes alguna pregunta, simplemente responde a este correo electrónico. Estamos aquí para ayudarte.",
      copyright: "Todos los derechos reservados.",
      unsubscribe: "Cancelar suscripción",
      preferences: "Preferencias de correo",
    },
    "en-US": {
      greeting: "Hello",
      footer: "If you have any questions, simply reply to this email. We're here to help.",
      copyright: "All rights reserved.",
      unsubscribe: "Unsubscribe",
      preferences: "Email preferences",
    },
  }

  const t = translations[language]

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "24px",
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Logo showText size="lg" />
      </div>

      {/* Content */}
      <div style={{ color: "#333333" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#4F46E5",
          }}
        >
          {subject}
        </h1>

        <p style={{ fontSize: "16px", marginBottom: "24px" }}>
          {t.greeting} {userName},
        </p>

        <div style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "24px" }}>{children}</div>

        {buttonText && buttonLink && (
          <div style={{ textAlign: "center", margin: "32px 0" }}>
            <a
              href={buttonLink}
              style={{
                backgroundColor: "#4F46E5",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          borderTop: "1px solid #e2e8f0",
          color: "#718096",
          fontSize: "14px",
        }}
      >
        <p style={{ marginBottom: "16px" }}>{t.footer}</p>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ margin: "8px 0" }}>
            &copy; {new Date().getFullYear()} HABY. {t.copyright}
          </p>
          <p style={{ margin: "8px 0" }}>
            <a href="#" style={{ color: "#4F46E5", marginRight: "16px", textDecoration: "none" }}>
              {t.unsubscribe}
            </a>
            <a href="#" style={{ color: "#4F46E5", textDecoration: "none" }}>
              {t.preferences}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Example of a verification email template
export const VerificationEmailTemplate: React.FC<{
  userName: string
  verificationLink: string
  language?: "es-MX" | "en-US"
}> = ({ userName, verificationLink, language = "es-MX" }) => {
  const translations = {
    "es-MX": {
      subject: "Verifica tu dirección de correo electrónico",
      content1:
        "Gracias por registrarte en HABY. Para completar tu registro, necesitamos verificar tu dirección de correo electrónico.",
      content2: "Por favor, haz clic en el botón de abajo para verificar tu cuenta:",
      buttonText: "Verificar mi correo electrónico",
      content3: "Si no solicitaste esta verificación, puedes ignorar este correo electrónico.",
    },
    "en-US": {
      subject: "Verify your email address",
      content1:
        "Thank you for signing up with HABY. To complete your registration, we need to verify your email address.",
      content2: "Please click the button below to verify your account:",
      buttonText: "Verify my email",
      content3: "If you didn't request this verification, you can ignore this email.",
    },
  }

  const t = translations[language]

  return (
    <EmailTemplate
      userName={userName}
      subject={t.subject}
      buttonText={t.buttonText}
      buttonLink={verificationLink}
      language={language}
    >
      <p>{t.content1}</p>
      <p>{t.content2}</p>
      <p style={{ marginTop: "24px", fontSize: "14px", color: "#718096" }}>{t.content3}</p>
    </EmailTemplate>
  )
}

// Example of a password reset email template
export const PasswordResetEmailTemplate: React.FC<{
  userName: string
  resetLink: string
  language?: "es-MX" | "en-US"
}> = ({ userName, resetLink, language = "es-MX" }) => {
  const translations = {
    "es-MX": {
      subject: "Restablece tu contraseña",
      content1: "Hemos recibido una solicitud para restablecer la contraseña de tu cuenta HABY.",
      content2: "Haz clic en el botón de abajo para crear una nueva contraseña:",
      buttonText: "Restablecer mi contraseña",
      content3:
        "Si no solicitaste este restablecimiento, puedes ignorar este correo electrónico. Tu contraseña permanecerá sin cambios.",
    },
    "en-US": {
      subject: "Reset your password",
      content1: "We received a request to reset the password for your HABY account.",
      content2: "Click the button below to create a new password:",
      buttonText: "Reset my password",
      content3: "If you didn't request this reset, you can ignore this email. Your password will remain unchanged.",
    },
  }

  const t = translations[language]

  return (
    <EmailTemplate
      userName={userName}
      subject={t.subject}
      buttonText={t.buttonText}
      buttonLink={resetLink}
      language={language}
    >
      <p>{t.content1}</p>
      <p>{t.content2}</p>
      <p style={{ marginTop: "24px", fontSize: "14px", color: "#718096" }}>{t.content3}</p>
    </EmailTemplate>
  )
}
