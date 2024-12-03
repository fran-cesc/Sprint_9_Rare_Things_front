import { HttpInterceptorFn } from '@angular/common/http';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  const protectedUrls = ['pages/user/:user_id'];
  const isProtectedUrl = protectedUrls.some( url => req.url.includes(url));
  const token = localStorage.getItem('token');

  if(isProtectedUrl && token){
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
