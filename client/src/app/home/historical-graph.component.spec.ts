import { HistoricalGraphComponent } from './historical-graph.component';

describe('HistoricalGraphComponent', () => {
  let comp: HistoricalGraphComponent;

  beforeEach(() => {
    comp = new HistoricalGraphComponent({} as any, {} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
