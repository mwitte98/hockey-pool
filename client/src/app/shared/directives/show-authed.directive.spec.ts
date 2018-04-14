import { ShowAuthedDirective } from './show-authed.directive';

describe('ShowAuthedDirective', () => {
  let directive: ShowAuthedDirective;

  beforeEach(() => {
    directive = new ShowAuthedDirective(<any>{}, <any>{}, <any>{});
  });

  it('directive is created', () => {
    expect(directive).toBeTruthy();
  });
});
