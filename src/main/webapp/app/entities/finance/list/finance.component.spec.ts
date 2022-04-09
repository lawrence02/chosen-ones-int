import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FinanceService } from '../service/finance.service';

import { FinanceComponent } from './finance.component';

describe('Finance Management Component', () => {
  let comp: FinanceComponent;
  let fixture: ComponentFixture<FinanceComponent>;
  let service: FinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FinanceComponent],
    })
      .overrideTemplate(FinanceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinanceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FinanceService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.finances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
