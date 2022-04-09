import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FinanceComponent } from './list/finance.component';
import { FinanceDetailComponent } from './detail/finance-detail.component';
import { FinanceUpdateComponent } from './update/finance-update.component';
import { FinanceDeleteDialogComponent } from './delete/finance-delete-dialog.component';
import { FinanceRoutingModule } from './route/finance-routing.module';

@NgModule({
  imports: [SharedModule, FinanceRoutingModule],
  declarations: [FinanceComponent, FinanceDetailComponent, FinanceUpdateComponent, FinanceDeleteDialogComponent],
  entryComponents: [FinanceDeleteDialogComponent],
})
export class FinanceModule {}
