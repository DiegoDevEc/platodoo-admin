import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-password-strength',
    imports: [CommonModule, MatIconModule],
    templateUrl: './password-strength.component.html'
})
export class PasswordStrengthComponent {
    @Input() password: string = '';

  get hasMinLength(): boolean {
    return this.password.length >= 8;
  }

  get hasLetter(): boolean {
    return /[a-zA-Z]/.test(this.password);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  get hasSpecialChar(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
  }

  get strengthLevel(): number {
    let strength = 0;
    if (this.hasMinLength) strength++;
    if (this.hasLetter) strength++;
    if (this.hasNumber) strength++;
    if (this.hasSpecialChar) strength++;
    return strength;
  }

  get strengthText(): string {
    return this.strengthLevel <= 1 ? 'Débil' : this.strengthLevel < 4 ? 'Media' : 'Fuerte';
  }

  get strengthColor(): string {
    return this.strengthLevel <= 1 ? 'bg-red-500' : this.strengthLevel < 4 ? 'bg-yellow-500' : 'bg-green-600';
  }

  get textColor(): string {
    return this.strengthLevel <= 1 ? 'text-red-500' : this.strengthLevel < 4 ? 'text-yellow-600' : 'text-green-600';
  }

  get iconCheck(): string {
    return 'check';
  }

  get iconClose(): string {
    return 'close';
  }

}
