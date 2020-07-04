import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    service = new UtilService();
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
