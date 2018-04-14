import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let comp: AuthComponent;

  beforeEach(() => {
    comp = new AuthComponent(<any>{}, <any>{}, <any>{}, <any>{});
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
