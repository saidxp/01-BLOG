import { AdminPostRepository } from "../../../../domain/admin/repository/admin-post.repository";
import { inject , Injectable} from "@angular/core";
import { Observable } from "rxjs";
import { PagedAdminPosts } from "../../../../domain/admin/repository/admin-post.repository";

@Injectable({ providedIn: 'root' })
export class GetAdminPostsUseCase {
  private readonly adminPostRepository = inject(AdminPostRepository);
  execute(page: number = 0): Observable<PagedAdminPosts> {
    return this.adminPostRepository.getPosts(page);
  }
}