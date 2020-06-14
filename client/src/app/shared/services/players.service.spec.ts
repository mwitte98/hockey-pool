import { PlayersService } from './players.service';

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(() => {
    service = new PlayersService({} as any);
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
