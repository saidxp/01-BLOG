import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentCountComponent } from './comment-count.component';

describe('CommentCountComponent', () => {
  let fixture: ComponentFixture<CommentCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCountComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentCountComponent);
  });

  it('renders the comment count supplied by PostDetail', () => {
    fixture.componentRef.setInput('commentCount', 8);
    fixture.detectChanges();

    const counter = fixture.nativeElement.querySelector('.comment-count') as HTMLElement;

    expect(counter.getAttribute('aria-label')).toBe('8 comments');
    expect(counter.querySelector('strong')?.textContent?.trim()).toBe('8');
  });
});
