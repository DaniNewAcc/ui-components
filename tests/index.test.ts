import * as Components from '@/index';

describe('Entry point for library', () => {
  Object.keys(Components).forEach((componentName, component) => {
    it(`should export correctly ${componentName} component`, () => {
      expect(component).toBeDefined();
    });
  });
});
