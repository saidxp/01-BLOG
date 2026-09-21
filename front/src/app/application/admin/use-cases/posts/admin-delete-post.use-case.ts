import { AdminPostRepository } from "../../../../domain/admin/repository/admin-post.repository";
import { inject , Injectable} from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AdminDeletePostUseCase { 
  private readonly adminPostRepository = inject(AdminPostRepository);
  execute(id: number): Observable<void> {
    return this.adminPostRepository.deletePost(id);
  }
}


