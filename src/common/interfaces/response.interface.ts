/**
 * Response Interfaces - Chuẩn hóa response API
 */

export interface IResponseType<T = null> {
  message: string;
  data: T;
  statusCode: number;
  date: Date;
}

export interface IPaginationData<T = any> {
  items: T[];
  totalCount: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginationResponseType<T = any> {
  message: string;
  data: IPaginationData<T>;
  statusCode: number;
  date: Date;
}

// Before transform (dùng trong interceptor)
export interface IBeforeTransformResponseType<T> {
  type: 'response';
  message: string;
  data: T;
  statusCode?: number;
}

export interface IBeforeTransformPaginationResponseType<T> {
  type: 'pagination';
  message?: string;
  data: {
    items: T[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  };
  statusCode?: number;
}

