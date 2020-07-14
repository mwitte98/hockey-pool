import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let comp: AppComponent;

  beforeEach(() => {
    comp = new AppComponent({} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
