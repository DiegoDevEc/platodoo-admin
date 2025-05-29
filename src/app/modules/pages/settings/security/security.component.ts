import { User } from './../../../../core/user/user.types';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'app/core/services/api/user.service';
import { UserPasswordUpdateRequest } from 'app/core/services/interface/user-password-update-request';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { PasswordStrengthComponent } from 'app/layout/common/password-strength/password-strength.component';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        CommonModule,
        PasswordStrengthComponent
    ],
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: UntypedFormGroup;
    userId = this._localStorageService.getItem<User>('user')?.id;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private _userService: UserService,
        private _localStorageService: LocalStorageService,
        private _router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword: [''],
            newPassword: ['', [Validators.required, this.passwordMatchValidator()]],
            confirmPassword: ['', [Validators.required]],
            twoStep: [true],
            askPasswordChange: [false],
        }, {
            validators: this.passwordMatchValidator() // Aquí se agrega el validador de grupo
        });
    }

    passwordMatchValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const newPassword = group.get('newPassword')?.value;
            const confirmPassword = group.get('confirmPassword')?.value;

            return newPassword === confirmPassword ? null : { passwordsDoNotMatch: true };
        };
    }

    onSubmit(): void {

        if (this.securityForm.value.currentPassword === this.securityForm.value.newPassword) {
            console.log('Form is invalid ERROR:', this.securityForm.errors);
            this._snackBar.open('La nueva contraseña no puede ser igual a la actual.', 'Cerrar', {
                duration: 3000,
                panelClass: ['mat-toolbar', 'mat-warn']
            });
            return;
        }

        if (this.securityForm.value.newPassword !== this.securityForm.value.confirmPassword) {
            this._snackBar.open('La nueva contraseña debe coincidir con la confirmación.', 'Cerrar', {
                duration: 3000,
                panelClass: ['mat-toolbar', 'mat-warn']
            });
            return;
        }

        this.securityForm.value.newPassword = this.securityForm.value.newPassword.trim();

        if (this.securityForm.valid) {

            const userPasswordUpdateRequest: UserPasswordUpdateRequest = {
                userId: this.userId, // Replace with actual user ID
                newPassword: this.securityForm.value.currentPassword,
                oldPassword: this.securityForm.value.newPassword
            }

            this._userService.updateUserSecuritySettings(userPasswordUpdateRequest)
                .subscribe({
                    next: (response) => {
                        this._snackBar.open('Configuración de seguridad actualizada correctamente.', 'Cerrar', {
                            duration: 3000,
                            panelClass: ['mat-toolbar', 'mat-primary']
                        });
                    },
                    error: (error) => {
                        this._snackBar.open('Error al actualizar la configuración de seguridad.', 'Cerrar', {
                            duration: 3000,
                            panelClass: ['mat-toolbar', 'mat-warn']
                        });
                    }
                });
        } else {
            this._snackBar.open('Error por favor revise los campos.', 'Cerrar', {
                duration: 3000,
                panelClass: ['mat-toolbar', 'mat-warn']
            });
        }
    }

    cancel(){
        this._router.navigate(['/dashboard']);
    }

    get newPassword(): string {
        return this.securityForm.get('newPassword')?.value || '';
    }

    get hasMinLength(): boolean {
        return this.newPassword.length >= 8;
    }

    get hasLetter(): boolean {
        return /[a-zA-Z]/.test(this.newPassword);
    }

    get hasNumber(): boolean {
        return /[0-9]/.test(this.newPassword);
    }

    get hasSpecialChar(): boolean {
        return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
    }

    get allValid(): boolean {
        return this.hasMinLength && this.hasLetter && this.hasNumber && this.hasSpecialChar;
    }

    passwordStrengthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return { passwordStrength: true };

            const hasMinLength = value.length >= 8;
            const hasLetter = /[a-zA-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            const valid = hasMinLength && hasLetter && hasNumber && hasSpecialChar;

            return valid ? null : { passwordStrength: true };
        };
    }

    get passwordStrengthLevel(): number {
        let strength = 0;
        const password = this.newPassword;

        if (password.length >= 8) strength++;
        if (/[a-zA-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        return strength;
    }

    get passwordStrengthText(): string {
        const level = this.passwordStrengthLevel;

        if (level <= 1) return 'Débil';
        if (level === 2 || level === 3) return 'Media';
        return 'Fuerte';
    }

    get passwordStrengthColor(): string {
        const level = this.passwordStrengthLevel;

        if (level <= 1) return 'bg-red-500';
        if (level === 2 || level === 3) return 'bg-yellow-500';
        return 'bg-green-600';
    }


}
