import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { ValidatorsService } from '../../services/validators.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {

  public isRegistered!: boolean;

  activeModal = inject(NgbActiveModal);
  usersService = inject(UsersService);
  customValidators = inject(ValidatorsService);
  router = inject(Router);
  userForm: FormGroup;

  constructor(){
    this.userForm = new FormGroup({
      user_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
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

    const userMail = await this.userForm.get('email')!.value;
    console.log("register.ts 1");
    console.log(userMail);
    // const userName = await this.this.userForm.get('user_name')!.value;

    this.isRegistered = await this.usersService.isMailRegistered(userMail);
    console.log("register.ts 2");
    console.log(this.isRegistered);

    if (this.isRegistered) {
      alert("email is already registered");
      this.userForm.reset();
      this.activeModal.close();
      return;
    }

    await this.usersService.register(this.userForm.value);
    const response = await this.usersService.login(this.userForm.value);

    if (!response.error) {
      localStorage.setItem('token', response.accessToken);
      this.userForm.reset();
      alert("User registered");
      this.activeModal.close();
      // this.router.navigate(['/welcome']);
    }
    }
    catch (error){
    throw error;
    }
  }
}

