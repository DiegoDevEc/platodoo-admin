import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-dynamic-add-dialog',
    imports: [MatDialogModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatChipsModule,
        MatDatepickerModule,
    ],
    templateUrl: './dynamic-add-dialog.component.html',
})
export class DynamicAddDialogComponent {

    formFieldHelpers: string[] = [''];

    fixedSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInput: FormControl = new FormControl('', [
        Validators.required,
    ]);
    fixedSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);
    dynamicSubscriptInputWithHint: FormControl = new FormControl('', [
        Validators.required,
    ]);
    constructor(
        private dialogRef: MatDialogRef<DynamicAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    submit(): void {
        // Aquí podrías emitir un formulario o datos simulados
        this.dialogRef.close({ success: true });
    }

    onCancel(): void {
        console.log('Formulario cancelado');
        // Aquí podrías cerrar un diálogo, limpiar el formulario, etc.
    }

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }
}
