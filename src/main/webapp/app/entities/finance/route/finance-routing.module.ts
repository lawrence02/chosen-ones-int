import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FinanceComponent } from '../list/finance.component';
import { FinanceDetailComponent } from '../detail/finance-detail.component';
import { FinanceUpdateComponent } from '../update/finance-update.component';
import { FinanceRoutingResolveService } from './finance-routing-resolve.service';

const financeRoute: Routes = [
  {
    path: '',
    component: FinanceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinanceDetailComponent,
    resolve: {
      finance: FinanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinanceUpdateComponent,
    resolve: {
      finance: FinanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinanceUpdateComponent,
    resolve: {
      finance: FinanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(financeRoute)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
