export default interface Paged<TData> {
  count: number;
  currPage: number;
  pages: number;
  perPage: number;
  data: TData[];
}