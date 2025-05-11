const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Installing missing dependencies...")

// Check if using npm or yarn
const hasYarnLock = fs.existsSync(path.join(process.cwd(), "yarn.lock"))
const packageManager = hasYarnLock ? "yarn" : "npm"

// List of dependencies to install
const dependencies = [
  "class-variance-authority@0.7.0",
  "tailwindcss-animate@1.0.7",
  "clsx@2.1.0",
  "tailwind-merge@2.2.0",
]

try {
  const installCmd =
    packageManager === "yarn" ? `yarn add ${dependencies.join(" ")}` : `npm install ${dependencies.join(" ")}`

  console.log(`Running: ${installCmd}`)
  execSync(installCmd, { stdio: "inherit" })

  console.log("Dependencies installed successfully!")
} catch (error) {
  console.error("Failed to install dependencies:", error.message)
  process.exit(1)
}
