import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<{ message: string; users: User[] }> {
    return this.http.get<{ message: string; users: User[] }>(
      `${this.apiUrl}/users`
    );
  }

  getUserById(id: string): Observable<{ message: string; user: User }> {
    return this.http.get<{ message: string; user: User }>(
      `${this.apiUrl}/users/${id}`
    );
  }

  updateUserRole(
    userId: string,
    roleName: string
  ): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(
      `${this.apiUrl}/users/${userId}/role`,
      {
        roleName,
      }
    );
  }

  deactivateUser(userId: string): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(
      `${this.apiUrl}/users/${userId}/deactivate`,
      {}
    );
  }

  getAllRoles(): Observable<{ message: string; roles: Role[] }> {
    return this.http.get<{ message: string; roles: Role[] }>(
      `${this.apiUrl}/roles`
    );
  }

  updateProfile(userData: any): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(
      `${this.apiUrl}/users/profile`,
      userData
    );
  }
}
