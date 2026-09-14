import { Observable } from 'rxjs';

export abstract class ReportRepository {
    abstract reportUser(username: string, reason: string): Observable<void>;
}
