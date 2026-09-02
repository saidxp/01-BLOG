import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

export abstract class AuthRepository {
  /**
   * about tokent i decide to be not manage by the client side it's will be IN THE HTTP ! 
   */
  abstract login(identifier: string, password: string): Observable<User>;
  // Her i wll use a methoud me to check source of truth (!!)<=>(!!)
  abstract me(): Observable<User>;
  // <<==>>> (!!) <<==>> (!!) 
  abstract register(name: string, email: string, password: string): Observable<User>;

}