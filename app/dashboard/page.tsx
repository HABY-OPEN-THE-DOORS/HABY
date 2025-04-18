import Sidebar from "@/components/dashboard/sidebar"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
        {/* Add more dashboard content here */}
      </div>
    </div>
  )
}
