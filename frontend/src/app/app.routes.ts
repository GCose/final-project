// =============================================================================
// UPDATE: frontend/src/app/app.routes.ts
// ADD these 3 new routes to your existing routes array
// =============================================================================

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'rooms',
    loadComponent: () =>
      import('./components/rooms/room-list/room-list.component').then(
        (m) => m.RoomListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'book/:roomId',
    loadComponent: () =>
      import('./components/bookings/booking-form/booking-form.component').then(
        (m) => m.BookingFormComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./components/bookings/my-bookings/my-bookings.component').then(
        (m) => m.MyBookingsComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
    data: { role: 'Admin' },
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
