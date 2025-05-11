import Link from "next/link"

export default function SetupPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">SmartPRO Setup</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/setup/database"
          className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Database Setup</h2>
          <p className="text-gray-600">Set up your database tables, relationships, and policies</p>
        </Link>

        <Link
          href="/setup/supabase"
          className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Supabase Configuration</h2>
          <p className="text-gray-600">Configure your Supabase project settings and authentication</p>
        </Link>

        <Link
          href="/setup/notifications"
          className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Notifications Setup</h2>
          <p className="text-gray-600">Set up real-time notifications and messaging</p>
        </Link>

        <Link
          href="/debug/system"
          className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">System Check</h2>
          <p className="text-gray-600">Run diagnostics and check system configuration</p>
        </Link>
      </div>
    </div>
  )
}
