import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let comp: AppComponent;

  beforeEach(() => {
    comp = new AppComponent(<any>{});
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
