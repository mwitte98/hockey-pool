import 'jest-preset-angular';

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});
