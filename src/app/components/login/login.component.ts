import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { ValidatorsService } from '../../services/validators.service';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { User } from '../../interfaces/user';

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
      const response: any = await this.usersService.login(this.userForm.value);
      if (!response.error) {
        localStorage.setItem('token', response.token);
        this.usersService.currentUser.set(response.results[0]);
        this.userForm.reset();
        alert("User logged in successfuly");
        this.activeModal.close();
        this.router.navigate(['/home']);
      }
    }
    catch (error){
      console.log(error);
      alert("Incorrect email or password");
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

}
