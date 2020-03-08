import { ShowAuthedDirective } from './show-authed.directive';

describe('ShowAuthedDirective', () => {
  let directive: ShowAuthedDirective;

  beforeEach(() => {
    directive = new ShowAuthedDirective({} as any, {} as any, {} as any);
  });

  it('directive is created', () => {
    expect(directive).toBeTruthy();
  });
});
