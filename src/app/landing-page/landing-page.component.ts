import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../alert-service.service';
import { environment } from 'src/env/env';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  newPasswordHidden: boolean = true;
  confirmPasswordHidden: boolean = true;
  @ViewChild('newPassword') newPassword!: ElementRef<HTMLInputElement>;
  @ViewChild('confirmPassword') confirmPassword!: ElementRef<HTMLInputElement>;
  showAlert: boolean = false;
  usernameValue: string | null = null;
  isUsernameDisabled: boolean = false;

  constructor(
    private authservice: AuthService,
    private router: Router,
    private http: HttpClient,
    public alertservice: AlertService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Retrieve userDBName from AuthService
    this.usernameValue = this.authservice.getUserDBName();

    // Check for username parameter in query params
    this.route.queryParams.subscribe(params => {
      if (params['username']) {
        // Update usernameValue if present in query params
        this.usernameValue = params['username'];
        this.isUsernameDisabled = true; // Disable the username input field
      }
    });
  }

  submitForm(): void {
    const username = this.usernameValue || '';
    const newPassword = this.newPassword.nativeElement.value;
    const confirmPassword = this.confirmPassword.nativeElement.value;

    // Encrypt payload data
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify({ username, newPassword, confirmPassword }), 'secret-key').toString();

    // Call changePassword with encrypted data
    this.changePassword(encryptedData);
  }

  changePassword(encryptedData: string): void {
    const apiUrl = environment.PasswordChangeUrl;
    const token = this.authservice.getToken();

    if (!token) {
      this.handleError('Bearer token not found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      // No need for Access-Control-Allow-Origin here
    });

    // Include encrypted data in the request body
    this.http.post<any>(apiUrl, { encryptedData }, { headers, observe: 'response' }).subscribe(
      (response: any) => {
        if (response.body.responseCode === '00') {
          this.alertservice.showAlert('success', 'Password change successful');
        } else if (response.body.responseCode === '99') {
          this.alertservice.showAlert('error', 'Password change unsuccessful');
        } else {
          this.alertservice.showAlert('error', response.body.responseMessage);
        }
      },
      (error: HttpErrorResponse) => {
        this.handleError('Error changing password');
      }
    );
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'newPassword') {
      this.newPasswordHidden = !this.newPasswordHidden;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordHidden = !this.confirmPasswordHidden;
    }
  }

  logout(): void {
    this.authservice.logout();
    this.router.navigateByUrl('/home');
  }

  private handleError(error: string): void {
    this.showAlertMessage('error', error);
  }

  private showAlertMessage(type: 'success' | 'error', message: string): void {
    this.showAlert = true;
    this.alertservice.showAlert(type, message);
  }
}
