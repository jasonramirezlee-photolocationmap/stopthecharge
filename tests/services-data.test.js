const { SERVICES_DATA } = require('../js/services-data');

describe('SERVICES_DATA', () => {
  test('contains at least 100 services', () => {
    expect(Array.isArray(SERVICES_DATA)).toBe(true);
    expect(SERVICES_DATA.length).toBeGreaterThanOrEqual(100);
  });

  test.each([
    'id',
    'name',
    'category',
    'cost',
    'difficulty',
    'steps',
    'contact'
  ])('each service has %s', (field) => {
    SERVICES_DATA.forEach((service) => {
      expect(service[field]).toBeDefined();
    });
  });
});
