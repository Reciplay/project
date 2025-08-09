export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PaginationData<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export type PaginationResponse<T> = ApiResponse<PaginationData<T>>;
