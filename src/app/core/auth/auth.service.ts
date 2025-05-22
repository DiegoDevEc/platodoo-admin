import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _apiUrl = environment.apiUrl; // ✅ Usa la URL del environment

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/auth/forgot-password`, { email });
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/auth/reset-password`, { password });
    }

    signIn(credentials: { email: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError(() => new Error('User is already logged in.'));
        }
        // Concatenar plataforma al email como "email|PLATFORM"
        const payload = {
            email: `${credentials.email}|${environment.platform}`,
            password: credentials.password
        };

        return this._httpClient.post(`${this._apiUrl}/api/auth/sign-in`, payload).pipe(
            switchMap((response: any) => {
                this.accessToken = response.accessToken;
                this._authenticated = true;
                this._userService.user = response.user;
                return of(response);
            })
        );
    }

    signInUsingToken(): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/api/auth/sign-in-with-token`, { accessToken: this.accessToken }).pipe(
            catchError(() => of(false)),
            switchMap((response: any) => {
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }
                this._authenticated = true;
                this._userService.user = response.user;
                return of(true);
            })
        );
    }

    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }

    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/auth/sign-up`, user);
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/auth/unlock-session`, credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) return of(true);
        if (!this.accessToken || AuthUtils.isTokenExpired(this.accessToken)) return of(false);
        return this.signInUsingToken();
    }
}
