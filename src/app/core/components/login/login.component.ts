import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, MatInputModule, MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'

})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly loginForm = signal(
    this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  );

  protected readonly isSubmitting = signal(false);

  onSubmit() {
    if (this.loginForm().valid) {
      this.isSubmitting.set(true);

      this.authService
        .login(
          this.loginForm().get('username')!.value ?? '',
          this.loginForm().get('password')!.value ?? ''
        )
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.router.navigate(['/home']);
          },
          error: (error: any) => {
            this.isSubmitting.set(false);
            const messages = error.error.message ?? error.error.errors;
            let messagesString = '';
            if (Array.isArray(messages)) {
              messagesString = messages.join('\n');
            } else {
              messagesString = messages;
            }
            this.snackbar.open(messagesString,'Error',{
              duration:3000,
              panelClass:['snackbar-error']
            })
          },
        });
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
