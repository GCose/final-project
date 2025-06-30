import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RoomService, Room } from '../../../services/room.service';
import {
  BookingService,
  CreateBookingRequest,
} from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  room: Room | null = null;
  currentUser: any = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  bookingData: CreateBookingRequest = {
    roomId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
  };

  constructor(
    private roomService: RoomService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeForm();
    this.loadRoom();
  }

  initializeForm(): void {
    if (this.currentUser) {
      this.bookingData.guestName = this.currentUser.fullName || '';
      this.bookingData.guestEmail = this.currentUser.email || '';
    }

    // Get query parameters from room list
    this.route.queryParams.subscribe((params) => {
      if (params['checkIn']) this.bookingData.checkInDate = params['checkIn'];
      if (params['checkOut'])
        this.bookingData.checkOutDate = params['checkOut'];
      if (params['guests'])
        this.bookingData.numberOfGuests = parseInt(params['guests']);
    });

    // Set default dates if not provided
    if (!this.bookingData.checkInDate) {
      const today = new Date();
      this.bookingData.checkInDate = today.toISOString().split('T')[0];
    }
    if (!this.bookingData.checkOutDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.bookingData.checkOutDate = tomorrow.toISOString().split('T')[0];
    }
  }

  loadRoom(): void {
    const roomId = this.route.snapshot.paramMap.get('roomId');
    if (!roomId) {
      this.router.navigate(['/rooms']);
      return;
    }

    this.bookingData.roomId = roomId;
    this.isLoading = true;
    this.cdr.markForCheck();

    this.roomService.getRoomById(roomId).subscribe({
      next: (response) => {
        this.room = response.room;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading room:', error);
        this.errorMessage = 'Room not found';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  get numberOfNights(): number {
    if (!this.bookingData.checkInDate || !this.bookingData.checkOutDate)
      return 0;
    return this.bookingService.calculateNumberOfNights(
      this.bookingData.checkInDate,
      this.bookingData.checkOutDate
    );
  }

  get totalCost(): number {
    if (!this.room || this.numberOfNights <= 0) return 0;
    return this.bookingService.calculateBookingCost(
      this.bookingData.checkInDate,
      this.bookingData.checkOutDate,
      this.room.price
    );
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.bookingData.guestName.trim()) {
      this.errorMessage = 'Guest name is required';
      return false;
    }

    if (!this.bookingData.guestEmail.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.bookingData.guestPhone.trim()) {
      this.errorMessage = 'Phone number is required';
      return false;
    }

    if (!this.bookingData.checkInDate || !this.bookingData.checkOutDate) {
      this.errorMessage = 'Check-in and check-out dates are required';
      return false;
    }

    if (
      new Date(this.bookingData.checkInDate) >=
      new Date(this.bookingData.checkOutDate)
    ) {
      this.errorMessage = 'Check-out date must be after check-in date';
      return false;
    }

    if (new Date(this.bookingData.checkInDate) < new Date()) {
      this.errorMessage = 'Check-in date cannot be in the past';
      return false;
    }

    if (this.room && this.bookingData.numberOfGuests > this.room.capacity) {
      this.errorMessage = `This room can accommodate maximum ${this.room.capacity} guests`;
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.bookingService.createBooking(this.bookingData).subscribe({
      next: (response) => {
        this.router.navigate(['/my-bookings'], {
          queryParams: { success: 'Booking created successfully!' },
        });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error creating booking';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/rooms']);
  }
}
