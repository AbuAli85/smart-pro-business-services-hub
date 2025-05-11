// This script adds a polyfill for 'exports' in the browser environment
// Run this script before starting the development server

const fs = require("fs")
const path = require("path")

// Create a polyfill file
const polyfillContent = `
// Polyfill for 'exports' in browser environment
if (typeof window !== 'undefined' && typeof exports === 'undefined') {
  window.exports = {};
}

// Polyfill for 'require' in browser environment
if (typeof window !== 'undefined' && typeof require === 'undefined') {
  window.require = function(module) {
    console.warn('Mock require called for', module);
    return {};
  };
}
`

const polyfillPath = path.join(__dirname, "..", "public", "module-polyfill.js")

// Write the polyfill file
fs.writeFileSync(polyfillPath, polyfillContent)
console.log(`Created module polyfill at ${polyfillPath}`)

// Update _document.js to include the polyfill
const documentPath = path.join(__dirname, "..", "pages", "_document.tsx")

// Check if _document.tsx exists, if not create it
if (!fs.existsSync(documentPath)) {
  const documentContent = `
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="/module-polyfill.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`

  // Create the directory if it doesn't exist
  const pagesDir = path.join(__dirname, "..", "pages")
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true })
  }

  fs.writeFileSync(documentPath, documentContent)
  console.log(`Created _document.tsx at ${documentPath}`)
} else {
  // Read the existing document file
  let documentContent = fs.readFileSync(documentPath, "utf8")

  // Check if the polyfill script is already included
  if (!documentContent.includes("/module-polyfill.js")) {
    // Add the polyfill script to the Head
    documentContent = documentContent.replace("<Head>", '<Head>\n        <script src="/module-polyfill.js" />')

    fs.writeFileSync(documentPath, documentContent)
    console.log(`Updated _document.tsx to include the module polyfill`)
  } else {
    console.log("Module polyfill already included in _document.tsx")
  }
}

console.log("Module issues fix completed. Please restart your development server.")
