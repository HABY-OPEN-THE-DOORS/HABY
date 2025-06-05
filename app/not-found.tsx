export default function NotFound() {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1>404 - Página no encontrada</h1>
          <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
            Volver al inicio
          </a>
        </div>
      </body>
    </html>
  )
}
