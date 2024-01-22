import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../services/validators.service.js';

@Component({
  selector: 'app-addThing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addThing.component.html',
  styleUrl: './addThing.component.css',
})

export class AddThingComponent {

  public thingForm: FormGroup = new FormGroup({
    user_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    image: new FormControl('', Validators.required),
  });

    constructor(
    private router: Router,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private validatorsService: ValidatorsService
    ) {}

  // isValidField(field: string): boolean | null {
  //   return this.validatorsService.isValidField(this.runnerForm, field);
  // }
  // getFieldError(field: string): string | null {
  //   if (!this.runnerForm.controls[field]) return null;
  //   const errors = this.runnerForm.controls[field].errors || {};

  //   for (const key of Object.keys(errors)) {
  //     if (key === 'required') {
  //       return 'This field is required';
  //     } else if (key === 'minlength') {
  //       return `${errors['minlength'].requiredLength} caracters minimum`;
  //     } else if (key === 'pattern') {
  //       return 'time must be in hhmmss format';
  //     }
  //   }
  //   return null;
  // }

  // addRunner(): void {
  //   if (this.runnerForm.invalid) {
  //     this.runnerForm.markAllAsTouched();
  //     return;
  //   }

  //   try {
  //     this.raceService.addRunner(this.runnerForm.value).subscribe();
  //     alert(`Runner ${this.runnerForm.value.first_name} ${this.runnerForm.value.last_name} added successfuly`);
  //     this.runnerForm.reset();
  //     this.activeModal.close();
  //     window.location.reload();
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // closeModal() {
  //   this.activeModal.close();
  // }
}
