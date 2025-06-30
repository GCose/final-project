import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BookingService, Booking } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  isLoading = false;
  currentUser: any = null;
  selectedFilter = 'all';
  successMessage = '';

  constructor(
    public bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.checkForSuccessMessage();
    this.loadBookings();
  }

  checkForSuccessMessage(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['success']) {
        this.successMessage = params['success'];
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 5000);
      }
    });
  }

  loadBookings(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.bookingService.getAllBookings().subscribe({
      next: (response: { bookings: Booking[] }) => {
        this.bookings = response.bookings;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error loading bookings:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  applyFilter(): void {
    switch (this.selectedFilter) {
      case 'confirmed':
        this.filteredBookings = this.bookings.filter(
          (b) => b.status === 'confirmed'
        );
        break;
      case 'pending':
        this.filteredBookings = this.bookings.filter(
          (b) => b.status === 'pending'
        );
        break;
      case 'cancelled':
        this.filteredBookings = this.bookings.filter(
          (b) => b.status === 'cancelled'
        );
        break;
      case 'upcoming':
        this.filteredBookings = this.bookings.filter(
          (b) =>
            new Date(b.checkInDate) > new Date() && b.status !== 'cancelled'
        );
        break;
      case 'past':
        this.filteredBookings = this.bookings.filter(
          (b) => new Date(b.checkOutDate) < new Date()
        );
        break;
      default:
        this.filteredBookings = [...this.bookings];
    }
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  cancelBooking(bookingId: string): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: (error: any) => {
        console.error('Error cancelling booking:', error);
      },
    });
  }

  canCancelBooking(booking: Booking): boolean {
    const checkInDate = new Date(booking.checkInDate);
    const today = new Date();
    const daysDifference = Math.ceil(
      (checkInDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    return booking.status === 'confirmed' && daysDifference >= 1;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      'checked-in': 'status-checked-in',
      'checked-out': 'status-completed',
      cancelled: 'status-cancelled',
    };
    return statusClasses[status] || 'status-pending';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatReference(reference: string): string {
    return this.bookingService.formatBookingReference(reference);
  }
}
