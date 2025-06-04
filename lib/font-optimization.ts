// Optimización de carga de fuentes
export const fontOptimizationScript = `
  // Detectar soporte para Font Loading API
  if ('fonts' in document) {
    // Precargar fuentes críticas
    Promise.all([
      document.fonts.load('1em Inter'),
      document.fonts.load('600 1em Inter'),
      document.fonts.load('700 1em Inter')
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  } else {
    // Fallback para navegadores sin soporte
    document.documentElement.classList.add('fonts-loaded');
  }
`

// Estilos para evitar FOUT (Flash of Unstyled Text)
export const fontOptimizationStyle = `
  /* Ocultar texto hasta que las fuentes estén cargadas */
  html:not(.fonts-loaded) body {
    opacity: 0.98;
  }
  
  /* Mostrar texto una vez que las fuentes estén cargadas */
  html.fonts-loaded body {
    opacity: 1;
    transition: opacity 0.1s ease-in-out;
  }
`
