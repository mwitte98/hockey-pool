import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    service = new SettingsService({} as any);
  });

  it('service is created', () => {
    expect(service).toBeTruthy();
  });
});
