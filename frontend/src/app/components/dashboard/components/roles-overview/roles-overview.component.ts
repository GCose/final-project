import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-overview.component.html',
  styleUrls: ['./roles-overview.component.css'],
})
export class RolesOverviewComponent implements OnInit {
  @Input() roles: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() themeService: any;

  constructor() {}

  ngOnInit(): void {}

  trackByRoleId(index: number, role: any): string {
    return role._id || index;
  }

  getRoleBadgeClass(roleName: string): string {
    const roleClasses: { [key: string]: string } = {
      Admin: 'badge--admin',
      Editor: 'badge--editor',
      Viewer: 'badge--viewer',
    };
    return roleClasses[roleName] || 'badge--viewer';
  }
}
