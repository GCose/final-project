import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this._isDarkMode.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }
  }

  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let isDark = false;

    try {
      const savedTheme =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('theme')
          : null;

      const prefersDark =
        typeof window !== 'undefined' && window.matchMedia
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false;

      isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    } catch (error) {
      console.warn('Error initializing theme:', error);
      isDark = false;
    }

    this.setTheme(isDark);
  }

  toggleTheme(): void {
    this.setTheme(!this._isDarkMode.value);
  }

  setTheme(isDark: boolean): void {
    this._isDarkMode.next(isDark);

    if (!isPlatformBrowser(this.platformId)) return;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      }

      if (typeof document !== 'undefined' && document.documentElement) {
        if (isDark) {
          document.documentElement.classList.add('dark-theme');
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
          document.documentElement.classList.remove('dark-theme');
        }
      }
    } catch (error) {
      console.warn('Error setting theme:', error);
    }
  }

  getCurrentTheme(): boolean {
    return this._isDarkMode.value;
  }

  isDarkMode(): boolean {
    return this._isDarkMode.value;
  }
}
