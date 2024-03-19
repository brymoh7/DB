import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {

  private apiUrl = environment.PasswordChangeUrl;

  constructor(private http: HttpClient) { }

  changePassword(username: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = { username, newPassword, confirmPassword };
    return this.http.post<any>(this.apiUrl, body).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // Return an observable with error message
    return throwError(errorMessage);
  }
}
