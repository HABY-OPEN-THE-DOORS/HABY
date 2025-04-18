"use client"
import Link from "next/link"
import { Home, Book, Calendar, MessageSquare, Settings, LogOut } from "lucide-react"

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold">HABY Class</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {[
            { title: "Dashboard", icon: Home, href: "/dashboard" },
            { title: "Classes", icon: Book, href: "/dashboard/classes" },
            { title: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
            { title: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
            { title: "Settings", icon: Settings, href: "/dashboard/settings" },
          ].map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <button className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 w-full">
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
