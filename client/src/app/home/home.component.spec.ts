import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let comp: HomeComponent;

  beforeEach(() => {
    comp = new HomeComponent({} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
