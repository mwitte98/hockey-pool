import { PlayerStatsTabComponent } from './player-stats-tab.component';

describe('PlayerStatsTabComponent', () => {
  let comp: PlayerStatsTabComponent;

  beforeEach(() => {
    comp = new PlayerStatsTabComponent({} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
