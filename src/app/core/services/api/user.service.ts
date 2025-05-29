import { UserPasswordUpdateRequest } from './../interface/user-password-update-request';
import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from 'app/core/user/user.types';
import { PageResult } from '../interface/page-result';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = `${environment.apiUrl}/api`;
    private platform = `${environment.platform}`;

    constructor(private http: HttpClient) { }

    getUsers(page: number, size: number, sortField: string, direction: string, search: string): Observable<PageResult<User>> {
        return this.http.get<PageResult<User>>(`${this.apiUrl}/users`, {
            params: {
                page: page.toString(),
                size: size.toString(),
                sortField,
                direction,
                search
            }
        });
    }

    updateUser(userId: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/users/${userId}`, user);
    }

    updateUserSecuritySettings(userPasswordUpdateRequest: UserPasswordUpdateRequest): Observable<Boolean> {
        return this.http.patch<Boolean>(`${this.apiUrl}/users/update-password`, userPasswordUpdateRequest);
    }

    deleteUser(userId: string): Observable<User> {
        return this.http.delete<User>(`${this.apiUrl}/users/${userId}`);
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
    }

    signUp(user: User){
        user.platform = environment.platform;
        user.password = 'admin123.';
        return this.http.post(`${this.apiUrl}/auth/sign-up`, user);
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
