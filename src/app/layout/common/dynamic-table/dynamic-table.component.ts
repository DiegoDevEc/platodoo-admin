import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
    Component,
    Input,
    ViewChild,
    ContentChild,
    TemplateRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CustomMatPaginatorIntl } from './custom-paginator-intl';
import { MatDialog } from '@angular/material/dialog';
import { DynamicAddDialogComponent } from './dynamic-add-dialog/dynamic-add-dialog.component';
import { DynamicTableContext } from './dynamic-table-context';

@Component({
    selector: 'app-dynamic-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dynamic-table.component.html',
    imports: [
        CommonModule,
        MatPaginator,
        MatButtonModule,
        MatIcon,
        MatChipsModule,
        MatSortModule,
        MatFormFieldModule,
        MatTableModule,
        MatInputModule,
    ],
    providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
    standalone: true,
})
export class DynamicTableComponent {
    @Input() context!: DynamicTableContext<any>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) matSort!: MatSort;
    @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;

    displayedColumns: string[] = [];

    constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.displayedColumns = [...this.context.columns];
        this.displayedColumns.push('actions');
        if (this.context.onUpdate || this.context.onDelete) {
        }
    }

    onCreate(): void {
        const dialogRef = this.dialog.open(DynamicAddDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            height: 'auto',
            maxHeight: '95vh',
            autoFocus: false,
            panelClass: 'custom-dialog-container',
            data: {
                title: `Crear ${this.context.title}`,
                fields: this.context.getFormFields()
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.context.onCreate(result);
                this.context.getDataComponent();
            }
        });
    }

    onFilter(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.context.filterEvent(value);
    }

    onEdit(row: any): void {
        const idRow = row.id;

        const dialogRef = this.dialog.open(DynamicAddDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            height: 'auto',
            maxHeight: '95vh',
            autoFocus: false,
            panelClass: 'custom-dialog-container',
            data: {
                title: `Editar ${this.context.title}`,
                fields: this.context.getFormFields(row)
            }
        });
        dialogRef.afterClosed().subscribe(result => {

            result.id = idRow;

            if (result) {
                this.context.onUpdate(result);
                this.context.getDataComponent();
            }
        });
    }

    onDelete(row: any): void {
        this.context.onDelete(row);
    }

    onPageChange(event: any): void {
        this.context.pageEvent(event);
    }

    toggleSort(field: string): void {
        if (this.context.sortField === field) {
            this.context.sortDirection = this.context.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.context.sortField = field;
            this.context.sortDirection = 'asc';
        }

        this.context.sortListEvent({ active: this.context.sortField, direction: this.context.sortDirection });
    }
}
