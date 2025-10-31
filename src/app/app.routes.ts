import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { SignupComponent } from './core/components/signup/signup.component';
import { LoginComponent } from './core/components/login/login.component';
import { HomeComponent } from './core/components/home/home.component';
import { TodoDetailComponent } from './core/components/todo-detail/todo-detail.component';

export const routes: Routes = [
  {
       path: 'home',
       component: HomeComponent,
       canActivate:[AuthGuard]
  },
   {
       path: 'home/:id',
       component: TodoDetailComponent,
       canActivate:[AuthGuard]
  },
  {
       path: 'login',
       component: LoginComponent
  },
   {
       path: 'signup',
       component: SignupComponent
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
