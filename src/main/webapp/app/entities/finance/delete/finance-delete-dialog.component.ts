import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinance } from '../finance.model';
import { FinanceService } from '../service/finance.service';

@Component({
  templateUrl: './finance-delete-dialog.component.html',
})
export class FinanceDeleteDialogComponent {
  finance?: IFinance;

  constructor(protected financeService: FinanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.financeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
