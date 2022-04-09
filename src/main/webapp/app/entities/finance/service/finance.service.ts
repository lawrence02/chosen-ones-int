import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFinance, getFinanceIdentifier } from '../finance.model';

export type EntityResponseType = HttpResponse<IFinance>;
export type EntityArrayResponseType = HttpResponse<IFinance[]>;

@Injectable({ providedIn: 'root' })
export class FinanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/finances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(finance: IFinance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(finance);
    return this.http
      .post<IFinance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(finance: IFinance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(finance);
    return this.http
      .put<IFinance>(`${this.resourceUrl}/${getFinanceIdentifier(finance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(finance: IFinance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(finance);
    return this.http
      .patch<IFinance>(`${this.resourceUrl}/${getFinanceIdentifier(finance) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFinance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFinance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFinanceToCollectionIfMissing(financeCollection: IFinance[], ...financesToCheck: (IFinance | null | undefined)[]): IFinance[] {
    const finances: IFinance[] = financesToCheck.filter(isPresent);
    if (finances.length > 0) {
      const financeCollectionIdentifiers = financeCollection.map(financeItem => getFinanceIdentifier(financeItem)!);
      const financesToAdd = finances.filter(financeItem => {
        const financeIdentifier = getFinanceIdentifier(financeItem);
        if (financeIdentifier == null || financeCollectionIdentifiers.includes(financeIdentifier)) {
          return false;
        }
        financeCollectionIdentifiers.push(financeIdentifier);
        return true;
      });
      return [...financesToAdd, ...financeCollection];
    }
    return financeCollection;
  }

  protected convertDateFromClient(finance: IFinance): IFinance {
    return Object.assign({}, finance, {
      date: finance.date?.isValid() ? finance.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((finance: IFinance) => {
        finance.date = finance.date ? dayjs(finance.date) : undefined;
      });
    }
    return res;
  }
}
