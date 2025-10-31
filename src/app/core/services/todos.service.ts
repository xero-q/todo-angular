import { inject, Injectable } from '@angular/core';
import environment from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination, Todo } from '../../shared/interfaces/todo.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private apiUrl = environment.API_URL;
  private httpClient = inject(HttpClient);

  getPaginated(pageSize = 10,pageNumber = 1,filterByTitle?:string,filterByDescription?:string,filterByIsCompleted?:number):Observable<Pagination<Todo>>{
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageNumber', pageNumber);

    if (filterByTitle) {
      params = params.set('filterByTitle', filterByTitle);
    }
    if (filterByDescription) {
      params = params.set('filterByDescription', filterByDescription);
    }
    if (filterByIsCompleted !== undefined && filterByIsCompleted !== null) {
      params = params.set('filterByIsCompleted', filterByIsCompleted);
    }
   

    return this.httpClient.get<Pagination<Todo>>(`${this.apiUrl}/todos`, { params });
  }

  getOneTodo(todoId: number):Observable<Todo>{
      return this.httpClient.get<Todo>(`${this.apiUrl}/todos/${todoId}`);
  }

  createTodo(title:string,description:string,dueDate:string):Observable<Todo>{
    const payload = {
      title,
      description,
      dueDate    
    };
    
    return this.httpClient.post<Todo>(`${this.apiUrl}/todos`,payload);
  }

   deleteTodo(todoId: number) {
      return this.httpClient.delete(`${this.apiUrl}/todos/${todoId}`);
  }

  updateTodo(todoId: number,title:string,description:string,dueDate:string,isCompleted:boolean):Observable<Todo>{
    const payload = {      
      title,
      description,
      dueDate,
      isCompleted
    };
    
    return this.httpClient.put<Todo>(`${this.apiUrl}/todos/${todoId}`,payload);
  }
  
}
