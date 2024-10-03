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
import { LoginResponse, User } from '../../interfaces/user';
import { switchMap, of, concatMap, catchError } from 'rxjs';
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
  public isEmailRegistered: boolean = false;

  activeModal = inject(NgbActiveModal);
  usersService = inject(UsersService);
  customValidators = inject(ValidatorsService);
  router = inject(Router);
  alertService = inject(AlertService);

  userRegisterForm: FormGroup;

  constructor() {
    this.userRegisterForm = new FormGroup({
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
    return this.customValidators.isValidField(this.userRegisterForm, field);
  }

  public getFieldError(form: FormGroup, field: string) {
    return this.customValidators.getFieldError(this.userRegisterForm, field);
  }


  onSubmit() {
    const { email, password } = this.userRegisterForm.value;

    this.usersService.getUserByEmail(email).pipe( // Check if the user exists
        switchMap((users: User[]) => {
          if ((users.length === 0)) {
            // If the user is not registered, proceed with the register
            return this.usersService.register(this.userRegisterForm.value).pipe(
              // After registering the user we log him in
              concatMap(() => this.usersService.login(email, password))
            );
          } else {
            // If the user is registered
            setTimeout(() => {
              this.alertService.showAlert({text:'Email is already registered', icon:'warning'});
            }, 100);
            return of(null); // We stop the chain returning an empty observable
          }
        }),
        catchError((error) => {
          // Error handling for the entire sequence
          console.error('Ocurrió un error:', error);
          return of(null); // We stop the chain in case of error
        })
      )
      .subscribe((loginResponse: LoginResponse) => {
        if (loginResponse.token) {
          localStorage.setItem('token', loginResponse.token);
          this.usersService.user = loginResponse.results[0];
          this.userRegisterForm.reset();
          setTimeout(() => {
            this.alertService.showAlert({text:'User registered successfuly', icon:'success'});
          }, 100);
          this.activeModal.close();
          this.router.navigate(['/pages/home']);
        }
      });
  }

  public cancel() {
    this.activeModal.close();
  }
}
