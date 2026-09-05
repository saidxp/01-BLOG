import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthState } from '../../../../application/auth/state/auth-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly authState = inject(AuthState);

  readonly currentUser = this.authState.currentUser;
}