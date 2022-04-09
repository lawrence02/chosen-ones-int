import dayjs from 'dayjs/esm';
import { IAddress } from 'app/entities/address/address.model';
import { Gender } from 'app/entities/enumerations/gender.model';
import { BAPTIZED } from 'app/entities/enumerations/baptized.model';
import { MARITALSTATUS } from 'app/entities/enumerations/maritalstatus.model';
import { MINISTRY } from 'app/entities/enumerations/ministry.model';

export interface IPerson {
  id?: number;
  firstname?: string | null;
  lastname?: string | null;
  dob?: dayjs.Dayjs | null;
  gender?: Gender | null;
  occupation?: string | null;
  phone?: string | null;
  baptized?: BAPTIZED | null;
  maritalStatus?: MARITALSTATUS | null;
  nationality?: string | null;
  ministry?: MINISTRY | null;
  addresses?: IAddress[] | null;
}

export class Person implements IPerson {
  constructor(
    public id?: number,
    public firstname?: string | null,
    public lastname?: string | null,
    public dob?: dayjs.Dayjs | null,
    public gender?: Gender | null,
    public occupation?: string | null,
    public phone?: string | null,
    public baptized?: BAPTIZED | null,
    public maritalStatus?: MARITALSTATUS | null,
    public nationality?: string | null,
    public ministry?: MINISTRY | null,
    public addresses?: IAddress[] | null
  ) {}
}

export function getPersonIdentifier(person: IPerson): number | undefined {
  return person.id;
}
