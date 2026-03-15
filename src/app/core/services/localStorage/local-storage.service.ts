import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setLocalStorage(key: string, data: string) {
    localStorage.setItem(key, data);
  }
  getLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }
}
