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
      color: '#6C7293',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true,
      confirmButtonColor: '#EB1616',
      showConfirmButton: true,
    };

    const swalOptions = Object.assign({}, defaultSwalOptions, customSwalOptions);  // Merge default and custom options
    swal.fire(swalOptions);
  }
}
