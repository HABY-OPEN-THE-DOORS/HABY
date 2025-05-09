/**
 * HABY-CLASS - Sistema de roles y permisos
 * Copyright (c) 2023-2025 HABY - Heber Zadkiel Garcia Perez
 * Todos los derechos reservados
 */

export type UserRole = "student" | "teacher" | "admin"

export interface Permission {
  id: string
  description: string
  category: "class" | "content" | "user" | "system" | "communication"
}

// Definición de permisos por rol
const studentPermissions: Permission[] = [
  { id: "view_class", description: "Ver clases en las que está inscrito", category: "class" },
  { id: "view_assignments", description: "Ver tareas asignadas", category: "class" },
  { id: "submit_assignments", description: "Entregar tareas", category: "class" },
  { id: "view_grades", description: "Ver sus calificaciones", category: "class" },
  { id: "comment_announcements", description: "Comentar en anuncios", category: "communication" },
  { id: "view_materials", description: "Acceder a materiales de clase", category: "content" },
  { id: "download_materials", description: "Descargar materiales de clase", category: "content" },
  { id: "join_class", description: "Unirse a una clase con código", category: "class" },
  { id: "leave_class", description: "Abandonar una clase", category: "class" },
  { id: "view_calendar", description: "Ver calendario de eventos", category: "class" },
  { id: "update_profile", description: "Actualizar su perfil", category: "user" },
  { id: "message_teachers", description: "Enviar mensajes a profesores", category: "communication" },
  { id: "message_classmates", description: "Enviar mensajes a compañeros", category: "communication" },
  { id: "view_announcements", description: "Ver anuncios de clase", category: "communication" },
  { id: "view_class_members", description: "Ver miembros de la clase", category: "class" },
]

const teacherPermissions: Permission[] = [
  { id: "create_class", description: "Crear nuevas clases", category: "class" },
  { id: "edit_class", description: "Editar clases existentes", category: "class" },
  { id: "archive_class", description: "Archivar clases", category: "class" },
  { id: "delete_class", description: "Eliminar clases", category: "class" },
  { id: "create_assignment", description: "Crear tareas", category: "class" },
  { id: "edit_assignment", description: "Editar tareas", category: "class" },
  { id: "delete_assignment", description: "Eliminar tareas", category: "class" },
  { id: "grade_assignment", description: "Calificar tareas", category: "class" },
  { id: "create_announcement", description: "Crear anuncios", category: "communication" },
  { id: "edit_announcement", description: "Editar anuncios", category: "communication" },
  { id: "delete_announcement", description: "Eliminar anuncios", category: "communication" },
  { id: "upload_materials", description: "Subir materiales", category: "content" },
  { id: "edit_materials", description: "Editar materiales", category: "content" },
  { id: "delete_materials", description: "Eliminar materiales", category: "content" },
  { id: "manage_students", description: "Gestionar estudiantes", category: "class" },
  { id: "view_analytics", description: "Ver análisis y estadísticas", category: "class" },
  { id: "create_quiz", description: "Crear cuestionarios", category: "class" },
  { id: "export_grades", description: "Exportar calificaciones", category: "class" },
  { id: "invite_students", description: "Invitar estudiantes", category: "class" },
  { id: "remove_students", description: "Eliminar estudiantes de la clase", category: "class" },
  { id: "message_students", description: "Enviar mensajes a estudiantes", category: "communication" },
  { id: "message_teachers", description: "Enviar mensajes a otros profesores", category: "communication" },
  { id: "create_folders", description: "Crear carpetas para organizar materiales", category: "content" },
  { id: "schedule_events", description: "Programar eventos en el calendario", category: "class" },
  { id: "moderate_comments", description: "Moderar comentarios en anuncios", category: "communication" },
]

const adminPermissions: Permission[] = [
  { id: "manage_users", description: "Gestionar todos los usuarios", category: "system" },
  { id: "manage_all_classes", description: "Gestionar todas las clases", category: "system" },
  { id: "system_settings", description: "Configurar ajustes del sistema", category: "system" },
  { id: "view_logs", description: "Ver registros del sistema", category: "system" },
  { id: "manage_integrations", description: "Gestionar integraciones", category: "system" },
  { id: "create_user", description: "Crear nuevos usuarios", category: "system" },
  { id: "delete_user", description: "Eliminar usuarios", category: "system" },
  { id: "change_user_role", description: "Cambiar rol de usuarios", category: "system" },
  { id: "backup_system", description: "Realizar copias de seguridad", category: "system" },
  { id: "restore_system", description: "Restaurar copias de seguridad", category: "system" },
  { id: "view_all_analytics", description: "Ver análisis de toda la plataforma", category: "system" },
  { id: "manage_templates", description: "Gestionar plantillas de clases", category: "system" },
  { id: "manage_announcements", description: "Gestionar anuncios globales", category: "system" },
]

// Construir el mapa completo de permisos
export const PERMISSIONS: Record<UserRole, Permission[]> = {
  student: studentPermissions,
  teacher: [...teacherPermissions, ...studentPermissions], // Los profesores también tienen todos los permisos de estudiantes
  admin: [...adminPermissions, ...teacherPermissions, ...studentPermissions], // Los administradores tienen todos los permisos
}

// Función para verificar si un usuario tiene un permiso específico
export function hasPermission(userRole: UserRole, permissionId: string): boolean {
  return PERMISSIONS[userRole].some((permission) => permission.id === permissionId)
}

// Función para obtener todos los permisos de un usuario por categoría
export function getPermissionsByCategory(userRole: UserRole, category?: string): Record<string, Permission[]> {
  const permissions = PERMISSIONS[userRole]

  if (!category) {
    // Agrupar por categoría
    return permissions.reduce(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = []
        }
        acc[permission.category].push(permission)
        return acc
      },
      {} as Record<string, Permission[]>,
    )
  }

  // Filtrar por categoría específica
  return {
    [category]: permissions.filter((p) => p.category === category),
  }
}

// Capacidades y limitaciones específicas por rol
export const ROLE_CAPABILITIES = {
  student: {
    canDo: [
      "Ver y participar en clases en las que está inscrito",
      "Ver, descargar y comentar materiales de clase",
      "Ver, entregar y recibir retroalimentación sobre tareas",
      "Participar en discusiones y comentar anuncios",
      "Ver sus propias calificaciones y progreso",
      "Unirse a clases mediante códigos de invitación",
      "Personalizar su perfil y preferencias",
      "Recibir notificaciones sobre actividades de clase",
      "Comunicarse con profesores y compañeros",
      "Descargar materiales de estudio",
      "Marcar tareas como completadas",
      "Configurar recordatorios para fechas de entrega",
      "Ver el calendario de la clase",
      "Solicitar ayuda a profesores",
      "Participar en encuestas y cuestionarios",
    ],
    cannotDo: [
      "Crear o eliminar clases",
      "Modificar materiales o tareas",
      "Ver calificaciones de otros estudiantes",
      "Invitar a otros estudiantes a una clase",
      "Crear anuncios o tareas",
      "Acceder a clases sin invitación",
      "Modificar la estructura de la clase",
      "Calificar tareas o actividades",
      "Acceder a estadísticas o análisis de la clase",
      "Eliminar comentarios de otros estudiantes",
      "Modificar fechas de entrega",
      "Acceder a información privada de otros estudiantes",
      "Cambiar su rol en la plataforma",
      "Exportar datos de la clase completa",
      "Acceder a secciones administrativas",
    ],
  },
  teacher: {
    canDo: [
      "Crear, editar y eliminar clases",
      "Añadir y gestionar materiales de clase (documentos, videos, enlaces, etc.)",
      "Crear, editar y calificar tareas",
      "Crear anuncios y comunicarse con los estudiantes",
      "Ver y exportar calificaciones de todos los estudiantes",
      "Invitar y gestionar estudiantes en sus clases",
      "Crear y gestionar cuestionarios y exámenes",
      "Acceder a estadísticas y análisis de rendimiento",
      "Personalizar la apariencia y estructura de sus clases",
      "Programar eventos y recordatorios en el calendario",
      "Crear grupos de trabajo dentro de la clase",
      "Moderar comentarios y discusiones",
      "Organizar materiales en carpetas temáticas",
      "Establecer fechas de entrega y políticas de calificación",
      "Enviar notificaciones a estudiantes",
      "Crear plantillas de retroalimentación",
      "Generar informes de progreso",
      "Archivar clases anteriores",
      "Reutilizar materiales entre diferentes clases",
      "Establecer objetivos de aprendizaje",
    ],
    cannotDo: [
      "Acceder a clases de otros profesores sin permiso",
      "Modificar información personal de los estudiantes",
      "Acceder a configuraciones administrativas del sistema",
      "Ver clases o contenido no relacionado con sus asignaturas",
      "Eliminar cuentas de usuario",
      "Modificar la estructura global de la plataforma",
      "Cambiar roles de usuarios",
      "Acceder a datos analíticos de toda la plataforma",
      "Modificar el código fuente o la base de datos",
      "Cambiar configuraciones globales del sistema",
    ],
  },
  admin: {
    canDo: [
      "Todas las capacidades de profesores y estudiantes",
      "Gestionar todos los usuarios y clases del sistema",
      "Configurar ajustes globales de la plataforma",
      "Acceder a registros y estadísticas del sistema",
      "Gestionar integraciones con servicios externos",
      "Crear y gestionar plantillas de clases",
      "Supervisar y moderar todo el contenido",
      "Gestionar roles y permisos de usuarios",
      "Realizar copias de seguridad y restauraciones",
      "Implementar actualizaciones del sistema",
      "Crear anuncios globales para toda la plataforma",
      "Acceder a métricas de uso y rendimiento",
      "Gestionar la configuración de seguridad",
      "Auditar actividades de usuarios",
      "Gestionar el almacenamiento y recursos del sistema",
    ],
    cannotDo: [
      "Acceder a contraseñas de usuarios (solo hash)",
      "Modificar el código fuente sin autorización",
      "Eliminar registros de auditoría del sistema",
      "Desactivar medidas de seguridad críticas",
      "Acceder a información personal protegida sin justificación",
    ],
  },
}

// Función para verificar si un usuario puede realizar una acción específica
export function canPerformAction(userRole: UserRole, action: string): boolean {
  return ROLE_CAPABILITIES[userRole].canDo.includes(action)
}

// Función para verificar si un usuario tiene restricción para una acción
export function hasRestriction(userRole: UserRole, restriction: string): boolean {
  return ROLE_CAPABILITIES[userRole].cannotDo.includes(restriction)
}

// Función para obtener una descripción legible de los permisos
export function getPermissionDescription(permissionId: string): string {
  for (const role in PERMISSIONS) {
    const permission = PERMISSIONS[role as UserRole].find((p) => p.id === permissionId)
    if (permission) {
      return permission.description
    }
  }
  return "Permiso desconocido"
}

// Constantes para mensajes de error por falta de permisos
export const PERMISSION_DENIED_MESSAGES = {
  default: "No tienes permiso para realizar esta acción.",
  create_class: "Solo los profesores pueden crear clases.",
  edit_class: "No tienes permiso para editar esta clase.",
  delete_class: "No tienes permiso para eliminar esta clase.",
  upload_materials: "Solo los profesores pueden subir materiales.",
  grade_assignment: "No tienes permiso para calificar tareas.",
  view_analytics: "No tienes acceso a las estadísticas de la clase.",
  manage_students: "No tienes permiso para gestionar estudiantes.",
  system_settings: "Solo los administradores pueden acceder a la configuración del sistema.",
}

// Función para obtener el mensaje de error por falta de permiso
export function getPermissionDeniedMessage(permissionId: string): string {
  return (
    PERMISSION_DENIED_MESSAGES[permissionId as keyof typeof PERMISSION_DENIED_MESSAGES] ||
    PERMISSION_DENIED_MESSAGES.default
  )
}
