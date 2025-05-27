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
import { MatSnackBar } from '@angular/material/snack-bar'; // Agrega este import
import { DynamicTableContext } from 'app/layout/common/dynamic-table/dynamic-table-context';
import { DynamicField } from 'app/layout/common/dynamic-table/dynamic-add-dialog/dynamic-field';
import { emailValidator, phoneValidator } from 'app/core/validators/user-validators';
import { Validators } from '@angular/forms';

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


    title: string = 'Usuarios';
    columns = ['id', 'roles', 'username', 'firstName', 'lastName', 'email', 'phone', 'status', 'platform'];
    displayedColumns = ['username', 'firstName', 'lastName', 'email', 'phone', 'status', 'platform', 'actions'];

    // Encabezados legibles
    headers = {
        username: 'Usuario',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo',
        phone: 'Teléfono',
        status: 'Estado',
        platform: 'Plataforma'
    };

    dataTable: any[] = [];
    totalItems = 0;
    pageIndex = 0;
    pageSize = 5;
    sortField = 'username';
    sortDirection = 'asc';
    loading = true;

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _apiServiceUser: UserService,
        private _snackBar: MatSnackBar
    ) { }

    getFormFields(row?: User): DynamicField[] {
        console.log('Roles cargados:', row?.roles);
        return [
            { name: 'firstName', label: 'Nombre', type: 'text', value: row?.firstName },
            { name: 'lastName', label: 'Apellido', type: 'text', value: row?.lastName },
            { name: 'username', label: 'Usuario', type: 'text', required: true, value: row?.username },
            {
                name: 'email',
                label: 'Correo',
                type: 'email',
                required: true,
                value: row?.email,
                validators: [Validators.email],
                asyncValidators: [
                    emailValidator(this._apiServiceUser, row?.id ?? '', row?.email)
                ]
            },
            {
                name: 'phone',
                label: 'Teléfono',
                type: 'text',
                value: row?.phone,
                required: true,
                asyncValidators: [
                    phoneValidator(this._apiServiceUser, row?.id ?? '', row?.phone)
                ]
            },
            {
                name: 'status',
                label: 'Activo',
                type: 'slide-toggle',
                value: row?.status == undefined ? true : row?.status == 'ACT' ? true : false,
            },
            {
                name: 'roles',
                label: 'Roles',
                type: 'checkbox-group',
                options: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'],
                value: row?.roles || [] // debe ser un array de strings
            }
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
                    this._snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
                }
            });
    }

    onCreate(user: User): void {
        this._apiServiceUser.signUp(user).subscribe({
            next: () => {
                this._snackBar.open('Usuario creado', 'Cerrar', { duration: 3000 });
                this.getDataComponent();
            },
            error: () => {
                this._snackBar.open('Error al crear usuario', 'Cerrar', { duration: 3000 });
            }
        });
    }

    // Acciones
    onUpdate(user: User): void {
        this._apiServiceUser.updateUser(user.id, user).subscribe({
            next: () => {
                this._snackBar.open('Usuario actualizado', 'Cerrar', { duration: 3000 });
                this.getDataComponent();
            },
            error: () => {
                this._snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
            }
        });
    }

    onDelete(row: User): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Inhabilitar Usuario',
            message: '¿Seguro que quieres Inhabilitar este registro?',
            actions: { confirm: { label: 'Inhabilitar' } },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // Suponiendo que tienes un método deleteUser en tu servicio
                this._apiServiceUser.deleteUser(row.id).subscribe({
                    next: () => {
                        this._snackBar.open('Usuario Inhabilitado', 'Cerrar', { duration: 3000 });
                        this.getDataComponent();
                    },
                    error: () => {
                        this._snackBar.open('Error al Inhabilitar usuario', 'Cerrar', { duration: 3000 });
                    }
                });
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
        this.getDataComponent();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}

