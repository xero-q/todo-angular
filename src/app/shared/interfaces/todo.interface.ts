export interface Todo {
    todoId:number;
    title:string;
    description:string;
    dueDate:Date;
    isCompleted:boolean;
}

export interface Pagination<T> {
    currentPage:number;
    pageSize:number;
    totalItems:number;
    totalPages:number;
    result:T[];    
}

