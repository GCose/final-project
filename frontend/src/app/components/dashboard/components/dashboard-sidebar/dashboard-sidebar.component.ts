import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css'],
})
export class DashboardSidebarComponent implements OnInit {
  @Input() currentUser: any;
  @Input() themeService: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  get isEditor(): boolean {
    return this.currentUser?.role === 'Editor';
  }

  get isViewer(): boolean {
    return this.currentUser?.role === 'Viewer';
  }

  getRoleClass(role: string): string {
    const roleClasses: { [key: string]: string } = {
      Admin: 'badge--admin',
      Editor: 'badge--editor',
      Viewer: 'badge--viewer',
    };
    return roleClasses[role] || 'badge--viewer';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
