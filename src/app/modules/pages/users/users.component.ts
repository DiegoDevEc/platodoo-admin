import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/services/api/user.service';
import { DynamicTableComponent } from 'app/layout/common/dynamic-table/dynamic-table.component';
import { FullScreenLoadingComponent } from 'app/layout/common/full-screen-loading/full-screen-loading.component';
import { Subject } from 'rxjs';
import { PageResult } from '../../../core/services/interface/page-result';
import { User } from '../../../core/user/user.types';
import { takeUntil } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DynamicTableContext } from 'app/layout/common/dynamic-table/dynamic-table-context';
import { DynamicField } from 'app/layout/common/dynamic-table/dynamic-add-dialog/dynamic-field';

@Component({
    selector: 'app-users',
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatMenuModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatTooltipModule,
        DynamicTableComponent,
        FullScreenLoadingComponent],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy, DynamicTableContext<User> {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // Datos Tabla
    loading = true;
    dataTable: any[] = [];
    columns = ['username', 'firstName', 'lastName', 'email', 'phone'];
    totalItems = 0;
    pageIndex = 0;
    pageSize = 5;
    sortField = 'username';
    sortDirection = 'asc';

    // Encabezados legibles
    headers = {
        username: 'Usuario',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo',
        phone: 'Teléfono'
    };


    title: string = 'Usuarios';

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _apiServiceUser: UserService
    ) { }

    getFormFields(row?: User): DynamicField[] {
        return [
            { name: 'username', label: 'Usuario', type: 'text', required: true, value: row?.username },
            { name: 'email', label: 'Correo', type: 'email', required: true, value: row?.email },
            { name: 'firstName', label: 'Nombre', type: 'text', value: row?.firstName },
            { name: 'lastName', label: 'Apellido', type: 'text', value: row?.lastName },
            { name: 'phone', label: 'Teléfono', type: 'text', value: row?.phone }
        ];
    }

    ngOnInit(): void {
        this.getDataComponent();
    }

    getDataComponent(): void {
        this.loading = true;

        this._apiServiceUser.getUsers(this.pageIndex, this.pageSize, this.sortField, this.sortDirection)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response: PageResult<User>) => {
                    this.dataTable = [...response.content];
                    this.totalItems = response.totalElements;
                    this.pageIndex = response.page;
                    this.pageSize = response.size;
                    this.loading = false;
                },
                error: () => {
                    this.dataTable = [];
                    this.loading = false;
                }
            });
    }

    // Acciones
    onUpdate(row: User): void {
        console.log('Editar:', row);
    }

    onDelete(row: User): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Eliminar Usuario',
            message:
                '¿Seguro que quieres eliminar este registro?',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                console.log('Eliminar:', row);
                // Call the delete method from the service
                console.log(row.username);
            }
        });
    }

    filterEvent(valor: string): void {
        console.log('Filtro:', valor);
    }

    pageEvent(event: any): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getDataComponent();
    }

    sortListEvent(event: any): void {
        const sortField = event.active;
        const sortDirection = event.direction;
        this.getDataComponent();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}

