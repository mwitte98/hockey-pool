import { AuthGuard } from './auth-guard.service';

describe('AuthGuard', () => {
  let service: AuthGuard;

  beforeEach(() => {
    service = new AuthGuard(<any>{});
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
