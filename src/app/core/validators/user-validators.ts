import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from '../services/api/user.service';

export function phoneValidator(
    userService: UserService,
    userId: string,
    originalPhone?: string
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.dirty || (originalPhone && control.value === originalPhone)) {
            return of(null);
        }
        return timer(500).pipe(
            switchMap(() =>
                userService.validatePhone(control.value, userId).pipe(
                    map(isAvailable => (isAvailable ? null : { phoneTaken: true }))
                )
            )
        );
    };
}

export function emailValidator(
    userService: UserService,
    userId: string,
    originalEmail?: string
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.dirty || (originalEmail && control.value === originalEmail)) {
            return of(null);
        }
        return timer(500).pipe(
            switchMap(() =>
                userService.validateEmail(control.value, userId).pipe(
                    map(isAvailable => (isAvailable ? null : { emailTaken: true }))
                )
            )
        );
    };
}
