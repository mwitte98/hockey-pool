import { StatColumnComponent } from './stat-column.component';

describe('StatColumnComponent', () => {
  let comp: StatColumnComponent;

  beforeEach(() => {
    comp = new StatColumnComponent({} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
