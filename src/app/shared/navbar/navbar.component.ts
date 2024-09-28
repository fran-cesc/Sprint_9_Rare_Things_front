import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddThingComponent } from '../../components/addThing/addThing.component';
import { UsersService } from '../../services/users.service';
import { RegisterComponent } from '../../components/register/register.component';
import { LoginComponent } from '../../components/login/login.component';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  public currentUser?: User | null
  public router = inject(Router);
  private modalService = inject(NgbModal);
  private userService = inject(UsersService)

  constructor(){

    this.userService.user$.subscribe( (user) => {
    this.currentUser = user;
   })
  }

  addThing(){
    const modalRef = this.modalService.open(AddThingComponent);
  }

  open(event: Event){
    const id = (event.target as HTMLButtonElement).id;
    if (id === 'register') {
      const modalRef = this.modalService.open(RegisterComponent);
    } else if (id === 'login'){
      const modalRef = this.modalService.open(LoginComponent);
    } else return;
  }

  public logout(){
    localStorage.removeItem('token');
    this.userService.user = null;
    this.router.navigate(['pages/home']);
    alert('You have been logged out');
  }
}
