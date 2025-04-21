import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap, takeUntil } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

/**
 * Component responsible for creating and editing Todo items
 * Uses reactive forms for data handling and validation
 */
@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {
  todoForm: FormGroup;
  editMode = false;
  todoId: number | null = null;
  submitted = false;
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the form with validators
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode by looking for an id parameter in the route
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      tap(params => {
        const id = params.get('id');
        if (id) {
          this.editMode = true;
          this.todoId = +id;
          this.loadTodoForEdit(this.todoId);
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads a todo for editing
   * @param id The ID of the todo to edit
   */
  loadTodoForEdit(id: number): void {
    this.todoService.getTodo(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (todo: Todo) => {
        this.todoForm.patchValue({
          title: todo.title,
          description: todo.description,
          completed: todo.completed
        });
      },
      error: (error) => {
        console.error('Error loading todo for edit:', error);
        this.handleError('Failed to load todo details. Please try again.');
      }
    });
  }

  /**
   * Handles form submission - creates or updates a todo
   */
  onSubmit(): void {
    this.submitted = true;
    
    // Stop if the form is invalid
    if (this.todoForm.invalid) {
      return;
    }

    const todoData: Partial<Todo> = {
      ...this.todoForm.value
    };
    
    // Use saveTodo for both create and update
    if (this.editMode && this.todoId) {
      todoData.id = this.todoId;
    }
    this.todoService.saveTodo(todoData as Todo).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result: Todo) => {
        this.resetForm();
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        console.error('Error saving todo:', error);
        this.handleError('Failed to save todo. Please try again.');
      }
    });
  }

  /**
   * Cancels the edit operation and navigates back to the list
   */
  cancelEdit(): void {
    this.resetForm();
    this.router.navigate(['/todos']);
  }

  /**
   * Resets the form to its initial state
   */
  resetForm(): void {
    this.submitted = false;
    this.todoForm.reset({
      title: '',
      description: '',
      completed: false
    });
    this.editMode = false;
    this.todoId = null;
  }

  /**
   * Handles API errors
   * @param message The error message to display
   */
  private handleError(message: string): void {
    // In a real app, you might use a toast/snackbar service instead of alert
    alert(message);
  }

  /**
   * Getter for easy access to form fields in the template
   */
  get f(): { [key: string]: AbstractControl } {
    return this.todoForm.controls;
  }
  
  /**
   * Checks if a field has a specific error
   * @param controlName The form control name
   * @param errorName The error to check for
   * @returns Boolean indicating if the error exists
   */
  hasError(controlName: string, errorName: string): boolean {
    const control = this.todoForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.dirty || control.touched || this.submitted);
  }
}