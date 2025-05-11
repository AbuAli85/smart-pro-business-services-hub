// This script temporarily renames the middleware.ts file to disable it
const fs = require("fs")
const path = require("path")

const middlewarePath = path.join(__dirname, "..", "middleware.ts")
const disabledPath = path.join(__dirname, "..", "middleware.ts.disabled")

if (fs.existsSync(middlewarePath)) {
  console.log("Disabling middleware...")
  fs.renameSync(middlewarePath, disabledPath)
  console.log("Middleware disabled. Renamed to middleware.ts.disabled")
} else if (fs.existsSync(disabledPath)) {
  console.log("Middleware is already disabled.")
} else {
  console.log("No middleware file found.")
}

console.log("Please restart your development server.")
