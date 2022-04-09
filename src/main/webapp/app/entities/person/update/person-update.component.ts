import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPerson, Person } from '../person.model';
import { PersonService } from '../service/person.service';
import { Gender } from 'app/entities/enumerations/gender.model';
import { BAPTIZED } from 'app/entities/enumerations/baptized.model';
import { MARITALSTATUS } from 'app/entities/enumerations/maritalstatus.model';
import { MINISTRY } from 'app/entities/enumerations/ministry.model';

@Component({
  selector: 'jhi-person-update',
  templateUrl: './person-update.component.html',
})
export class PersonUpdateComponent implements OnInit {
  isSaving = false;
  genderValues = Object.keys(Gender);
  bAPTIZEDValues = Object.keys(BAPTIZED);
  mARITALSTATUSValues = Object.keys(MARITALSTATUS);
  mINISTRYValues = Object.keys(MINISTRY);

  editForm = this.fb.group({
    id: [],
    firstname: [],
    lastname: [],
    dob: [],
    gender: [],
    occupation: [],
    phone: [],
    baptized: [],
    maritalStatus: [],
    nationality: [],
    ministry: [],
  });

  constructor(protected personService: PersonService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ person }) => {
      if (person.id === undefined) {
        const today = dayjs().startOf('day');
        person.dob = today;
      }

      this.updateForm(person);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const person = this.createFromForm();
    if (person.id !== undefined) {
      this.subscribeToSaveResponse(this.personService.update(person));
    } else {
      this.subscribeToSaveResponse(this.personService.create(person));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerson>>): void {
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

  protected updateForm(person: IPerson): void {
    this.editForm.patchValue({
      id: person.id,
      firstname: person.firstname,
      lastname: person.lastname,
      dob: person.dob ? person.dob.format(DATE_TIME_FORMAT) : null,
      gender: person.gender,
      occupation: person.occupation,
      phone: person.phone,
      baptized: person.baptized,
      maritalStatus: person.maritalStatus,
      nationality: person.nationality,
      ministry: person.ministry,
    });
  }

  protected createFromForm(): IPerson {
    return {
      ...new Person(),
      id: this.editForm.get(['id'])!.value,
      firstname: this.editForm.get(['firstname'])!.value,
      lastname: this.editForm.get(['lastname'])!.value,
      dob: this.editForm.get(['dob'])!.value ? dayjs(this.editForm.get(['dob'])!.value, DATE_TIME_FORMAT) : undefined,
      gender: this.editForm.get(['gender'])!.value,
      occupation: this.editForm.get(['occupation'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      baptized: this.editForm.get(['baptized'])!.value,
      maritalStatus: this.editForm.get(['maritalStatus'])!.value,
      nationality: this.editForm.get(['nationality'])!.value,
      ministry: this.editForm.get(['ministry'])!.value,
    };
  }
}
