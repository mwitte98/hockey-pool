import { EntriesService } from './entries.service';

describe('EntriesService', () => {
  let service: EntriesService;

  beforeEach(() => {
    service = new EntriesService({} as any);
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
