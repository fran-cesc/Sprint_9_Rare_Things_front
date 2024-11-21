import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

import { AddThingComponent } from '../../components/addThing/addThing.component';
import { LoginComponent } from '../../components/login/login.component';
import { RegisterComponent } from '../../components/register/register.component';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public isUserLogged: boolean = false;
  public currentUser: User | undefined;
  public isNavbarCollapsed = true;
  public router = inject(Router);
  public usersService = inject(UsersService);
  private modalService = inject(NgbModal);
  private userService = inject(UsersService)

  constructor() {
    this.userService.isUserLogged().pipe(
      switchMap(isLogged => {
        this.isUserLogged = isLogged;
        if (isLogged) {
          return this.userService.user$;
        } else {
          return of(undefined);
        }
      })
    ).subscribe(user => {
      this.currentUser = user;
    });
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
    this.userService.logout();
  }

}
