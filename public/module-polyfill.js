
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
