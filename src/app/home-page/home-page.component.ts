// home-page.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { ILoginResponse } from './iLoginResponse'; // Import the interface for login response

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  showAlert: boolean = false;
  loginResponseMessage: string | null = null; // Add loginResponseMessage variable
  otpHidden: boolean = true; // Initial state for OTP visibility

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router, // Inject Router
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      otp: ['', Validators.required],
      userDBName: ['', Validators.required] // Add userDBName field to the form
    });

    // Check for username parameter in query params
    this.route.queryParams.subscribe(params => {
      if (params['username']) {
        this.loginForm.patchValue({ 'userDBName': params['username'] }); // Set the username field value
        this.loginForm.get('userDBName')?.disable(); // Disable the username input field
      }
    });
  }
  // Method to toggle OTP field visibility
  toggleOtpVisibility(): void {
    this.otpHidden = !this.otpHidden;
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      const otp = this.loginForm.get('otp')?.value;
      const userDBName = this.loginForm.get('userDBName')?.value; // Retrieve userDBName from the form

      // Pass userDBName to the login method
      this.authService.login(email, password, otp, userDBName).subscribe(
        (response: ILoginResponse) => {
          const token = response?.data?.token;
          this.authService.setToken(token); // Set token in AuthService
          this.authService.setUserDBName(userDBName); // Set userDBName in AuthService
          if (response.status && response.message === 'OPERATION_SUCCESSFUL') {
            this.showAlert = true;
            this.loginResponseMessage = 'Login successful!'; // Set the login response message
            // Show the alert and navigate after a short delay
            setTimeout(() => {
              window.alert('Login successful! Click OK to continue.');
              this.router.navigateByUrl('/landing-page');
            },2); // Adjust delay time if needed
          }
          console.log('Login successful!');
        },
        (error: any) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
