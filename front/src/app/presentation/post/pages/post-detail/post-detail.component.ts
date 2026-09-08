import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { GetPostByIdUseCase } from '../../../../application/post/use-cases/get-post-by-id.use-case';
import { PostDetail } from '../../../../domain/post/entity/PostDetail';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly getPostByIdUseCase = inject(GetPostByIdUseCase);
  private readonly sanitizer = inject(DomSanitizer);

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
        const safeHtml = DOMPurify.sanitize(rawHtml);
        this.renderedContent.set(this.sanitizer.bypassSecurityTrustHtml(safeHtml));
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    }); 
  }
}