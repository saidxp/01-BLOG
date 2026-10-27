import { Component, input, viewChild } from '@angular/core';
import { Post } from '../../../../domain/post/entity/post.entity';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediaType } from '../../../../enum/MediaType';
import { ReportModalComponent } from '../../../profile/pages/profile/components/report-modal/report-modal.component';

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

  isImageMedia(): boolean {
    const type = this.post().mediaType;
    return type === MediaType.IMAGE || String(type).toUpperCase() === 'IMAGE';
  }

  isVideoMedia(): boolean {
    const type = this.post().mediaType;
    return type === MediaType.VIDEO || String(type).toUpperCase() === 'VIDEO';
  }
}
