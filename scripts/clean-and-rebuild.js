const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning project...');

// Remove .next directory
try {
  if (fs.existsSync('.next')) {
    console.log('Removing .next directory...');
    fs.rmSync('.next', { recursive: true, force: true });
  }
} catch (err) {
  console.error('Error removing .next directory:', err);
}

// Clear Next.js cache
try {
  console.log('Clearing Next.js cache...');
  execSync('npx next clear', { stdio: 'inherit' });
} catch (err) {
  console.error('Error clearing Next.js cache:', err);
}

// Install dependencies
try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
} catch (err) {
  console.error('Error installing dependencies:', err);
}

// Build the project
try {
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (err) {
  console.error('Error building project:', err);
}

console.log('✅ Clean and rebuild complete!');
console.log('You can now run the project with: npm run start');
