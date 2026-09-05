import { Component, input } from '@angular/core';
import { Post } from '../../../../domain/home/entity/post.entity';

@Component({
  selector: 'app-post-card',
  standalone: true,
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})

// <<==>> \\ (<!<->!>).
export class PostCardComponent {
  readonly post = input.required<Post>();
}