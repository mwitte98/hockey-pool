import { NoAuthGuard } from './no-auth-guard.service';

describe('NoAuthGuard', () => {
  let service: NoAuthGuard;

  beforeEach(() => {
    service = new NoAuthGuard({} as any);
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
