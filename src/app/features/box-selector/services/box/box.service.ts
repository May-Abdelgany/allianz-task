import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

import { Box } from '../../models/box';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { LocalStorageService } from '../../../../core/services/localStorage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly localStorage = inject(LocalStorageService);

  readonly selectedBox = toSignal(this.storage.selectedBox$, { initialValue: null });

  // Fetches all boxes from the backend API.
  fetchBoxes(): Observable<Box[]> {
    return this.http.get<Box[]>('/boxes.json');
  }

  //Loads boxes from the API and resets the application state.
  loadBoxesFromApi(): void {
    this.fetchBoxes().subscribe((boxes) => {
      if (!boxes) return;

      this.storage.setBoxes(boxes);
      this.storage.setTotalSaltos(0);
      this.storage.setSelectedBox(null);

      this.localStorage.setLocalStorage('boxes', JSON.stringify(boxes));
    });
  }

  // Initializes boxes data.
  initializeBoxes(): void {
    const storedBoxes = this.localStorage.getLocalStorage('boxes');

    if (storedBoxes) {
      const parsedBoxes = JSON.parse(storedBoxes);
      const storedTotal = this.localStorage.getLocalStorage('total');

      this.storage.setBoxes(parsedBoxes);

      if (storedTotal) {
        this.storage.setTotalSaltos(JSON.parse(storedTotal));
      }
    } else {
      this.loadBoxesFromApi();
    }
  }

  // Handles box selection toggle.
  toggleBoxSelection(box: Box, isCurrentlySelected: boolean): void {
    if (isCurrentlySelected) {
      this.storage.setSelectedBox(null);
    } else {
      this.storage.setSelectedBox(box);
    }
  }
}
