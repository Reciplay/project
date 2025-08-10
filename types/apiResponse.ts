export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface PagePayload<T> {
  content: T[];
  page: number; // 0-base
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean; // 👈 추가
  hasPrevious?: boolean; // 👈 추가
}

export interface PaginationResponse<T> {
  status: string;
  message: string;
  data: PagePayload<T>;
}
