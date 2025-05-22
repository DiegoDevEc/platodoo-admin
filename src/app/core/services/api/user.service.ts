import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from 'app/core/user/user.types';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/api`;
    private platform = `${environment.platform}`;

    constructor(private http: HttpClient) { }

    updateUser(userId: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${userId}`, user);
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
    }

    validateEmail(email: string, userId: string): Observable<boolean> {
        const platform = this.platform;
        return this.http.get<boolean>(`${this.apiUrl}/auth/validate-existing-email`, { params: { email, userId, platform } });
    }

    validateUsername(username: string, userId: string): Observable<boolean> {
        const platform = this.platform;
        return this.http.get<boolean>(`${this.apiUrl}/auth/validate-existing-username`, { params: { username, userId, platform } });
    }

    validatePhone(phone: string, userId: string): Observable<boolean> {
        const platform = this.platform;
        return this.http.get<boolean>(`${this.apiUrl}/auth/validate-existing-phone`, { params: { phone, userId, platform } });
    }
}
