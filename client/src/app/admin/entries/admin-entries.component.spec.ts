import { AdminEntriesComponent } from './admin-entries.component';

describe('AdminEntriesComponent', () => {
  let comp: AdminEntriesComponent;

  beforeEach(() => {
    comp = new AdminEntriesComponent({} as any, {} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
