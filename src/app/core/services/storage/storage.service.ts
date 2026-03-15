import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject, take } from 'rxjs';

import { Box } from '../../../features/box-selector/models/box';
import { SaltoGroup } from '../../../features/box-selector/models/saltogroup';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Salto } from '../../../features/box-selector/models/salto';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly localStorage = inject(LocalStorageService);

  //  Holds the currently selected box.
  private readonly selectedBoxSubject = new Subject<Box | null>();
  readonly selectedBox$ = this.selectedBoxSubject.asObservable();

  // Updates the currently selected box.
  setSelectedBox(box: Box | null): void {
    this.selectedBoxSubject.next(box);
  }

  // Internal store for all boxes.
  private readonly boxesSubject = new BehaviorSubject<Box[]>([]);
  readonly boxes$ = this.boxesSubject.asObservable();

  // Replaces the entire boxes list and persists it in localStorage.
  setBoxes(boxes: Box[]): void {
    this.localStorage.setLocalStorage('boxes', JSON.stringify(boxes));
    this.boxesSubject.next(boxes);
  }

  // Updates a specific box by its id.
  updateBoxSalto(id: number, saltoId: number, saltoType: string): void {
    this.boxes$
      .pipe(
        take(1),
        map((boxes) =>
          boxes.map((box) =>
            box.id === id
              ? {
                  ...box,
                  saltoId,
                  saltoType,
                }
              : box,
          ),
        ),
      )
      .subscribe((updatedBoxes) => this.setBoxes(updatedBoxes));
  }

  // Holds the grouped saltos data.
  private readonly saltosSubject = new BehaviorSubject<SaltoGroup[] | null>(null);
  readonly saltos$ = this.saltosSubject.asObservable();

  // Updates the salto groups state.
  setSaltoGroups(groups: SaltoGroup[]): void {
    this.saltosSubject.next(groups);
  }

  // Emits when a salto option is selected.
  private readonly saltoOptionSelectedSubject = new Subject<{ salto: Salto; type: string }>();
  readonly saltoOptionSelected$ = this.saltoOptionSelectedSubject.asObservable();

  // Emits a new salto selection event.
  emitSaltoOptionSelected(data: { salto: Salto; type: string }): void {
    this.saltoOptionSelectedSubject.next(data);
  }

  // Stores the total number of selected saltos.
  private readonly totalSaltosSubject = new BehaviorSubject<number>(0);
  readonly totalSaltos$ = this.totalSaltosSubject.asObservable();

  // Updates the total number of saltos and persists it in localStorage.
  setTotalSaltos(total: number): void {
    this.localStorage.setLocalStorage('total', JSON.stringify(total));
    this.totalSaltosSubject.next(total);
  }
}
