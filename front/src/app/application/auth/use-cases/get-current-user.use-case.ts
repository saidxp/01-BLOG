import {AuthRepository} from "../../../domain/auth/repositories/auth.repository"
import { inject, Injectable } from "@angular/core"
import { AuthState } from "../state/auth-state.service";
import { Observable, tap } from "rxjs";
import { User } from "../../../domain/auth/entities/user.entity";

@Injectable({ providedIn: 'root' })
export class GetCurrentUserUseCase {

  private readonly authRepository = inject(AuthRepository);
  private readonly authState = inject(AuthState);

  execute(): Observable<User | null> {
    return this.authRepository.getCurrentUser().pipe(
      tap((user) => {
        // <<==>> \\ 
        console.log("It's Me Her I Want To Build", user);
        if (user) this.authState.setUser(user);
      })
    );
  }
  
}