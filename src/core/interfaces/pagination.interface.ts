export interface Pagination<T> {
  data: T,
  total: number,
  currentPage: number,
  nextPage: number,
  prevPage: number,
  lastPage: number,
}