import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class UsersComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // Datos Tabla
    loading = true;
    dataTable: any[] = [];
    columns = ['username', 'email', 'phone', 'firstName', 'lastName'];
    totalItems = 0;
    pageIndex = 0;
    pageSize = 0;

    // Encabezados legibles
    headers = {
        username: 'Usuario',
        email: 'Correo',
        phone: 'Teléfono',
        firstName: 'Nombre',
        lastName: 'Apellido'
    };

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
        private _apiServiceUser: UserService
    ) { }
    ngOnInit(): void {
        this.getUsers();
    }

    getUsers(): void {
        this.loading = true;

        this._apiServiceUser.getUsers(0, 5, 'username', '')
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
    editar(row: any): void {
        console.log('Editar:', row);
    }

    delete(row: any): void {
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

    filtrar(valor: string): void {
        console.log('Filtro:', valor);
    }

    paginar(event: any): void {
        console.log('Paginación:', event);
    }

    ordenar(event: any): void {
        console.log('Ordenamiento:', event);
    }

}

