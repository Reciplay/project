export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface PagePayload<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface PaginationResponse<T> {
  status: string;
  message: string;
  data: PagePayload<T>;
}
