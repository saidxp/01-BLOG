import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GetAdminPostsUseCase } from '../../../../application/admin/use-cases/posts/get-admin-posts.use-case';
import { AdminDeletePostUseCase } from '../../../../application/admin/use-cases/posts/admin-delete-post.use-case';
import { AdminPost } from '../../../../domain/admin/entity/admin-post.entity';
import { AdminPostsComponent } from './admin-posts.component';

describe('AdminPostsComponent', () => {
  let fixture: ComponentFixture<AdminPostsComponent>;
  let component: AdminPostsComponent;
  let deletePost: jasmine.SpyObj<AdminDeletePostUseCase>;

  const post = new AdminPost(12, 'Post title', 'author', new Date());

  beforeEach(async () => {
    const getPosts = jasmine.createSpyObj<GetAdminPostsUseCase>('GetAdminPostsUseCase', ['execute']);
    deletePost = jasmine.createSpyObj<AdminDeletePostUseCase>('AdminDeletePostUseCase', ['execute']);
    getPosts.execute.and.returnValue(of({ posts: [post], currentPage: 0, totalPages: 1 }));

    await TestBed.configureTestingModule({
      imports: [AdminPostsComponent],
      providers: [
        provideRouter([]),
        { provide: GetAdminPostsUseCase, useValue: getPosts },
        { provide: AdminDeletePostUseCase, useValue: deletePost },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('does not delete a post when confirmation is cancelled', () => {
    component.requestDeletePost(post);
    component.cancelDeletePost();

    expect(deletePost.execute).not.toHaveBeenCalled();
    expect(component.pendingDelete()).toBeNull();
  });

  it('deletes a post only after confirmation', () => {
    deletePost.execute.and.returnValue(of(void 0));

    component.requestDeletePost(post);
    component.confirmDeletePost();

    expect(deletePost.execute).toHaveBeenCalledOnceWith(post.id);
    expect(component.posts()).toEqual([]);
  });
});
