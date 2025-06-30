import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css'],
})
export class DashboardHeaderComponent implements OnInit {
  @Input() currentUser: any;
  @Input() themeService: any;
  @Output() toggleMobileMenu = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onToggleMobileMenu(): void {
    this.toggleMobileMenu.emit();
  }

  getRoleClass(role: string): string {
    const roleClasses: { [key: string]: string } = {
      Admin: 'badge--admin',
      Editor: 'badge--editor',
      Viewer: 'badge--viewer',
    };
    return roleClasses[role] || 'badge--viewer';
  }
}
