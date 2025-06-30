import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css'],
})
export class StatsCardsComponent implements OnInit {
  @Input() stats: any;
  @Input() themeService: any;

  statCards = [
    {
      title: 'Total Users',
      value: 'totalUsers',
      icon: 'users',
      colorClass: 'stats__card--blue',
    },
    {
      title: 'Active Users',
      value: 'activeUsers',
      icon: 'check',
      colorClass: 'stats__card--green',
    },
    {
      title: 'Admins',
      value: 'adminUsers',
      icon: 'shield',
      colorClass: 'stats__card--red',
    },
    {
      title: 'Editors',
      value: 'editorUsers',
      icon: 'edit',
      colorClass: 'stats__card--yellow',
    },
    {
      title: 'Viewers',
      value: 'viewerUsers',
      icon: 'eye',
      colorClass: 'stats__card--purple',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  getIconPath(iconType: string): string {
    const icons: { [key: string]: string } = {
      users:
        'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      shield:
        'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    };
    return icons[iconType] || '';
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
