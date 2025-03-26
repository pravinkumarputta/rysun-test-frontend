import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { routeDataResolver } from './route-data.resolver';

describe('routeDataResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => routeDataResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
