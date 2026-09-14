// Her at home i need first to know if the user is logged in
// Why becs i will show them different content based on their authentication status
// So i will use the auth service to check if the user is logged in or not
// If the user is logged in i will show them the home page 
// But the problem it's the user when it's loging it's live in browser !!
// And i cant access becs im working with serverside rendring ! so i need to check backend everytime ! to see if the user !
// And based on that i wil show them diffrence (!) 
// And this feed i will fetch Posts it's public for everyone And put them in Card !
// So I Will Use The Post Service To Fetch The Posts And Show Them In The Home Page (!!) 
// <<==>> \\  
import { Component, inject} from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { AuthState } from '../../../../application/auth/state/auth-state.service';
import { PublicPostsFeed } from './component/public-posts/public-posts-feed.component';

@Component({
  selector: 'app-home',
  standalone: true,    
  imports: [RouterLink, PublicPostsFeed],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent {
  private readonly authState = inject(AuthState);
  readonly currentUser = this.authState.currentUser;
}

