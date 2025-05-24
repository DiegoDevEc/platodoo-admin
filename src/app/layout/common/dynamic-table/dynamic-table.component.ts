import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CustomMatPaginatorIntl } from './custom-paginator-intl';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DynamicAddDialogComponent } from './dynamic-add-dialog/dynamic-add-dialog.component';

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
    MatSort,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  standalone: true,
})
export class DynamicTableComponent implements OnInit, OnChanges {
  @Input() title: string = 'Lista';
  @Input() columns: string[] = [];
  @Input() headers: { [key: string]: string } = {};
  @Input() data: any[] = [];
  @Input() showActions: boolean = false;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() sortField: string = '';
  @Input() sortDirection: string = 'asc';
  @Input() loading: boolean = false;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() filter = new EventEmitter<string>();
  @Output() page = new EventEmitter<any>();
  @Output() sort = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;

  displayedColumns: string[] = [];

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.displayedColumns = [...this.columns];
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
  }

openAddDialog(): void {
const dialogRef = this.dialog.open(DynamicAddDialogComponent, {
  width: '800px',
  maxWidth: '95vw',
  height: 'auto',
  maxHeight: '95vh',
  autoFocus: false,
  panelClass: 'custom-dialog-container',
  data: {
    title: 'Agregar nuevo elemento',
    description: 'Aquí puedes implementar un formulario dinámico según el módulo.'
  }
});

  dialogRef.afterClosed().subscribe(result => {
    if (result?.success) {
      // Refrescar la tabla, notificar, etc.
      console.log('Elemento agregado con éxito');
    }
  });
}

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.markForCheck();
  }

  onFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filter.emit(value);
  }

  onEdit(row: any): void {
    this.edit.emit(row);
  }

  onDelete(row: any): void {
    this.delete.emit(row);
  }

  onPageChange(event: any): void {
    this.page.emit(event);
  }

  onSortChange(event: any): void {
    this.sort.emit(event);
  }
}
