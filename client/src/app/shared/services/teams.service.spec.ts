import { TeamsService } from './teams.service';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(() => {
    service = new TeamsService(<any>{});
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
