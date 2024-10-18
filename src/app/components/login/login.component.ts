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
  private activeModal = inject(NgbActiveModal);
  private usersService = inject(UsersService);
  private customValidators = inject(ValidatorsService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private alertService = inject(AlertService);

  public loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
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
    return this.customValidators.isValidField(this.loginForm, field);
  }

  public getFieldError(form: FormGroup, field: string) {
    return this.customValidators.getFieldError(this.loginForm, field);
  }

  public async onSubmit() {

    const { email, password} = this.loginForm.value;
    try {
      if (this.loginForm.invalid) {
        return;
      }

      const response: LoginResponse = await this.usersService.login(
        email, password
      );
      console.log('response: ', response);

      if (response.token) {
        localStorage.setItem('token', response.token);
        this.usersService.user = response.results[0];
        this.usersService.isUserLogged$ = true;
        this.loginForm.reset();
        setTimeout(() => {
          this.alertService.showAlert({
            text: `User logged in successfuly`,
            icon: 'success',
          });
        }, 100);
        this.activeModal.close();
        this.reloadComponent();
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        this.alertService.showAlert({
          text: `Login error`,
          icon: 'warning',
        });
      }, 100);
      this.loginForm.reset();
      this.activeModal.close();
    }
  }

  public cancel() {
    this.activeModal.close();
  }

  public register(event: Event) {
    event.preventDefault();
    this.activeModal.close();
    this.modalService.open(RegisterComponent);
  }

  public reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
