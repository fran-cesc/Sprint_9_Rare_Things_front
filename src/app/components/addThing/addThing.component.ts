import { Component } from '@angular/core';
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
import { ThingsService } from '../../services/things.service.js';

@Component({
  selector: 'app-addThing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './addThing.component.html',
  styleUrl: './addThing.component.css',
})

export class AddThingComponent {

  public file: any;

  //TODO correctly validate
  public thingForm: FormGroup = new FormGroup({
    user_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    thing_title: new FormControl('', Validators.required),
    location: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    category: new FormControl('', Validators.required)
    });

    constructor(
    private router: Router,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private validatorsService: ValidatorsService,
    private thingsService: ThingsService
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
  onImageLoad(event: any){
    this.file = event.target.files[0];
  }

  addThing(): void {
    // if (this.thingForm.invalid) {
    //   this.thingForm.markAllAsTouched();
    //   return;
    // }

    let fd = new FormData();
    fd.append('image', this.file);
    fd.append('user_name', this.thingForm.value.user_name);
    fd.append('thing_title', this.thingForm.value.thing_title);
    fd.append('location', this.thingForm.value.location);
    fd.append('category', this.thingForm.value.category);

    this.thingsService.addThing(fd).subscribe(
      (response) => {
        alert(`${this.thingForm.value.user_name} successfuly uploaded ${this.thingForm.value.thing_title}`);
        this.activeModal.close();
        this.thingForm.reset();
        // window.location.reload();
      },
      (error) => {
        console.error('Error:', error);
        alert('Error adding thing. Please try again.');
      }
    );
  };




  closeModal() {
    this.activeModal.close();
  }
}
