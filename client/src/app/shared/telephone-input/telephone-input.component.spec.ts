import { TelephoneInputComponent } from './telephone-input.component';

describe('TelephoneInputComponent', () => {
  let comp: TelephoneInputComponent;

  beforeEach(() => {
    comp = new TelephoneInputComponent({ group: () => {} } as any, {} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
