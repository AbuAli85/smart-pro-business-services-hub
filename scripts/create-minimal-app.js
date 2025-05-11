// This script creates a minimal version of the app to help identify issues
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Create a minimal app directory
const minimalAppDir = path.join(__dirname, "..", "minimal-app")
if (!fs.existsSync(minimalAppDir)) {
  fs.mkdirSync(minimalAppDir, { recursive: true })
}

// Create a minimal package.json
const packageJson = {
  name: "minimal-smartpro",
  version: "0.1.0",
  private: true,
  scripts: {
    dev: "next dev",
    build: "next build",
    start: "next start",
  },
  dependencies: {
    next: "14.0.4",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
  },
}

fs.writeFileSync(path.join(minimalAppDir, "package.json"), JSON.stringify(packageJson, null, 2))

// Create a minimal next.config.js
const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig
`

fs.writeFileSync(path.join(minimalAppDir, "next.config.js"), nextConfig)

// Create a minimal app directory structure
const appDir = path.join(minimalAppDir, "app")
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true })
}

// Create a minimal page.tsx
const pageContent = `
export default function Home() {
  return (
    <div>
      <h1>Minimal SmartPRO App</h1>
      <p>This is a minimal version of the app to help identify issues.</p>
    </div>
  )
}
`

fs.writeFileSync(path.join(appDir, "page.tsx"), pageContent)

// Create a minimal layout.tsx
const layoutContent = `
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
`

fs.writeFileSync(path.join(appDir, "layout.tsx"), layoutContent)

console.log("Minimal app created at:", minimalAppDir)
console.log("To use the minimal app:")
console.log("1. cd minimal-app")
console.log("2. npm install")
console.log("3. npm run dev")
