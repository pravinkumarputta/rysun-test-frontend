import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CacheService } from '../../../shared/services/cache.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private cacheService: CacheService
  ) {
    this.signupForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        emailId: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.signupForm.value;
      delete formData.confirmPassword; // Remove confirmPassword before sending to API

      this.authService.signup(formData).subscribe({
        next: (userProfile) => {
          this.isLoading = false;
          this.toastr.success('Registration successful!', 'Success');

          this.cacheService.updateCache('profile', userProfile);
          if (userProfile.role === 'admin') {
            this.router.navigate(['/user']);
          } else {
            this.router.navigate(['/product']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error('Registration failed. Please try again.', 'Error');
        },
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('pattern')) {
      switch (controlName) {
        case 'emailId':
          return 'Please enter a valid email address';
        case 'phoneNumber':
          return 'Please enter a valid phone number';
        case 'password':
          return 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character';
        default:
          return 'Invalid input';
      }
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (
      controlName === 'confirmPassword' &&
      this.signupForm.hasError('mismatch')
    ) {
      return 'Passwords do not match';
    }
    return '';
  }
}
