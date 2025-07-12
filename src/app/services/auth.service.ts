import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { IntUserData } from '../auth/user.model';
export interface AuthResponseData {
    // kind: string;
    // token: string;
    token: string;
    email: string;
    storeName: string
    // refreshToken: string;
    // expiresIn: string;
    // localId: string;
    // registered?: boolean;
}
@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) { }

    users = localStorage.getItem('users') || '';
    user = new BehaviorSubject<IntUserData | null>(null);
    objUsers: any;
    private tokenExpirationTimer: any;

    getUsers() {
        this.http
            .get('http://localhost:3000/users')
            .subscribe((res) => (this.objUsers = res));
    }

    signup(form: any) {
        const email = form.email;
        const password = form.inputPassword;
        console.log(form);

        return this.http
            .post<AuthResponseData>(
                environment.API_EndPoint + 'auth/signUp',
                {
                    ...form,
                    email,
                    password,
                }
            )
            .pipe(
                catchError(this.handleError),
                tap((resData: any) => {
                    console.log(resData);

                    this.handleAuth(
                        resData.userData.email,
                        resData.userData.localId,
                        resData.userData.token,
                        resData?.userData?.storeName
                        // +resData.expiresIn
                    );
                })
            );
    }

    private handleError(errorResponse: HttpErrorResponse) {

        let errorMessage = 'An unknown error occured!'
        console.log(errorResponse);

        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage)
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email address is already in use!'
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
        storeName: string
    ) {
        const userDetails = new IntUserData(email, userId, token, storeName);
        this.user.next(userDetails);
        localStorage.setItem('loggedData', JSON.stringify(userDetails));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                environment.API_EndPoint + 'auth/login',
                {
                    email,
                    password,
                }
            )
            .pipe(
                catchError(this.handleError),
                tap((resData: any) => {
                    console.log(resData);

                    this.handleAuth(
                        resData.email,
                        resData.localId,
                        resData.token,
                        resData.storeName
                        // +resData.expiresIn
                    );
                    this.user.next(resData.token);
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
    }

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
            storeName: string
        } | null = loggedDataString ? JSON.parse(loggedDataString) : null;

        if (!loggedUserData) {
            return;
        }

        const loadedUser = new IntUserData(
            loggedUserData.email,
            loggedUserData.userId,
            loggedUserData._token,
            loggedUserData.storeName,
            // new Date(loggedUserData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            const expDuration =
                new Date(loggedUserData._tokenExpirationDate).getTime() -
                new Date().getTime();
            // this.autoLogout(expDuration);
            this.user.next(loadedUser);
        }
    }

    autoLogout(expireDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expireDuration);
    }

    checkAuthToken(): Observable<{ validUser: boolean }> {
        return this.http.get<{ validUser: boolean }>(
            environment.API_EndPoint + 'auth/checkAuth'
        ).pipe(
            catchError(this.handleAuthError)
        );
    }

    private handleAuthError = (error: any): Observable<{ validUser: boolean }> => {
        console.error('checkAuthToken error:', error);
        return of({ validUser: false });
    }



}
