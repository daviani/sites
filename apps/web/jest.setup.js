import '@testing-library/jest-dom'

// Suppress jsdom navigation not implemented warnings
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'object' && args[0].message?.includes('Not implemented: navigation')) {
    return;
  }
  originalError.apply(console, args);
};

// Mock window.location to avoid jsdom navigation errors
// First delete the existing location, then define a writable one
delete window.location;
window.location = {
  hostname: 'localhost',
  href: 'http://localhost/',
  origin: 'http://localhost',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};
