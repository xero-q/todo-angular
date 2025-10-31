import { Component, inject, OnInit, signal } from '@angular/core';
import {  MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  TodosService } from '../../services/todos.service';
import { Pagination, Todo } from '../../../shared/interfaces/todo.interface';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
// import { PropertyFormComponent } from '../property-form/property-form.component';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todos',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    CommonModule, LoadingComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);
  private readonly todosService = inject(TodosService);
  protected readonly displayedColumns = ['todoId','title','description','dueDate','isCompleted','actions'];
  protected readonly dataSource = new MatTableDataSource<Todo>([]);

  totalItems = 0;
  pageSize = 10;
  pageNumber = 1;

  titleFilter = '';
  descriptionFilter = '';
  isCompletedFilter = '';

  protected readonly isLoading = signal(true);

  ngOnInit(){     
    this.loadData();   
  }

  loadData(){
    this.isLoading.set(true);  
    this.todosService.getPaginated(this.pageSize,this.pageNumber, this.titleFilter,this.descriptionFilter, this.isCompletedFilter ? Number(this.isCompletedFilter):undefined).subscribe((data:Pagination<Todo>)=>{
        this.totalItems = data.totalItems; 
        this.dataSource.data = data.result;
        this.isLoading.set(false);
    })
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1; 
    this.loadData();
  }

  applyFilters(){
      this.loadData();
  }

  resetFilters(){
    this.titleFilter = '';
    this.descriptionFilter = '';
    this.isCompletedFilter = '';
    this.loadData();
  }

  createTodo(){
    const data = {};
    
    let dialogRef = this.dialog.open(TodoFormComponent, {
      width: '25rem',
      height: 'auto',
      autoFocus: false,
      data,
      panelClass: 'no-padding-dialog'
    });

    dialogRef.updatePosition({ top: '100px' });
    dialogRef.afterClosed().subscribe((msg) => {
      if (msg) {
        this.loadData();
      }
    });
  }

  editTodo(todoId: number){
   const data = {todoId};
    
    let dialogRef = this.dialog.open(TodoFormComponent, {
      width: '25rem',
      height: 'auto',
      autoFocus: false,
      data,
      panelClass: 'no-padding-dialog'
    });

    dialogRef.updatePosition({ top: '100px' });
    dialogRef.afterClosed().subscribe((msg) => {
      if (msg) {
        this.loadData();
      }
    });
  }

  deleteTodo(todoId: number){
    if (confirm('Are you sure you want to delete this property?')){
      this.todosService.deleteTodo(todoId).subscribe({
          next: () => {
           this.snackbar.open('Property deleted successfully','Info',{
              duration:3000,
              panelClass:['snackbar-success']
            }) ; 
            this.loadData();      
          },
          error: (error: any) => {
            const messages = error.error.title ?? error.error.errors.request;
            let messagesString = '';
            if (Array.isArray(messages)) {
              messagesString = messages.join('\n');
            } else {
              messagesString = messages;
            }
            this.snackbar.open(`Error:${messagesString}`,'Error',{
              duration:3000,
              panelClass:['snackbar-error']
            })
          },
        });
    };
  } 

  // synchronizeProperty(id: number){
  //   this.domainEventsService.createDomainEvent(id,'CREATED','{data:[1,2,3]}').subscribe({
  //         next: () => {
  //          this.snackbar.open('Property synchronized successfully','Info',{
  //             duration:3000,
  //             panelClass:['snackbar-success']
  //           }) ;  
  //         },
  //         error: (error: any) => {
  //           const messages = error.error.title ?? error.error.errors.request;
  //           let messagesString = '';
  //           if (Array.isArray(messages)) {
  //             messagesString = messages.join('\n');
  //           } else {
  //             messagesString = messages;
  //           }
  //           this.snackbar.open(`Error:${messagesString}`,'Error',{
  //             duration:3000,
  //             panelClass:['snackbar-error']
  //           })
  //         },
  //       })
  // }
}
