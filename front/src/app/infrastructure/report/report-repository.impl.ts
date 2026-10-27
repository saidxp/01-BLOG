import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportRepository } from '../../domain/report/repository/report.repository';
import { environment } from '../../../environments/environment.development';

@Injectable() 
export class ReportRepositoryImpl extends ReportRepository {

  private readonly http = inject(HttpClient);

  override reportUser(username: string, reason: string, postId: number): Observable<void> {
    let params = new HttpParams().set('reason', reason); // {} \\ {<!!>} \\ //  
    if (postId != null) {
      params = params.set('postId', postId);
    }
    return this.http.post<void>(`${environment.apiUrl}/api/users/${username}/report`, null, { params, withCredentials: true });
  } // {<!!>} \\ {<!!>} // {<!!>}
  override  resolveReport(id : number): Observable<string>{
    // call api \\ {} 
    return this.http.post(`${environment.apiUrl}/api/admin/reports/resolve/${id}` , null,  {withCredentials: true , responseType: 'text'});
  }
}

