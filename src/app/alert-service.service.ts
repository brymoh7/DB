import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // Subject for alert messages
  private alertSubject = new Subject<AlertMessage>();

  // Observable to subscribe for alert messages
  alert$ = this.alertSubject.asObservable();

  constructor() { }

  // Method to show alert
  showAlert(type: 'success' | 'error', message: string): void {
    this.alertSubject.next({ type, message });
  }

  // Method to show alert based on API response
  showAlertFromApiResponse(responseCode: string | number, message: string): void {
    if (responseCode === '00') {
      this.showAlert('success', message);
    } else if (responseCode === '99') {
      this.showAlert('error', message);
    } else {
      // Handle other response codes if needed
    }
  }

  // Method to show alert for user not found
  showUserNotFoundError(): void {
    this.showAlert('error', 'User not found');
  }
}

// Interface for alert message
export interface AlertMessage {
  type: 'success' | 'error';
  message: string;
}
