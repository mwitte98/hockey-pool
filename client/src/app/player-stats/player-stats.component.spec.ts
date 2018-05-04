import { PlayerStatsComponent } from './player-stats.component';

describe('PlayerStatsComponent', () => {
  let comp: PlayerStatsComponent;

  beforeEach(() => {
    comp = new PlayerStatsComponent();
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
