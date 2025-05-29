// src/app/core/configs/user-columns.config.ts

export const USER_COLUMNS = [
  'id',
  'roles',
  'username',
  'firstName',
  'lastName',
  'email',
  'phone',
  'status',
  'platform'
];

export const USER_HEADERS: Record<string, string> = {
  id: 'ID',
  roles: 'Roles',
  username: 'Usuario',
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'Correo',
  phone: 'Teléfono',
  status: 'Estado',
  platform: 'Plataforma'
};

export const USER_DISPLAYED_COLUMNS = [
  'username',
  'firstName',
  'lastName',
  'email',
  'phone',
  'status',
  'platform',
  'actions'
];

export const USER_DEFAULT_PAGE_SIZE = 5;
export const USER_DEFAULT_SORT_FIELD = 'username';
export const USER_SEARCH_FIELD = '';
export const USER_DEFAULT_SORT_DIRECTION = 'asc';
export const USER_DEFAULT_PAGE_INDEX = 0;
export const USER_DEFAULT_LOADING = true;
export const USER_DEFAULT_TOTAL_ITEMS = 0;
export const USER_DEFAULT_DATA_TABLE: any[] = [];
export const USER_DEFAULT_TITLE = 'Usuarios';

export const USERS_ROLES = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'];
