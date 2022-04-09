import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFinance, Finance } from '../finance.model';
import { FinanceService } from '../service/finance.service';

@Injectable({ providedIn: 'root' })
export class FinanceRoutingResolveService implements Resolve<IFinance> {
  constructor(protected service: FinanceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinance> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((finance: HttpResponse<Finance>) => {
          if (finance.body) {
            return of(finance.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Finance());
  }
}
