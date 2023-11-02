import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/enviroments/enviroments';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { IntUserData } from './user.model';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }
  users = localStorage.getItem('users') || '';
  user = new BehaviorSubject<IntUserData | null>(null);
  objUsers: any;
  getUsers() {
    this.http
      .get('http://localhost:3000/users')
      .subscribe((res) => (this.objUsers = res));
  }
  signup(form: any) {
    const email = form.email;
    const password = form.inputPassword;
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        environment.API_KEY,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData: any) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }
  private handleError(errorResponse: HttpErrorResponse) {

    let errorMessage = 'An unknown error occured!'
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage)
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use!'
        break
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project!'
        break
      case 'INVALID_EMAIL':
        errorMessage = 'Please enter a valid email'
        break
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'user not found!'
        break
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password!'
        break
      case 'USER_DISABLED':
        errorMessage = 'User has been disabled'
        break
      default:
        errorMessage = errorResponse.error.error.message
    }

    if (errorResponse.error.error.message == 'INVALID_LOGIN_CREDENTIALS') {
      return throwError('Invalid Login Credentials!')
    }
    return throwError(errorMessage)

  }
  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expiresInDate = new Date(new Date().getTime() + expiresIn * 1000);
    const userDetails = new IntUserData(email, userId, token, expiresInDate);
    this.user.next(userDetails);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('loggedData', JSON.stringify(userDetails));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBsv9RRWMipsQbrgOvq16gClAraUZRZA3U',
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData: any) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          this.user.next(resData.idToken);
          this.router.navigate(['/admin']);
        })
      );
  }

  isLogged() {
    return localStorage.getItem('loggedData');
  }
  logout() {
    localStorage.removeItem('loggedData');
    this.user.next(null);
    this.router.navigate(['/login']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    // this.tokenExpirationTimer = null;
  }
  private tokenExpirationTimer: any;
  autoLogin() {
    if (this.tokenExpirationTimer <= 0) {
      localStorage.removeItem('loggedUser');
      this.router.navigate(['/login'])
      return;
    }
    const loggedDataString: string | null = localStorage.getItem('loggedData');
    const loggedUserData: {
      email: string;
      userId: string;
      _token: string;
      _tokenExpirationDate: string;
    } | null = loggedDataString ? JSON.parse(loggedDataString) : null;

    if (!loggedUserData) {
      return;
    }

    const loadedUser = new IntUserData(
      loggedUserData.email,
      loggedUserData.userId,
      loggedUserData._token,
      new Date(loggedUserData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      const expDuration =
        new Date(loggedUserData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expDuration);
      this.user.next(loadedUser);
    }
  }
  autoLogout(expireDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expireDuration);
  }
}
