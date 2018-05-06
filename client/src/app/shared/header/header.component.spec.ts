import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let comp: HeaderComponent;

  beforeEach(() => {
    comp = new HeaderComponent(<any>{}, <any>{}, <any>{}, <any>{});
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
