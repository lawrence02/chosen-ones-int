import dayjs from 'dayjs/esm';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';

export interface IFinance {
  id?: number;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  paymentType?: PaymentType | null;
}

export class Finance implements IFinance {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public amount?: number | null,
    public paymentType?: PaymentType | null
  ) {}
}

export function getFinanceIdentifier(finance: IFinance): number | undefined {
  return finance.id;
}
