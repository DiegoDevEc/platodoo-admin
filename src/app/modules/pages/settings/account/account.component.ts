import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/services/api/user.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { User } from 'app/core/user/user.types';
import { Observable, timer, switchMap, map, of } from 'rxjs';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class SettingsAccountComponent implements OnInit {
    accountForm: UntypedFormGroup;
    originalEmail: string;
    originalPhone: string;
    originalUsername: string;
    userId = this._localStorageService.getItem<User>('user')?.id;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private _userService: UserService,
        private _localStorageService: LocalStorageService) {
        this.accountForm = this._formBuilder.group({
            firstName: [''],
            lastName: [''],
            username: [''],
            email: ['', Validators.email, [this.emailValidator()]],
            phone: ['', Validators.required, [this.phoneValidator()]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._userService.getUserById(this.userId).subscribe((user) => {
            this.accountForm.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phone
            });
            this.accountForm.updateValueAndValidity();
        }, (error) => {
            console.error('Error fetching user data:', error);
        });
    }

    updateAccount(): void {
        if (this.accountForm.valid) {
            console.log('Account form is valid. Submitting...');
            // Handle form submission logic here
            const updatedUser = {
                ...this.accountForm.value,
                id: this.userId
            };
            this._userService.updateUser(this.userId, updatedUser).subscribe(
                (response) => {
                    console.log('User updated successfully:', response);
                    // Optionally, you can show a success message or redirect the user
                },
                (error) => {
                    console.error('Error updating user:', error);
                    // Optionally, you can show an error message
                }
            );
        } else {
            console.log('Account form is invalid. Please check the fields.');
        }
    }

    emailValidator(): AsyncValidatorFn {

        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            // No validar si no cambió
            if (!control.dirty || control.value === this.originalEmail) {
                return of(null);
            }

            return timer(500).pipe(
                switchMap(() =>
                    this._userService.validateEmail(control.value, this.userId).pipe(
                        map(isAvailable => (isAvailable ? null : { emailTaken: true }))
                    )
                )
            );
        };
    }



    phoneValidator(): AsyncValidatorFn {

        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            // No validar si no cambió
            if (!control.dirty || control.value === this.originalPhone) {
                return of(null);
            }

            return timer(500).pipe(
                switchMap(() =>
                    this._userService.validatePhone(control.value, this.userId).pipe(
                        map(isAvailable => (isAvailable ? null : { phoneTaken: true }))
                    )
                )
            );
        };
    }

}
