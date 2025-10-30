import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { AuthService } from '../../services/auth.service';
import {  TodosComponent } from '../properties/todos.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  imports: [TodosComponent, MatToolbarModule, MatIconModule,MatMenuModule, MatButtonModule,MatSidenavModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  private readonly cdr = inject(ChangeDetectorRef);


  protected readonly menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update((value) => !value);
  }

  logout() {
    this.authService.logout();
  }
}
