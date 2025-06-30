import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleName: 'Viewer',
  };

  roles: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.userService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.roles;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const { confirmPassword, ...registerData } = this.userData;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private validateForm(): boolean {
    if (
      !this.userData.fullName ||
      !this.userData.email ||
      !this.userData.password
    ) {
      this.errorMessage = 'Please fill in all fields';
      return false;
    }

    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.userData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    return true;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
