import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { User } from '../models/User.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http//localhost:3000/user';
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  signup(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>('signup'))
      );
  }
}
