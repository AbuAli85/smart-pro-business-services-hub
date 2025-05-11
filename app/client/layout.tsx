"use client"

import { RoleBasedLayout } from "@/components/layouts/role-based-layout"
import type { ReactNode } from "react"

export default function ClientLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <RoleBasedLayout allowedRoles={["client", "admin"]}>
      <div className="h-screen bg-gray-50">
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">{children}</div>
          </main>
        </div>
      </div>
    </RoleBasedLayout>
  )
}
