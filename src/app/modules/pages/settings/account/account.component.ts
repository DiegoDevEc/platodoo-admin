import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'app/core/services/api/user.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { User } from 'app/core/user/user.types';
import { emailValidator, phoneValidator } from 'app/core/validators/user-validators';

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
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private _localStorageService: LocalStorageService,
        private _snackBar: MatSnackBar,
        private _router: Router
    ) {
        this.userId = this._localStorageService.getItem<User>('user')?.id;
        this.accountForm = this._formBuilder.group({
            firstName: [''],
            lastName: [''],
            username: [''],
            email: [
                '',
                [Validators.email],
                [emailValidator(this._userService, this.userId, this.originalEmail)]
            ],
            phone: [
                '',
                [Validators.required],
                [phoneValidator(this._userService, this.userId, this.originalPhone)]
            ]
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
            this.originalEmail = user.email;
            this.originalPhone = user.phone;
            this.accountForm.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phone
            });
            this.accountForm.get('email')?.updateValueAndValidity();
            this.accountForm.get('phone')?.updateValueAndValidity();
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
                    this._snackBar.open('Usuario actualizado', 'Cerrar', { duration: 3000 });
                },
                (error) => {
                    console.error('Error updating user:', error);
                    this._snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 });
                }
            );
        } else {
            console.log('Account form is invalid. Please check the fields.');
            this._snackBar.open('Error por favor revise los campos', 'Cerrar', { duration: 3000 });
        }
    }


    cancel(){
        this._router.navigate(['/dashboard']);
    }

}
