import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { ValidatorsService } from '../../services/validators.service';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { LoginResponse } from '../../interfaces/user.interface';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  activeModal = inject(NgbActiveModal);
  usersService = inject(UsersService);
  customValidators = inject(ValidatorsService);
  router = inject(Router);
  modalService = inject(NgbModal);
  alertService = inject(AlertService);

  public userLoginForm: FormGroup;

  constructor() {
    this.userLoginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.customValidators.emailPattern),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  public isValidField(field: string) {
    return this.customValidators.isValidField(this.userLoginForm, field);
  }

  public getFieldError(form: FormGroup, field: string) {
    return this.customValidators.getFieldError(form, field);
  }

  public onSubmit() {
    if (this.userLoginForm.invalid) {
      return;
    }

    const { email, password } = this.userLoginForm.value;

    this.usersService.login(email, password).subscribe({
      next: (response: LoginResponse) => {
        localStorage.setItem('token', response.token);
        this.usersService.user = response.results[0];
        this.userLoginForm.reset();
        setTimeout(() => {
          this.alertService.showAlert({
            text: `User logged in successfuly`,
            icon: 'success',
          });
        }, 100);
        this.activeModal.close();
      },
      error: (error: Error) => {
        console.log(error);
        setTimeout(() => {
          this.alertService.showAlert({
            text: 'Incorrect email or password',
            icon: 'error',
          });
        }, 100);
        this.userLoginForm.reset();
        this.activeModal.close();
      },
    });
  }

  public cancel() {
    this.activeModal.close();
  }

  public register(event: Event) {
    event.preventDefault();
    this.activeModal.close();
    this.modalService.open(RegisterComponent);
  }
}
