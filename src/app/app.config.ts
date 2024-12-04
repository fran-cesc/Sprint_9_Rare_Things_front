import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { userInterceptor } from './interceptors/user-interceptor.interceptor';
import { userLoggedGuard } from './guards/user.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([userInterceptor])),
    NgbActiveModal,
    { provide: userLoggedGuard, useValue: userLoggedGuard }
  ]
};
