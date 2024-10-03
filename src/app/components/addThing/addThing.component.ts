import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../services/validators.service.js';
import { ThingsService } from '../../services/things.service.js';
import { AlertService } from '../../services/alert.service.js';
import { UsersService } from '../../services/users.service.js';
import { User } from '../../interfaces/user.js';

@Component({
  selector: 'app-addThing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './addThing.component.html',
  styleUrl: './addThing.component.css',
})

export class AddThingComponent implements OnInit{

  public file: any;
  public currentUser: User | undefined;

  private alertService = inject(AlertService);
  private userService = inject(UsersService);

  constructor(){
    this.userService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.thingForm.reset();
    this.thingForm.get('thing_title')!.markAsUntouched();

  }

  public thingForm: FormGroup = new FormGroup({
    thing_title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    location: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category: new FormControl('', Validators.required),
    img_name: new FormControl('', Validators.required)
  });


  activeModal= inject(NgbActiveModal);
  validatorsService= inject(ValidatorsService);
  thingsService= inject(ThingsService);




  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.thingForm, field);
  }

  getFieldError(field: string): string | null {
    if (!this.thingForm.controls[field]) return null;

    const errors = this.thingForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      if (key === 'required') {
        return 'This field is required';
      };
      if (key === 'minlength') {
        return `This field must have ${errors['minlength'].requiredLength} caracters minimum`;
      };
    }
    return null;
  }

  // onImageLoad(event: any){
  //     this.file = event.target.files[0];
  // }

  onImageLoad(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  addThing(): void {

    if (this.thingForm.invalid) {
      this.thingForm.markAllAsTouched();
      return;
    }

    let fd = new FormData();
    fd.append('image', this.file);
    fd.append('user_name', this.currentUser!.user_name);
    fd.append('thing_title', this.thingForm.value.thing_title);
    fd.append('location', this.thingForm.value.location);
    fd.append('category', this.thingForm.value.category);


    this.thingsService.addThing(fd).subscribe({
      next: () => {
              setTimeout(() => {
                console.log(this.thingForm)
                this.alertService.showAlert({text:'Thing added successfuly!', icon:'success'});
              }, 100);
              this.activeModal.close();
              this.thingForm.reset();
            },
      error: (error) => {
                console.error('Error:', error);
                setTimeout(() => {
                  this.alertService.showAlert({text:'Error adding Thing. Please try again.', icon:'error'});
                }, 100);
              }
      });
  };

  closeModal() {
    this.activeModal.close();
  };

}
