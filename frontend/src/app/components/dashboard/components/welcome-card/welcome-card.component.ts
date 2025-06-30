import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.css'],
})
export class WelcomeCardComponent implements OnInit {
  @Input() currentUser: any;
  @Input() themeService: any;
  @Input() isEditor: boolean = false;
  @Input() isViewer: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  getPermissions(): string[] {
    if (this.isEditor) {
      return ['create', 'read', 'update'];
    } else if (this.isViewer) {
      return ['read'];
    }
    return [];
  }

  getPermissionClass(): string {
    if (this.isEditor) {
      return 'welcome__permission--editor';
    } else if (this.isViewer) {
      return 'welcome__permission--viewer';
    }
    return 'welcome__permission--default';
  }

  getRoleClass(): string {
    if (this.isEditor) {
      return 'badge--editor';
    } else if (this.isViewer) {
      return 'badge--viewer';
    }
    return 'badge--viewer';
  }
}
