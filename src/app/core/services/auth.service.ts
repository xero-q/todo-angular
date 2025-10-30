import { inject, Injectable } from '@angular/core';
import environment from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  login(username: string, password: string) {
    const payload = {
      username,
      password,
    };

    return this.httpClient.post(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((response: any) => {
        localStorage.setItem('user', username);
        this.saveTokens(response.access);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  signup(
    username: string,
    password: string
  ) {
    const payload = {
      username,
      password,
    };

    return this.httpClient.post(`${this.apiUrl}/auth/signup`, payload);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  saveTokens(access: string) {
    localStorage.setItem('access_token', access);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
