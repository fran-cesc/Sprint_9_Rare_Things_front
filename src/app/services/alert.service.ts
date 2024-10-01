import { Injectable } from '@angular/core';
import swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public showAlert(customSwalOptions: any){
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
        popup: 'swal-center-text'  // Apply custom class to the popup
      },
      didOpen: () => {
        // Manually handle clicks outside the toast
        document.addEventListener('click', (e: any) => {
          const swalContainer = swal.getPopup();
          if (swalContainer && !swalContainer.contains(e.target)) {
            swal.close(); // Close the toast if the click is outside the toast
          }
        });
      }
    };

    const swalOptions = Object.assign({}, defaultSwalOptions, customSwalOptions);  // Merge default and custom options
    swal.fire(swalOptions);
  }
}
