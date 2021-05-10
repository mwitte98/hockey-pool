import { BestEntryService } from './best-entry.service';

describe('BestEntryService', () => {
  let comp: BestEntryService;

  beforeEach(() => {
    comp = new BestEntryService({} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
