import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { User } from '../models/User.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { JwtHelperService } from '@auth0/angular-jwt';

import { LoginResponse } from '../models/loginResponse.interface';
import { Login } from '../models/login.interface';
import { Hometown } from '../models/usersHometown';
import { HometownResponse } from '../models/hometownResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000';

  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  username: string | undefined;
  jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    let token = localStorage.getItem('token');
    return token ? token : '';
  }

  signup(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.url}/user/signup`, user)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>('signup'))
      );
  }

  login(userLogin: Login): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.url}/user/login`, userLogin)
      .pipe(
        first(),
        tap((tokenObject: { token: string; username: string }) => {
          localStorage.setItem('username', tokenObject.username);
          localStorage.setItem('token', tokenObject.token);
          this.isUserLoggedIn.next(true);
        }),
        catchError(this.errorHandlerService.handleError<LoginResponse>('login'))
      );
  }

  userSelectLocation(hometown: Hometown): Observable<HometownResponse> {
    return this.http
      .post<HometownResponse>(`${this.url}/user/hometown`, hometown)
      .pipe(
        first(),
        catchError(
          this.errorHandlerService.handleError<HometownResponse>('hometown')
        )
      );
  }
}
