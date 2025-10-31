import { Component, inject, OnInit, signal } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Todo } from '../../../shared/interfaces/todo.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";

@Component({
  selector: 'app-todo-detail',
  imports: [RouterModule,LoadingComponent, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, MatProgressSpinnerModule, CommonModule, LoadingComponent, RouterLink],
  templateUrl: './todo-detail.component.html',
  styleUrl: './todo-detail.component.scss'
})
export class TodoDetailComponent implements OnInit {
  private readonly todosService = inject(TodosService);  

  protected readonly todoId = signal<number | undefined>(undefined);

  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly todo = signal<Todo | null>(null);

  
  ngOnInit(){
    this.todoId.set(Number(this.activatedRoute.snapshot.paramMap.get('id')));

    this.todosService.getOneTodo(this.todoId() ?? 0).subscribe((data: Todo)=>{
      this.todo.set(data);
    });
  }
}
