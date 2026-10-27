import { Component, inject, signal, OnInit, computed } from '@angular/core'; 
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { GetPostByIdUseCase } from '../../../../application/post/use-cases/get-post-by-id.use-case';
import { PostDetail } from '../../../../domain/post/entity/PostDetail';
import { SubmitCommentComponent } from './components/submit-comment/submit-comment.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { LikeButtonComponent } from './components/like-button/like-button.component';
import { CommentCountComponent } from './components/comment-count/comment-count.component';
import { viewChild } from '@angular/core';
import { Comment } from '../../../../domain/comment/entity/comment.entity';
import { DeletePostUseCase } from '../../../../application/post/use-cases/delete.post.use-case';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';
import { AuthNavigationService } from '../../../../application/auth/services/auth-navigation.service';
import { CommonModule } from '@angular/common';
import { MediaType } from '../../../../enum/MediaType';
import { ReportModalComponent } from '../../../profile/pages/profile/components/report-modal/report-modal.component';
import{AuthState} from '../../../../application/auth/state/auth-state.service'
import { ToastService } from '../../../../application/auth/services/toast.service'
import { Role} from '../../../../enum/Role'
// This hook checker and portected to not let any thing else instead of youtbe be inject 
// XSS atack protection ! <=> !
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe' && node instanceof Element) {
    const src = node.getAttribute('src');
    try {
      const url = new URL(src ?? '');
      const valid =
        url.protocol === 'https:' &&
        url.hostname === 'www.youtube-nocookie.com' &&
        url.pathname.startsWith('/embed/');
      if (!valid) {
        node.remove();
      }
    } catch {
      node.remove();
    }
  }
});

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SubmitCommentComponent, CommentListComponent, LikeButtonComponent, CommentCountComponent, ConfirmModalComponent, ReportModalComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})

// <<===>> \\ {-?}
// <<<==>>> \\ {-?}
export class PostDetailComponent implements OnInit {
  // <<==>> \\ (<!!>) <...> \\
  private readonly route = inject(ActivatedRoute);
  private readonly getPostByIdUseCase = inject(GetPostByIdUseCase);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly deletePostUseCase = inject(DeletePostUseCase);
  private readonly _router = inject(Router);
  private readonly _authNavigation = inject(AuthNavigationService);
  private readonly toast = inject(ToastService); 

  private readonly authuser = inject(AuthState);

  readonly isAdmin = computed(
    () => this.authuser.currentUser()?.role === Role.ADMIN
  );
  // {<<==>>} \\ {<!!>} // 
  // {<<<==>>>}
  // << RefRence CHIILD >>
  readonly commentListRef = viewChild(CommentListComponent);
  readonly post = signal<PostDetail | null>(null);
  readonly renderedContent = signal<SafeHtml | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  // <<==>>> \\\
  readonly showDeleteConfirm = signal(false);
  readonly isDeleting = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getPostByIdUseCase.execute(id).subscribe({

      next: (post) => {
        // <<==>> \\ (<!<->!>)
        this.post.set(post);
        // Make Break Inside This One (!!) ...

        marked.setOptions({ breaks: true });

        const rawHtml = marked.parse(post.content) as string;

        /// 
        const safeHtml = DOMPurify.sanitize(rawHtml, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['src', 'allow', 'allowfullscreen'],
        });

        this.renderedContent.set(
          this.sanitizer.bypassSecurityTrustHtml(safeHtml)
        );
        this.isLoading.set(false); // <<==>> \\
      },
      error: (err) => {
        console.log("hjkhkjhkjh")
        if (err.status === 401) {
          this._authNavigation.handle401(err);
          return;
        }
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? (err.status === 404 ? 'Post not found.' : 'Could not load this post.'));
      },
    });
  }

  // I Will Pass This To Submit For Treger In Event (!) \\ () 
  
  onCommentAdded(comment: Comment): void {
    this.commentListRef()?.addCommentLocally(comment);
  }

  // <<==>> >>>
  deletePost(id: number): void {
    if (this.isDeleting()) return;
    this.isDeleting.set(true);
    this.deletePostUseCase.execute(id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.toast.success('Post deleted!');
        this._router.navigateByUrl('/');
      },
      error: (err) => {
        this.isDeleting.set(false);
        if (err.status === 401) {
          this._authNavigation.handle401(err);
          return;
        }
        this.toast.error(err.error?.message ?? 'Could not delete the post.');
      },
    });
  }

  isImageMedia(mediaType: MediaType): boolean {
    return mediaType === MediaType.IMAGE || String(mediaType).toUpperCase() === 'IMAGE';
  }

  isVideoMedia(mediaType: MediaType): boolean {
    return mediaType === MediaType.VIDEO || String(mediaType).toUpperCase() === 'VIDEO';
  }

}
