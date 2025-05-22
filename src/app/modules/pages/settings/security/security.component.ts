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

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder) { }

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
            newPassword: ['', [Validators.required, this.passwordStrengthValidator()]],
            twoStep: [true],
            askPasswordChange: [false],
        });
    }

    onSubmit(): void {

        if(this.securityForm.value.currentPassword === this.securityForm.value.newPassword) {
            console.log('Form is invalid ERROR:', this.securityForm.errors);
            return;
        }

        this.securityForm.value.newPassword = this.securityForm.value.newPassword.trim();

        if (this.securityForm.valid) {
            // Handle form submission
            console.log('Form submitted OK:', this.securityForm.value);
        } else {
            // Handle form errors
            console.log('Form is invalid ERROR:', this.securityForm.errors);
        }
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
