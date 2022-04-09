import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FinanceService } from '../service/finance.service';
import { IFinance, Finance } from '../finance.model';

import { FinanceUpdateComponent } from './finance-update.component';

describe('Finance Management Update Component', () => {
  let comp: FinanceUpdateComponent;
  let fixture: ComponentFixture<FinanceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let financeService: FinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FinanceUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FinanceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FinanceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    financeService = TestBed.inject(FinanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const finance: IFinance = { id: 456 };

      activatedRoute.data = of({ finance });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(finance));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Finance>>();
      const finance = { id: 123 };
      jest.spyOn(financeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finance }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(financeService.update).toHaveBeenCalledWith(finance);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Finance>>();
      const finance = new Finance();
      jest.spyOn(financeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: finance }));
      saveSubject.complete();

      // THEN
      expect(financeService.create).toHaveBeenCalledWith(finance);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Finance>>();
      const finance = { id: 123 };
      jest.spyOn(financeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ finance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(financeService.update).toHaveBeenCalledWith(finance);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
