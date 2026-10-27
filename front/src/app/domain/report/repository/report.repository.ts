import { Observable } from 'rxjs';

export abstract class ReportRepository {
    abstract reportUser(username: string, reason: string, postId?: number): Observable<void>;
    abstract resolveReport(id: number): Observable<string>;
}
