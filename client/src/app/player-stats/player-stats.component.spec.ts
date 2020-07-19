import { PlayerStatsComponent } from './player-stats.component';

describe('PlayerStatsComponent', () => {
  let comp: PlayerStatsComponent;

  beforeEach(() => {
    comp = new PlayerStatsComponent({} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
