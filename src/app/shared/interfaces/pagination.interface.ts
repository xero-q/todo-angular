export interface Pagination<T> {
    currentPage:number;
    pageSize:number;
    totalItems:number;
    totalPages:number;
    result:T[];    
}