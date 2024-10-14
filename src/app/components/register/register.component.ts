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
import { AlertService } from '../../services/alert.service';

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

  private activeModal = inject(NgbActiveModal);
  private usersService = inject(UsersService);
  private customValidators = inject(ValidatorsService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  public registerForm: FormGroup;

  constructor() {
    this.registerForm = new FormGroup({
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
    return this.customValidators.isValidField(this.registerForm, field);
  }

  public getFieldError(form: FormGroup, field: string) {
    return this.customValidators.getFieldError(this.registerForm, field);
  }

  public async onSubmit() {
    try {
      this.registerForm.markAllAsTouched();
      if (this.registerForm.invalid) {
        return;
      }

      const userMail = this.registerForm.get('email')!.value;
      console.log('userMail: ', userMail);
      this.isEmailRegistered = await this.usersService.isMailRegistered(
        userMail
      );

      if (this.isEmailRegistered) {
        setTimeout(() => {
          this.alertService.showAlert({
            text: `email is already registered`,
            icon: 'warning',
          });
        }, 100);
        this.registerForm.reset();
        this.activeModal.close();
        return;
      }
      console.log('registerForm.value: ', this.registerForm.value);
      await this.usersService.register(this.registerForm.value);
      const response: any = await this.usersService.login(
        this.registerForm.value
      );

      if (response.token) {
        localStorage.setItem('token', response.token);
        this.usersService.user = response.results[0];
        this.registerForm.reset();
        setTimeout(() => {
          this.alertService.showAlert({
            text: `User registered successfuly`,
            icon: 'success',
          });
        }, 100);
        this.activeModal.close();
        // this.usersService.login()
        this.router.navigate(['/pages/home']);
      }
    } catch (error) {
      throw error;
    }
  }

  public cancel() {
    this.activeModal.close();
  }
}
