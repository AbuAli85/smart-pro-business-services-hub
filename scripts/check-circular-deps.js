const madge = require("madge")
const path = require("path")

async function findCircularDependencies() {
  console.log("Checking for circular dependencies...")

  try {
    // Create a Madge instance for your project
    const result = await madge(path.join(__dirname, ".."), {
      baseDir: path.join(__dirname, ".."),
      excludeRegExp: [/node_modules/, /\.next/, /\.git/],
      fileExtensions: ["js", "jsx", "ts", "tsx"],
    })

    // Find circular dependencies
    const circular = result.circular()

    if (circular.length) {
      console.log("\x1b[31m%s\x1b[0m", "⚠️ Circular dependencies found:")
      circular.forEach((path, i) => {
        console.log(`\x1b[33m${i + 1})\x1b[0m ${path.join(" -> ")}`)
      })
      console.log("\nThese circular dependencies may cause build issues. Please fix them.")
    } else {
      console.log("\x1b[32m%s\x1b[0m", "✅ No circular dependencies found!")
    }
  } catch (error) {
    console.error("Error checking for circular dependencies:", error)
  }
}

findCircularDependencies()
