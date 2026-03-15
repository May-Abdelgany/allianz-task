import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { SaltoGroup } from '../../models/saltogroup';
import { Salto } from '../../models/salto';
import { Box } from '../../models/box';
import { StorageService } from '../../../../core/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SaltosService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  readonly boxes = toSignal(this.storage.boxes$, { initialValue: [] });
  readonly selectedBox = toSignal(this.storage.selectedBox$, { initialValue: null });

  // Fetch salto groups from the API.
  fetchSaltos(): Observable<SaltoGroup[]> {
    return this.http
      .get<{ saltos: SaltoGroup[] }>('/saltos.json')
      .pipe(map((response) => response.saltos));
  }

  //  Handles the user selecting a salto option
  handleSaltoSelection(salto: Salto, type: string, previousSelection: Salto | null): void {
    this.recalculateTotalSaltos(salto, previousSelection);

    const box = this.selectedBox();
    if (!box) return;

    this.storage.updateBoxSalto(box.id, salto.id, type);
    this.selectNextBox(box);
  }

  //  Recalculates the total salto value.
  private recalculateTotalSaltos(salto: Salto, previousSelection: Salto | null): void {
    this.storage.totalSaltos$.pipe(take(1)).subscribe((currentTotal) => {
      const newTotal = currentTotal - (previousSelection?.value ?? 0) + salto.value;

      const roundedTotal = Math.round(newTotal * 100) / 100;

      this.storage.setTotalSaltos(roundedTotal);
    });
  }

  //Automatically selects the next box in the list.

  private selectNextBox(currentBox: Box): void {
    const boxes = this.boxes();
    const currentIndex = boxes.findIndex((b) => b.id === currentBox.id);
    const nextBox = boxes[currentIndex + 1];

    if (nextBox) {
      this.storage.setSelectedBox(nextBox);
    } else {
      this.storage.setSelectedBox(null);
    }
  }
}
