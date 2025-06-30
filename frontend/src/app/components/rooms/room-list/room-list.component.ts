import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  RoomService,
  Room,
  RoomSearchFilters,
} from '../../../services/room.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  isLoading = false;
  currentUser: any = null;

  filters: RoomSearchFilters = {
    checkIn: '',
    checkOut: '',
    capacity: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    type: '',
  };

  roomTypes = [
    'Single',
    'Double',
    'Suite',
    'Deluxe Single',
    'Deluxe Double',
    'Family Suite',
  ];
  selectedView = 'grid'; // grid or list

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.setDefaultDates();
    this.loadRooms();
  }

  setDefaultDates(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.filters.checkIn = today.toISOString().split('T')[0];
    this.filters.checkOut = tomorrow.toISOString().split('T')[0];
  }

  loadRooms(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.roomService.getAllRooms(this.filters).subscribe({
      next: (response) => {
        this.rooms = response.rooms;
        this.filteredRooms = [...this.rooms];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onFilterChange(): void {
    this.loadRooms();
  }

  clearFilters(): void {
    this.filters = {
      checkIn: this.filters.checkIn,
      checkOut: this.filters.checkOut,
      capacity: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      type: '',
    };
    this.loadRooms();
  }

  bookRoom(roomId: string): void {
    this.router.navigate(['/book', roomId], {
      queryParams: {
        checkIn: this.filters.checkIn,
        checkOut: this.filters.checkOut,
        guests: this.filters.capacity || 1,
      },
    });
  }

  toggleView(): void {
    this.selectedView = this.selectedView === 'grid' ? 'list' : 'grid';
  }

  getRoomTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      Single:
        'M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H20V18Z',
      Double:
        'M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2H6M6,4H18V20H6V4Z',
      Suite:
        'M12,3L2,12H5V20H19V12H22L12,3M12,8.75A1.25,1.25 0 0,1 13.25,10A1.25,1.25 0 0,1 12,11.25A1.25,1.25 0 0,1 10.75,10A1.25,1.25 0 0,1 12,8.75Z',
      'Deluxe Single':
        'M9,1V3H15V1H17V3H21A2,2 0 0,1 23,5V19A2,2 0 0,1 21,21H3A2,2 0 0,1 1,19V5A2,2 0 0,1 3,3H7V1H9M21,8H3V19H21V8Z',
      'Deluxe Double':
        'M5,1V3H19V1H21V3H23A2,2 0 0,1 25,5V19A2,2 0 0,1 23,21H1A2,2 0 0,1 -1,19V5A2,2 0 0,1 1,3H3V1H5M23,8H1V19H23V8Z',
      'Family Suite':
        'M16,4C18.11,4 19.8,5.69 19.8,7.8C19.8,9.91 18.11,11.6 16,11.6C13.89,11.6 12.2,9.91 12.2,7.8C12.2,5.69 13.89,4 16,4M16,13.4C18.67,13.4 24,14.73 24,17.4V20H8V17.4C8,14.73 13.33,13.4 16,13.4Z',
    };
    return icons[type] || icons['Single'];
  }
}
