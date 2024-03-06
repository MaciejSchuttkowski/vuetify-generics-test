export interface DocumentAPI {
  linkDocument: (value: number) => Promise<string>;
  uploadDocument: (value: File) => Promise<string>;
  unlinkDocument: (value: number) => Promise<string>;
}

export interface PaginatedRequest<T> {
  page: number;
  itemsPerPage: number;
  sortBy?: { key: string; order: 'desc' | 'asc' }[];
  id?: T;
  stateFilter?: 'aborted' | 'finished' | 'running';
  search?: string;
}

export interface PaginatedResponse<T> {
  items: Array<T>;
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedAPI<T, ID extends { id: T }> {
  fetch: (
    page: number,
    itemsPerPage: number,
    sort_columns?: { key: string; order: 'desc' | 'asc' }[],
    id?: ID,
    process_state?: 'aborted' | 'finished' | 'running',
    search?: string,
  ) => Promise<PaginatedResponse<T>>;
}
