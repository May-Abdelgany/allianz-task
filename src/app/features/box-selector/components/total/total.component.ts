import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { StorageService } from '../../../../core/services/storage/storage.service';
import { BoxService } from '../../services/box/box.service';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalComponent {
  private readonly storage = inject(StorageService);
  private readonly boxService = inject(BoxService);

  // Reactive signal representing the total salto value.
  readonly totalSaltos = toSignal(this.storage.totalSaltos$, { initialValue: 0 });

  // Resets all boxes by reloading them from the API
  // and clearing the current application state.
  resetBoxes(): void {
    this.boxService.loadBoxesFromApi();
  }
}
