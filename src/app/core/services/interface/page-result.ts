export interface PageResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
}
