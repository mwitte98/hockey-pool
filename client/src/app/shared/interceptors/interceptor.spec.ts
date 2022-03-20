import { Interceptor } from './interceptor';

describe('Interceptor', () => {
  let interceptor: Interceptor;

  beforeEach(() => {
    interceptor = new Interceptor();
  });

  it('component is created', () => {
    expect(interceptor).toBeTruthy();
  });
});
