// This script restores the middleware.ts file
const fs = require("fs")
const path = require("path")

const middlewarePath = path.join(__dirname, "..", "middleware.ts")
const disabledPath = path.join(__dirname, "..", "middleware.ts.disabled")

if (fs.existsSync(disabledPath)) {
  console.log("Enabling middleware...")
  fs.renameSync(disabledPath, middlewarePath)
  console.log("Middleware enabled. Renamed to middleware.ts")
} else if (fs.existsSync(middlewarePath)) {
  console.log("Middleware is already enabled.")
} else {
  console.log("No middleware file found.")
}

console.log("Please restart your development server.")
