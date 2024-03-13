import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { ValidatorsService } from '../../services/validators.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  public isEmailRegistered!: boolean;

  activeModal = inject(NgbActiveModal);
  usersService = inject(UsersService);
  customValidators = inject(ValidatorsService);
  router = inject(Router);
  userForm: FormGroup;

  constructor() {
    this.userForm = new FormGroup({
      user_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
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
    return this.customValidators.isValidField(this.userForm, field);
  }

  public getFieldError(form: FormGroup, field: string) {
    return this.customValidators.getFieldError(this.userForm, field);
  }

  public async onSubmit() {
    try {
      this.userForm.markAllAsTouched();
      if (this.userForm.invalid) {
        return;
      }

      const userMail = await this.userForm.get('email')!.value;

      this.isEmailRegistered = await this.usersService.isMailRegistered(
        userMail
      );

      if (this.isEmailRegistered) {
        alert('email is already registered');
        this.userForm.reset();
        this.activeModal.close();
        return;
      }

      await this.usersService.register(this.userForm.value);
      const response: any = await this.usersService.login(this.userForm.value);

      if (!response.error) {
        localStorage.setItem('token', response.token);
        this.usersService.currentUser.set(response.results[0]);
        this.userForm.reset();
        alert('User registered successfuly');
        this.activeModal.close();
        this.router.navigate(['/home']);
      }
    } catch (error) {
      throw error;
    }
  }

  public cancel() {
    this.activeModal.close();
  }
}
