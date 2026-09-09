import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { GetPostByIdUseCase } from '../../../../application/post/use-cases/get-post-by-id.use-case';
import { PostDetail } from '../../../../domain/post/entity/PostDetail';
import { SubmitCommentComponent } from './components/submit-comment/submit-comment.component' 
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { LikeButtonComponent } from './components/like-button/like-button.component';
import { viewChild } from '@angular/core'

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink, SubmitCommentComponent, CommentListComponent, LikeButtonComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})

export class PostDetailComponent implements OnInit {
  
  // <<==>> \\ (<!!>) <...> \\  
  private readonly route = inject(ActivatedRoute);
  private readonly getPostByIdUseCase = inject(GetPostByIdUseCase);
  private readonly sanitizer = inject(DomSanitizer);
  // << RefRence CHIILD >>     
  readonly commentListRef = viewChild(CommentListComponent);
  readonly post = signal<PostDetail | null>(null);
  readonly renderedContent = signal<SafeHtml | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getPostByIdUseCase.execute(id).subscribe({
      next: (post) => {    // <<==>> \\ (<!<->!>)
        this.post.set(post);
        // Make Break Inside This One (!!) ...   
        marked.setOptions({ breaks: true });
        const rawHtml = marked.parse(post.content) as string;
        const container = document.createElement('div');
        container.innerHTML = rawHtml;
        container.querySelectorAll('iframe').forEach((iframe) => {
          const src = iframe.getAttribute('src');
          try {
            const url = new URL(src ?? '');
            const valid =
              url.protocol === 'https:' &&
              url.hostname === 'www.youtube-nocookie.com' &&
              url.pathname.startsWith('/embed/');
            if (!valid) {
              iframe.remove();
            }
          } catch {
            iframe.remove();
          }
        });
        const safeHtml = DOMPurify.sanitize(rawHtml, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: [
            'src',
            'allow',
            'allowfullscreen',
          ],
        });
        this.renderedContent.set(
          this.sanitizer.bypassSecurityTrustHtml(safeHtml)
        );
        this.isLoading.set(false); // <<==>> \\
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  } // <<==>> \\ 

  // I Will Pass This To Submit For Treger In Event (!) \\ ()
  onCommentAdded(): void {
    this.commentListRef()?.reload();
  }
}