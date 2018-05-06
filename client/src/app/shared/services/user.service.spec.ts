import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(<any>{});
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
