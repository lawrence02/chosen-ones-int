import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFinance } from '../finance.model';
import { FinanceService } from '../service/finance.service';
import { FinanceDeleteDialogComponent } from '../delete/finance-delete-dialog.component';

@Component({
  selector: 'jhi-finance',
  templateUrl: './finance.component.html',
})
export class FinanceComponent implements OnInit {
  finances?: IFinance[];
  isLoading = false;

  constructor(protected financeService: FinanceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.financeService.query().subscribe({
      next: (res: HttpResponse<IFinance[]>) => {
        this.isLoading = false;
        this.finances = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFinance): number {
    return item.id!;
  }

  delete(finance: IFinance): void {
    const modalRef = this.modalService.open(FinanceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.finance = finance;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
