import { SaltosService } from './saltos.service';
import { TestBed } from '@angular/core/testing';


describe('SaltosService', () => {
  let service: SaltosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaltosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
