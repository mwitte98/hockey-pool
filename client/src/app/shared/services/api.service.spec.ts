import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    service = new ApiService(<any>{});
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
