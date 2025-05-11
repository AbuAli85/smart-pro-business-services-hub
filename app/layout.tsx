import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DevelopmentModeBanner } from "@/components/development-mode-banner"
import { isDevelopment } from "@/lib/environment"
import { SessionRecoveryHandler } from "@/components/auth/session-recovery-handler"

export const metadata = {
  title: "SmartPRO – Business Services Hub",
  description: "Business services platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        {isDevelopment() && <DevelopmentModeBanner />}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        {/* Session recovery handler */}
        <SessionRecoveryHandler />
      </body>
    </html>
  )
}
