/**
 * PLACEHOLDER FILE
 *
 * This file was generated as a placeholder because the following source files were not found:
 * - N/A
 *
 * Please locate the source files and re-run the migration or manually create this file.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo/components/todo-list/todo-list.component';
import { TodoDetailComponent } from './todo/components/todo-detail/todo-detail.component';
import { TodoFormComponent } from './todo/components/todo-form/todo-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: 'todo', component: TodoListComponent },
 { path: 'todo/:id', component: TodoDetailComponent },
  { path: 'todo-form', component: TodoFormComponent },
  { path: '**', redirectTo: '/todo' }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
