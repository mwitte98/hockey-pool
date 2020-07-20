import { CreateEntryComponent } from './create-entry.component';

describe('CreateEntryComponent', () => {
  let comp: CreateEntryComponent;

  beforeEach(() => {
    comp = new CreateEntryComponent({} as any, {} as any, {} as any, {} as any, {} as any, {} as any);
  });

  it('component is created', () => {
    expect(comp).toBeTruthy();
  });
});
