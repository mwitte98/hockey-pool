import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let comp: HeaderComponent;

  beforeEach(() => {
    comp = new HeaderComponent({} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
