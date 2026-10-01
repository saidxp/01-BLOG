import { Component, input } from '@angular/core';

@Component({
  selector: 'app-comment-count',
  standalone: true,
  templateUrl: './comment-count.component.html',
  styleUrl: './comment-count.component.css',
})
export class CommentCountComponent {
  readonly commentCount = input<number>(0);
}
