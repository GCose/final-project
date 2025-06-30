import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  room: {
    _id: string;
    roomNumber: string;
    type: string;
    price: number;
    amenities: string[];
  };
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfNights: number;
  pricePerNight: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  specialRequests: string;
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<{
    message: string;
    bookings: Booking[];
    total: number;
  }> {
    return this.http.get<{
      message: string;
      bookings: Booking[];
      total: number;
    }>(this.apiUrl);
  }

  getBookingById(
    id: string
  ): Observable<{ message: string; booking: Booking }> {
    return this.http.get<{ message: string; booking: Booking }>(
      `${this.apiUrl}/${id}`
    );
  }

  createBooking(
    bookingData: CreateBookingRequest
  ): Observable<{ message: string; booking: Booking }> {
    return this.http.post<{ message: string; booking: Booking }>(
      this.apiUrl,
      bookingData
    );
  }

  updateBooking(
    id: string,
    updates: Partial<Booking>
  ): Observable<{ message: string; booking: Booking }> {
    return this.http.put<{ message: string; booking: Booking }>(
      `${this.apiUrl}/${id}`,
      updates
    );
  }

  cancelBooking(id: string): Observable<{ message: string; booking: Booking }> {
    return this.http.put<{ message: string; booking: Booking }>(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );
  }

  getBookingStats(): Observable<{ message: string; stats: BookingStats }> {
    return this.http.get<{ message: string; stats: BookingStats }>(
      `${this.apiUrl}/stats`
    );
  }

  calculateBookingCost(
    checkIn: string,
    checkOut: string,
    pricePerNight: number
  ): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff * pricePerNight;
  }

  calculateNumberOfNights(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  formatBookingReference(reference: string): string {
    return reference.replace(/(.{3})/g, '$1-').slice(0, -1);
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      pending: '#ffc107',
      confirmed: '#28a745',
      'checked-in': '#007bff',
      'checked-out': '#6c757d',
      cancelled: '#dc3545',
    };
    return statusColors[status] || '#6c757d';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      'checked-in': 'Checked In',
      'checked-out': 'Checked Out',
      cancelled: 'Cancelled',
    };
    return statusLabels[status] || status;
  }
}
