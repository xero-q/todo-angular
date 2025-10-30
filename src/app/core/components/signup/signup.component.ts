import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly hidePassword = signal(true);
  protected readonly hideConfirmPassword = signal(true);

  protected readonly signupForm = 
    this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
      },
      {
        validators: this.passwordMismatchValidator,
      }
    );
  

  passwordMismatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('passwordConfirmation');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService
        .signup(
          this.signupForm.get('username')!.value ?? '',
          this.signupForm.get('password')!.value ?? '',
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            console.log({error});
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
