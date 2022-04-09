import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { IFinance, Finance } from '../finance.model';

import { FinanceService } from './finance.service';

describe('Finance Service', () => {
  let service: FinanceService;
  let httpMock: HttpTestingController;
  let elemDefault: IFinance;
  let expectedResult: IFinance | IFinance[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FinanceService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      amount: 0,
      paymentType: PaymentType.OFFERING,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Finance', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Finance()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Finance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          amount: 1,
          paymentType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Finance', () => {
      const patchObject = Object.assign(
        {
          paymentType: 'BBBBBB',
        },
        new Finance()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Finance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_TIME_FORMAT),
          amount: 1,
          paymentType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Finance', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFinanceToCollectionIfMissing', () => {
      it('should add a Finance to an empty array', () => {
        const finance: IFinance = { id: 123 };
        expectedResult = service.addFinanceToCollectionIfMissing([], finance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(finance);
      });

      it('should not add a Finance to an array that contains it', () => {
        const finance: IFinance = { id: 123 };
        const financeCollection: IFinance[] = [
          {
            ...finance,
          },
          { id: 456 },
        ];
        expectedResult = service.addFinanceToCollectionIfMissing(financeCollection, finance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Finance to an array that doesn't contain it", () => {
        const finance: IFinance = { id: 123 };
        const financeCollection: IFinance[] = [{ id: 456 }];
        expectedResult = service.addFinanceToCollectionIfMissing(financeCollection, finance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(finance);
      });

      it('should add only unique Finance to an array', () => {
        const financeArray: IFinance[] = [{ id: 123 }, { id: 456 }, { id: 7959 }];
        const financeCollection: IFinance[] = [{ id: 123 }];
        expectedResult = service.addFinanceToCollectionIfMissing(financeCollection, ...financeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const finance: IFinance = { id: 123 };
        const finance2: IFinance = { id: 456 };
        expectedResult = service.addFinanceToCollectionIfMissing([], finance, finance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(finance);
        expect(expectedResult).toContain(finance2);
      });

      it('should accept null and undefined values', () => {
        const finance: IFinance = { id: 123 };
        expectedResult = service.addFinanceToCollectionIfMissing([], null, finance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(finance);
      });

      it('should return initial array if no Finance is added', () => {
        const financeCollection: IFinance[] = [{ id: 123 }];
        expectedResult = service.addFinanceToCollectionIfMissing(financeCollection, undefined, null);
        expect(expectedResult).toEqual(financeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
