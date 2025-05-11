const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// List of dependencies to check
const requiredDependencies = [
  "@radix-ui/react-avatar",
  "@radix-ui/react-scroll-area",
  "@radix-ui/react-progress",
  "@radix-ui/react-tooltip",
  "@supabase/auth-helpers-nextjs",
  "@ai-sdk/deepinfra",
  "@ai-sdk/xai",
  "@vercel/blob",
  "@upstash/redis",
  "critters",
]

console.log("Checking for required dependencies...")

// Read package.json
const packageJsonPath = path.join(__dirname, "..", "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

const installedDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}

// Check which dependencies are missing
const missingDependencies = requiredDependencies.filter((dep) => !installedDependencies[dep])

if (missingDependencies.length === 0) {
  console.log("✅ All required dependencies are installed.")
} else {
  console.log("⚠️ Missing dependencies:")
  missingDependencies.forEach((dep) => console.log(`  - ${dep}`))

  // Ask if user wants to install missing dependencies
  console.log("\nDo you want to install these dependencies? (y/n)")
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  readline.question("> ", (answer) => {
    if (answer.toLowerCase() === "y") {
      console.log("Installing missing dependencies...")
      try {
        execSync(`npm install ${missingDependencies.join(" ")}`, { stdio: "inherit" })
        console.log("✅ Dependencies installed successfully.")
      } catch (error) {
        console.error("❌ Error installing dependencies:", error.message)
      }
    } else {
      console.log("Skipping dependency installation. Some features may not work correctly.")
    }
    readline.close()
  })
}
