import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { TodosService } from '../../services/todos.service';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Todo } from '../../../shared/interfaces/todo.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule, RouterModule, MatInputModule, MatButtonModule, MatCardModule, CommonModule,MatSelectModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent implements AfterViewInit {
  private readonly dialogRef = inject(MatDialogRef<TodoFormComponent>);
  private readonly snackbar = inject(MatSnackBar);
  protected readonly isSubmitting = signal(false);
  private readonly todosService = inject(TodosService);
  
  private readonly fb = inject(FormBuilder);

  protected readonly todoId = signal<number | undefined>(undefined);

  private readonly payload = inject(MAT_DIALOG_DATA) as { todoId: number };

  public readonly todoForm = signal(
    this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate:['',Validators.required],
      isCompleted:['',Validators.required]
    })
  );

  constructor() {
    this.todoId.set(this.payload.todoId);
  }

   ngAfterViewInit(){
    if (this.todoId()){
      this.todosService.getOneTodo(this.todoId() ?? 0).subscribe((data:Todo)=>{
        this.todoForm().controls['title'].setValue(data.title);
        this.todoForm().controls['description'].setValue(data.description);
        this.todoForm().controls['dueDate'].setValue(this.toLocalDatetimeInputValue(data.dueDate.toString()));
        this.todoForm().controls['isCompleted'].setValue(Number(data.isCompleted).toString());        
      })
    }
    else {
      this.todoForm().controls['isCompleted'].setValue('0');
    }
  }

  onSubmit() {
    if (this.todoForm().valid) {
      this.isSubmitting.set(true);

      if (!this.todoId()){ //Creating Todo
          this.todosService
        .createTodo(
          this.todoForm().get('title')!.value ?? '',
          this.todoForm().get('description')!.value ?? '',
          this.todoForm().get('dueDate')!.value ?? ''
                 )
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);  
            this.closeDialog('CREATED');  
            this.snackbar.open('TODO created successfully','Info',{
              duration:3000,
              panelClass:['snackbar-success']
            })        
          },
          error: (error: any) => {
            this.isSubmitting.set(false);
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
      }
      else { //Edit Todo
            this.todosService
        .updateTodo(
          this.todoId() ?? 0,
          this.todoForm().get('title')!.value ?? '',
          this.todoForm().get('description')!.value ?? '',
          this.todoForm().get('dueDate')!.value ?? '',
          this.todoForm().get('isCompleted')!.value == '1' ? true:false
        )
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);  
            this.closeDialog('UPDATED'); 
            this.snackbar.open('TODO updated successfully','Info',{
              duration:3000,
              panelClass:['snackbar-success']
            })         
          },
          error: (error: any) => {
            this.isSubmitting.set(false);
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
      }
      
    }
  }
  closeDialog(resp: string | null = null) {
    this.dialogRef.close(resp);
  }

  toLocalDatetimeInputValue(isoString: string): string {
   const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
   const local = new Date(date.getTime() - offset * 60 * 1000);
   return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }
}
