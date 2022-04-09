import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFinance, Finance } from '../finance.model';
import { FinanceService } from '../service/finance.service';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';

@Component({
  selector: 'jhi-finance-update',
  templateUrl: './finance-update.component.html',
})
export class FinanceUpdateComponent implements OnInit {
  isSaving = false;
  paymentTypeValues = Object.keys(PaymentType);

  editForm = this.fb.group({
    id: [],
    date: [],
    amount: [],
    paymentType: [],
  });

  constructor(protected financeService: FinanceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finance }) => {
      if (finance.id === undefined) {
        const today = dayjs().startOf('day');
        finance.date = today;
      }

      this.updateForm(finance);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const finance = this.createFromForm();
    if (finance.id !== undefined) {
      this.subscribeToSaveResponse(this.financeService.update(finance));
    } else {
      this.subscribeToSaveResponse(this.financeService.create(finance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFinance>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(finance: IFinance): void {
    this.editForm.patchValue({
      id: finance.id,
      date: finance.date ? finance.date.format(DATE_TIME_FORMAT) : null,
      amount: finance.amount,
      paymentType: finance.paymentType,
    });
  }

  protected createFromForm(): IFinance {
    return {
      ...new Finance(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      amount: this.editForm.get(['amount'])!.value,
      paymentType: this.editForm.get(['paymentType'])!.value,
    };
  }
}
