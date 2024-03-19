// AuthService.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.authServiceUrl;
  private tokenKey = environment.tokenKey;
  private userDBNameKey = environment.userDBNameKey;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string, otp: string, userDBName: string): Observable<any> {
    const body = { email, password, otp, userDBName }; // Include userDBName in the request body
    return this.http.post<any>(this.apiUrl, body);
  }

  // Store token securely in local storage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Set userDBName in local storage
  setUserDBName(userDBName: string): void {
    localStorage.setItem(this.userDBNameKey, userDBName);
  }

  // Retrieve userDBName from local storage
  getUserDBName(): string | null {
    return localStorage.getItem(this.userDBNameKey);
  }

  authenticate(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
});

    return this.http.post<any>(this.apiUrl, { headers });
  }

  logout(): void {
    // Clear token and userDBName from local storage
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userDBNameKey);
    // Navigate to home page
    this.router.navigateByUrl('/home');
  }
}
