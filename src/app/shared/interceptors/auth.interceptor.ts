import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  catchError,
  Observable,
  throwError,
} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    // Exclude login and signup
    const excludedUrls = ['/auth/login','/auth/signup'];

    // If request URL includes one of the excluded URLs, skip adding the token
    const shouldExclude = excludedUrls.some((url) => req.url.includes(url));

   const clonedReq = token && !shouldExclude
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : req;

      return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Automatically logout user
          this.authService.logout();
        }

        // Re-throw the error so components can still handle it if needed
        return throwError(() => error);
      })
    );
  }
  
}
