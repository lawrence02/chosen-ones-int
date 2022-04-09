import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinance } from '../finance.model';

@Component({
  selector: 'jhi-finance-detail',
  templateUrl: './finance-detail.component.html',
})
export class FinanceDetailComponent implements OnInit {
  finance: IFinance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finance }) => {
      this.finance = finance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
