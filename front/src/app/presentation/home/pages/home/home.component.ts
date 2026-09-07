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
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GetFeedUseCase } from '../../../../application/post/use-cases/get-feed.use-case';
import { AuthState } from '../../../../application/auth/state/auth-state.service';
import { Post } from '../../../../domain/post/entity/post.entity';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
 
@Component({
  selector: 'app-home',
  standalone: true,    
  imports: [RouterLink, PostCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent implements OnInit {

  private readonly getFeedUseCase = inject(GetFeedUseCase);
  private readonly authState = inject(AuthState);
   
  readonly currentUser = this.authState.currentUser; // FOR CHECK STATE (!)
  readonly posts = signal<Post[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null); 
   
  // The it's to fetch the feed when the component is initialized it's still not optimized for performance but it's a good start
  ngOnInit(): void { 
    this.getFeedUseCase.execute().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
  
}