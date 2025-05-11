// This script completely removes the middleware file
const fs = require("fs")
const path = require("path")

const middlewarePath = path.join(__dirname, "..", "middleware.ts")
const middlewareBackupPath = path.join(__dirname, "..", "middleware.ts.bak")

// Check if middleware file exists
if (fs.existsSync(middlewarePath)) {
  // Create a backup
  fs.copyFileSync(middlewarePath, middlewareBackupPath)
  console.log(`Created backup of middleware at ${middlewareBackupPath}`)

  // Remove the middleware file
  fs.unlinkSync(middlewarePath)
  console.log(`Removed middleware file at ${middlewarePath}`)
} else {
  console.log("No middleware file found.")
}

// Create an empty middleware.js file that does nothing
const emptyMiddleware = `
// This is an empty middleware that does nothing
export function middleware() {
  // No-op
}

// Empty config to avoid matching any paths
export const config = {
  matcher: []
};
`

fs.writeFileSync(middlewarePath, emptyMiddleware)
console.log(`Created empty middleware file at ${middlewarePath}`)

console.log("Middleware has been completely disabled.")
console.log("Please clear the Next.js cache and restart the development server:")
console.log("1. rm -rf .next")
console.log("2. npx next clear")
console.log("3. npm run dev")
