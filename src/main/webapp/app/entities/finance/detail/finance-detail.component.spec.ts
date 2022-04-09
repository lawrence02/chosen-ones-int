import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinanceDetailComponent } from './finance-detail.component';

describe('Finance Management Detail Component', () => {
  let comp: FinanceDetailComponent;
  let fixture: ComponentFixture<FinanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ finance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FinanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load finance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.finance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
