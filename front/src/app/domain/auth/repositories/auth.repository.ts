import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

export abstract class AuthRepository {

  abstract login(identifier: string, password: string): Observable<User>;
  // Her i wll use a methoud me to check source of truth (!!)<=>(!!)
  abstract getCurrentUser(): Observable<User | null>;
  // <<==>>> (!!) <<==>> (!!) 
  abstract register(name: string, email: string, password: string): Observable<User>; 

  abstract logout(): Observable<void>;
  
}