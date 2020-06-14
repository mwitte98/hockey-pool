import { AdminTeamsComponent } from './admin-teams.component';

describe('AdminTeamsComponent', () => {
  let comp: AdminTeamsComponent;

  beforeEach(() => {
    comp = new AdminTeamsComponent({} as any, {} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
