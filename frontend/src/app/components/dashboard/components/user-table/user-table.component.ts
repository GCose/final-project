import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements OnInit {
  @Input() users: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() currentUser: any;
  @Input() themeService: any;
  @Output() userRoleUpdated = new EventEmitter<void>();
  @Output() userDeactivated = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  updateUserRole(userId: string, newRole: string): void {
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.userRoleUpdated.emit();
      },
      error: (error) => {
        console.error('Error updating user role:', error);
      },
    });
  }

  onRoleChange(event: Event, userId: string): void {
    const target = event.target as HTMLSelectElement;
    this.updateUserRole(userId, target.value);
  }

  deactivateUser(userId: string): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.userService.deactivateUser(userId).subscribe({
        next: () => {
          this.userDeactivated.emit();
        },
        error: (error) => {
          console.error('Error deactivating user:', error);
        },
      });
    }
  }

  getRoleBadgeClass(roleName: string): string {
    const roleClasses: { [key: string]: string } = {
      Admin: 'badge--admin',
      Editor: 'badge--editor',
      Viewer: 'badge--viewer',
    };
    return roleClasses[roleName] || 'badge--viewer';
  }

  trackByUserId(index: number, user: any): string {
    return user._id || index;
  }
}
