import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { User } from '../models/User.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { FormGroup } from '@angular/forms';
import { LoginResponse } from '../models/loginResponse.interface';
import { Login } from '../models/login.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:3000';

  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  username: string | undefined;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  signup(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.url}/user/signup`, user)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>('signup'))
      );
  }

  login(userLogin: Login): Observable<LoginResponse> {
    // const reqBody: Login = {
    //   username: userLogin.username,
    //   password: userLogin.password,
    // };
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
}
