import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let comp: AuthComponent;

  beforeEach(() => {
    comp = new AuthComponent({} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
