import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private modalService = inject(NgbModal);

  constructor() {}

  public showAlert(customSwalOptions: any) {
    // Alert template with default parameters
    const defaultSwalOptions = {
      background: '#191C24',
      color: '#ffffff',
      toast: true,
      showConfirmButton: false,
      confirmButtonText: 'ok',
      confirmButtonColor: '#EB1616',
      timer: 3000,
      timerProgressBar: true,
      position: 'center',
      customClass: {
        popup: 'swal-center-text',
      },
      didOpen: () => {
        document.addEventListener('click', (e: any) => {
          const swalContainer = swal.getPopup();
          if (swalContainer && !swalContainer.contains(e.target)) {
            swal.close(); // Close the toast if the click is outside the toast
          }
        });
      },
    };

    const swalOptions = Object.assign(
      {},
      defaultSwalOptions,
      customSwalOptions
    ); // Merge default and custom parameters
    swal.fire(swalOptions);
  }

  public showYouMustBeLoggedAlert() {
    swal
      .fire({
        icon: 'warning',
        background: '#191C24',
        color: '#ffffff',
        toast: true,
        text: 'You must be logged in to vote',
        confirmButtonText: 'Login',
        confirmButtonColor: '#EB1616',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.modalService.open(LoginComponent);
        }
      });
  }
}
