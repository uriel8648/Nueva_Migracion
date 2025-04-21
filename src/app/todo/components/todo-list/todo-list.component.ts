import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  todoForm: FormGroup;
  editMode = false;
  editIndex = -1;
  loading = false;
  
  // Subject for handling unsubscriptions
  private destroy$ = new Subject<void>();

  constructor(private todoService: TodoService, private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (todos: Todo[]) => {
          this.todos = todos;
        },
        error: (error: Error) => {
          console.error('Error loading todos:', error);
          alert('Failed to load todos. Check console for details.');
        }
      });
  }

  createTodo(): void {
    if (!this.todoForm.get('title')?.value) {
      alert('Title is required!');
      return;
    }

    this.loading = true;
    this.todoService.saveTodo(this.todoForm.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (createdTodo: Todo) => {
          this.todos.push(createdTodo);
          this.resetForm();
        },
        error: (error: Error) => {
          console.error('Error creating todo:', error);
          alert('Failed to create todo. Check console for details.');
        }
      });
  }

  updateTodo(): void {
    if (!this.todoForm.get('title')?.value) {
      alert('Title is required!');
      return;
    }

    if (!this.todoForm.get('id')?.value) {
      console.error('Cannot update todo without ID');
      return;
    }

    this.loading = true;
    this.todoService.saveTodo(this.todoForm.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedTodo: Todo) => {
          this.todos[this.editIndex] = updatedTodo;
          this.resetForm();
        },
        error: (error: Error) => {
          console.error('Error updating todo:', error);
          alert('Failed to update todo. Check console for details.');
        }
      });
  }

  deleteTodo(id: number | undefined, index: number): void {
    if (!id) {
      console.error('Cannot delete todo without ID');
      return;
    }

    if (confirm('Are you sure you want to delete this todo?')) {
      this.loading = true;
      this.todoService.deleteTodo(id)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.todos.splice(index, 1);
          },
          error: (error: Error) => {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo. Check console for details.');
          }
        });
    }
  }

  toggleStatus(todo: Todo): void {
    if (!todo.id) {
      console.error('Cannot toggle todo without ID');
      return;
    }

    const originalStatus = todo.completed;
    todo.completed = !todo.completed;

    this.todoService.toggleTodoStatus(todo.id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (updatedTodo: Todo) => {
          Object.assign(todo, updatedTodo);
        },
        error: (error: Error) => {
          console.error('Error toggling todo status:', error);
          alert('Failed to update todo status. Check console for details.');
          todo.completed = originalStatus;
        }
      });
  }

  editTodo(todo: Todo, index: number): void {
    this.todoForm.patchValue(todo);
    this.editMode = true;
    this.editIndex = index;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.todoForm.reset({
      title: '',
      description: '',
      completed: false
    });
    this.editMode = false;
    this.editIndex = -1;
  }

  saveTodo(): void {
    if (this.editMode) {
      this.updateTodo();
    } else {
      this.createTodo();
    }
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id || index;
  }
}
