import { Component, input } from '@angular/core';
import { Post } from '../../../../domain/post/entity/post.entity';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-post-card',
  standalone: true,
    imports: [CommonModule,RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})

// <<==>> \\ (<!<->!>).
export class PostCardComponent {
  readonly post = input.required<Post>();
}