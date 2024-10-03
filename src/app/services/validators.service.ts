import { Injectable } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      if (key === 'required') {
        return 'This field is required';
      } else if (key === 'minlength') {
        return `This field must be ${errors['minlength'].requiredLength} caracters minimum`;
      } else if (key === 'pattern') {
        return 'Please, enter a valid email';
      }
    }

    return null;
  }
}
