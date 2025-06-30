import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  _id: string;
  roomNumber: string;
  type:
    | 'Single'
    | 'Double'
    | 'Suite'
    | 'Deluxe Single'
    | 'Deluxe Double'
    | 'Family Suite';
  price: number;
  capacity: number;
  amenities: string[];
  description: string;
  images: string[];
  isAvailable: boolean;
  floor: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomSearchFilters {
  checkIn?: string;
  checkOut?: string;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
}

export interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'http://localhost:5000/api/rooms';

  constructor(private http: HttpClient) {}

  getAllRooms(
    filters?: RoomSearchFilters
  ): Observable<{ message: string; rooms: Room[]; total: number }> {
    let params = new HttpParams();

    if (filters) {
      if (filters.checkIn) params = params.set('checkIn', filters.checkIn);
      if (filters.checkOut) params = params.set('checkOut', filters.checkOut);
      if (filters.capacity)
        params = params.set('capacity', filters.capacity.toString());
      if (filters.minPrice)
        params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice)
        params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.type) params = params.set('type', filters.type);
    }

    return this.http.get<{ message: string; rooms: Room[]; total: number }>(
      this.apiUrl,
      { params }
    );
  }

  getRoomById(id: string): Observable<{ message: string; room: Room }> {
    return this.http.get<{ message: string; room: Room }>(
      `${this.apiUrl}/${id}`
    );
  }

  createRoom(
    room: Omit<Room, '_id' | 'createdAt' | 'updatedAt'>
  ): Observable<{ message: string; room: Room }> {
    return this.http.post<{ message: string; room: Room }>(this.apiUrl, room);
  }

  updateRoom(
    id: string,
    room: Partial<Room>
  ): Observable<{ message: string; room: Room }> {
    return this.http.put<{ message: string; room: Room }>(
      `${this.apiUrl}/${id}`,
      room
    );
  }

  deleteRoom(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  getRoomStats(): Observable<{ message: string; stats: RoomStats }> {
    return this.http.get<{ message: string; stats: RoomStats }>(
      `${this.apiUrl}/stats`
    );
  }

  getAvailableRoomTypes(): string[] {
    return [
      'Single',
      'Double',
      'Suite',
      'Deluxe Single',
      'Deluxe Double',
      'Family Suite',
    ];
  }

  getAmenityOptions(): string[] {
    return [
      'WiFi',
      'AC',
      'TV',
      'Mini Bar',
      'Balcony',
      'Kitchen',
      'Jacuzzi',
      'Ocean View',
      'City View',
      'Room Service',
    ];
  }
}
