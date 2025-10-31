import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; // ADDED MatDialogModule
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ADDED MatSnackBarModule
import { TodosService } from '../../services/todos.service';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Todo } from '../../../shared/interfaces/todo.interface'; // Mocking path, adjust as needed
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatSelectModule } from '@angular/material/select'; 
import { CommonModule } from '@angular/common'; // Added CommonModule
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';

// Mock implementation for dependencies
const mockMatDialogRef = {
  close: jasmine.createSpy('close'),
};

const mockMatSnackBar = {
  open: jasmine.createSpy('open'),
};

// Mock data for TodoService
const mockTodo: Todo = {
  todoId: 1,
  title: 'Test Title',
  description: 'Test Description',
  dueDate: new Date(2025, 9, 31, 12, 0), // Oct 31, 2025 @ 12:00
  isCompleted: false,
};

const mockTodosService = {
  getOneTodo: jasmine.createSpy('getOneTodo').and.returnValue(of(mockTodo)),
  createTodo: jasmine.createSpy('createTodo').and.returnValue(of(null)),
  updateTodo: jasmine.createSpy('updateTodo').and.returnValue(of(null)),
};

describe('TodoFormComponent Validation', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Import the component under test and necessary Angular modules
      imports: [
        TodoFormComponent,
        ReactiveFormsModule,
        CommonModule, // Added to satisfy component dependency
        MatInputModule, 
        MatButtonModule, 
        MatCardModule, 
        MatSelectModule, 
        MatDialogModule, // Added to satisfy MatDialogRef dependency chain
        MatSnackBarModule, // Added to satisfy MatSnackBar dependency chain
        NoopAnimationsModule, // Required for Material modules
        RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        // Use a default payload for creation mode to avoid calling getOneTodo
        { provide: MAT_DIALOG_DATA, useValue: { todoId: undefined } },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: TodosService, useValue: mockTodosService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    // Call detectChanges to initialize the component and the form signal
    fixture.detectChanges();
  });

  it('should create and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.todoForm().get('title')).toBeTruthy();
  });

  // Test Case 1: Initial state (all required fields empty except default 'isCompleted')
  it('should be invalid when title, description, and dueDate are empty', () => {
    const form = component.todoForm();
    // Manually clear the default '0' for isCompleted to test all required fields
    form.get('isCompleted')?.setValue('');
    form.get('title')?.setValue('');
    form.get('description')?.setValue('');
    form.get('dueDate')?.setValue('');

    expect(form.valid).toBeFalse();

    // Check individual required errors
    expect(form.get('title')?.hasError('required')).toBeTrue();
    expect(form.get('description')?.hasError('required')).toBeTrue();
    expect(form.get('dueDate')?.hasError('required')).toBeTrue();
    expect(form.get('isCompleted')?.hasError('required')).toBeTrue();
  });

  // Test Case 2: Title validation
  it('should mark title as invalid when empty', () => {
    const titleControl = component.todoForm().get('title');
    titleControl?.setValue('');
    expect(titleControl?.valid).toBeFalse();
    expect(titleControl?.hasError('required')).toBeTrue();
  });

  it('should mark title as valid when filled', () => {
    const titleControl = component.todoForm().get('title');
    titleControl?.setValue('A task');
    expect(titleControl?.valid).toBeTrue();
    expect(titleControl?.hasError('required')).toBeFalse();
  });

  // Test Case 3: Description validation
  it('should mark description as invalid when empty', () => {
    const descControl = component.todoForm().get('description');
    descControl?.setValue('');
    expect(descControl?.valid).toBeFalse();
    expect(descControl?.hasError('required')).toBeTrue();
  });

  it('should mark description as valid when filled', () => {
    const descControl = component.todoForm().get('description');
    descControl?.setValue('Some detailed work');
    expect(descControl?.valid).toBeTrue();
    expect(descControl?.hasError('required')).toBeFalse();
  });

  // Test Case 4: DueDate validation
  it('should mark dueDate as invalid when empty', () => {
    const dateControl = component.todoForm().get('dueDate');
    dateControl?.setValue('');
    expect(dateControl?.valid).toBeFalse();
    expect(dateControl?.hasError('required')).toBeTrue();
  });

  it('should mark dueDate as valid when filled', () => {
    const dateControl = component.todoForm().get('dueDate');
    dateControl?.setValue('2025-12-31T23:59'); // A valid datetime-local string
    expect(dateControl?.valid).toBeTrue();
    expect(dateControl?.hasError('required')).toBeFalse();
  });

  // Test Case 5: isCompleted validation
  it('should mark isCompleted as invalid when empty', () => {
    const completedControl = component.todoForm().get('isCompleted');
    completedControl?.setValue('');
    expect(completedControl?.valid).toBeFalse();
    expect(completedControl?.hasError('required')).toBeTrue();
  });

  it('should mark isCompleted as valid when filled with "0"', () => {
    const completedControl = component.todoForm().get('isCompleted');
    completedControl?.setValue('0');
    expect(completedControl?.valid).toBeTrue();
    expect(completedControl?.hasError('required')).toBeFalse();
  });

  // Test Case 6: Overall form validity
  it('should mark the form as valid when all required fields are correctly filled', () => {
    const form = component.todoForm();

    form.setValue({
      title: 'Valid Todo',
      description: 'Everything is filled in.',
      dueDate: '2025-11-01T08:00',
      isCompleted: '1',
    });

    expect(form.valid).toBeTrue();
    // Ensure onSubmit is not called if form is invalid (checked in other tests, but good final check)
    component.onSubmit();
    // We expect the service to be called if valid
    expect(mockTodosService.createTodo).toHaveBeenCalled();
  });

  it('should prevent submission when form is invalid', () => {
    const form = component.todoForm();
    form.get('title')?.setValue(''); // Make invalid
    form.get('description')?.setValue('Valid');
    form.get('dueDate')?.setValue('2025-11-01T08:00');
    form.get('isCompleted')?.setValue('0');

    expect(form.valid).toBeFalse();

    component.onSubmit();

    // Verify that the service call was NOT made
    expect(mockTodosService.createTodo).not.toHaveBeenCalled();
    expect(mockTodosService.updateTodo).not.toHaveBeenCalled();
  });
});
