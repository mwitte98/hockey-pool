import { AdminSettingsComponent } from './admin-settings.component';

describe('AdminSettingsComponent', () => {
  let comp: AdminSettingsComponent;

  beforeEach(() => {
    comp = new AdminSettingsComponent({} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
