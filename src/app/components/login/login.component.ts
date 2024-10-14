import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { ValidatorsService } from '../../services/validators.service';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { LoginResponse, User, UserLoginForm } from '../../interfaces/user.interface';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
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

  userForm: FormGroup;

  constructor(){
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(this.customValidators.emailPattern)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })

  }

  public isValidField(field: string){
    return this.customValidators.isValidField(this.userForm, field);
  }

  public getFieldError(form: FormGroup, field: string){
    return this.customValidators.getFieldError(this.userForm, field);
  }

  public async onSubmit(){
    try{

      if (this.userForm.invalid){
        return;
      }

      const response: LoginResponse = await this.usersService.login(this.userForm.value);
      console.log('response: ', response);

      if (response.token) {
        localStorage.setItem('token', response.token);
        this.usersService.user = (response.results[0]);
        this.userForm.reset();
        setTimeout(() => {
          this.alertService.showAlert({
            text: `User logged in successfuly`,
            icon: 'success',
          });
        }, 100);
        this.activeModal.close();
        // this.reloadComponent();
      } else {
        setTimeout(() => {
          this.alertService.showAlert({
            text: `Login error`,
            icon: 'warning',
          });
        }, 100);
        this.userForm.reset();
        this.activeModal.close();
      }
    }
    catch (error){
      console.log(error);
      setTimeout(() => {
        this.alertService.showAlert({
          text: `Login error`,
          icon: 'warning',
        });
      }, 100);
      this.userForm.reset();
      this.activeModal.close();
    }
  }

  public cancel(){
    this.activeModal.close();
  }

  public register(event: Event){
    event.preventDefault();
    this.activeModal.close();
    this.modalService.open(RegisterComponent);
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    })
  }

}
