"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionGuard } from "@/components/permission-guard"
import { PERMISSIONS, ROLE_CAPABILITIES, type UserRole } from "@/lib/roles-permissions"
import { CheckCircle, XCircle, Search, Shield, User, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RolesPage() {
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<UserRole>("student")

  // Si no es administrador, redirigir al dashboard
  if (!isAdmin) {
    router.push("/dashboard")
    return null
  }

  const filteredPermissions = PERMISSIONS[activeTab].filter(
    (permission) =>
      permission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const capabilities = ROLE_CAPABILITIES[activeTab]

  return (
    <DashboardShell>
      <PermissionGuard requiredPermission="manage_users">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roles y Permisos</h1>
            <p className="text-muted-foreground">
              Gestiona los roles y permisos de los usuarios en la plataforma HABY-CLASS.
            </p>
          </div>
        </div>

        <Tabs
          defaultValue="student"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as UserRole)}
          className="mt-6"
        >
          <TabsList>
            <TabsTrigger value="student" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Estudiante
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Profesor
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Administrador
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 mb-6">
            <Label htmlFor="search-permissions" className="sr-only">
              Buscar permisos
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-permissions"
                type="search"
                placeholder="Buscar permisos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="student" className="space-y-6">
            <RoleContent
              roleName="Estudiante"
              description="Los estudiantes pueden unirse a clases, ver materiales, entregar tareas y participar en discusiones."
              permissions={filteredPermissions}
              capabilities={capabilities}
            />
          </TabsContent>

          <TabsContent value="teacher" className="space-y-6">
            <RoleContent
              roleName="Profesor"
              description="Los profesores pueden crear y gestionar clases, materiales, tareas y calificaciones."
              permissions={filteredPermissions}
              capabilities={capabilities}
            />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <RoleContent
              roleName="Administrador"
              description="Los administradores tienen control total sobre la plataforma, incluyendo la gestión de usuarios y configuraciones del sistema."
              permissions={filteredPermissions}
              capabilities={capabilities}
            />
          </TabsContent>
        </Tabs>

        {/* Copyright notice */}
        <div className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} HABY-CLASS. Todos los derechos reservados.
            <br />
            Desarrollado por HABY - Heber Zadkiel Garcia Perez
          </p>
        </div>
      </PermissionGuard>
    </DashboardShell>
  )
}

interface RoleContentProps {
  roleName: string
  description: string
  permissions: (typeof PERMISSIONS)["student"]
  capabilities: (typeof ROLE_CAPABILITIES)["student"]
}

function RoleContent({ roleName, description, permissions, capabilities }: RoleContentProps) {
  // Agrupar permisos por categoría
  const permissionsByCategory = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, typeof permissions>,
  )

  const categoryNames = {
    class: "Clases",
    content: "Contenido",
    user: "Usuario",
    system: "Sistema",
    communication: "Comunicación",
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Rol: {roleName}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Capacidades</h3>
              <ul className="space-y-2">
                {capabilities.canDo.map((capability, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Limitaciones</h3>
              <ul className="space-y-2">
                {capabilities.cannotDo.map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permisos detallados</CardTitle>
          <CardDescription>Lista completa de permisos asignados al rol de {roleName.toLowerCase()}.</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-4">
                {categoryNames[category as keyof typeof categoryNames] || category}
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Permiso</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-[100px]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-mono text-sm">{permission.id}</TableCell>
                      <TableCell>{permission.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Permitido
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
