import { DynamicField } from "./dynamic-add-dialog/dynamic-field";

export interface DynamicTableContext<T = any> {
  title: string;
  columns: string[];
  displayedColumns: string[];
  headers: Record<string, string>;
  dataTable: T[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortDirection: string;
  loading: boolean;

  getDataComponent(): void;
  onUpdate(row: T): void;
  onCreate(row: T): void;
  onDelete(row: T): void;
  filterEvent(value: string): void;
  pageEvent(event: any): void;
  sortListEvent(event: any): void;

  getFormFields(row?: T): DynamicField[];
}
