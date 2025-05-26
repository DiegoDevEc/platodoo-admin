import { MatIconModule } from '@angular/material/icon';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DynamicField } from './dynamic-field';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dynamic-add-dialog',
    imports: [MatDialogModule,
        CommonModule,
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
export class DynamicAddDialogComponent implements OnInit {
    form!: FormGroup;

    constructor(
        private dialogRef: MatDialogRef<DynamicAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; fields: DynamicField[] }
    ) {}

    ngOnInit(): void {
        console.log('DynamicAddDialogComponent initialized with data:', this.data);

        const group: { [key: string]: FormControl } = {};

        this.data.fields.forEach(field => {
            const validators = [];

            if (field.required) {
                validators.push(Validators.required);
            }

            if (field.validators) {
                validators.push(...field.validators);
            }

            group[field.name] = new FormControl(field.value || '', validators);
        });

        this.form = new FormGroup(group);
    }

    submit(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
