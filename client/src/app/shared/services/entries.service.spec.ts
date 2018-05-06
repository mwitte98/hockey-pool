import { EntriesService } from './entries.service';

describe('EntriesService', () => {
  let service: EntriesService;

  beforeEach(() => {
    service = new EntriesService(<any>{});
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
