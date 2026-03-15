import {
  Component,
  inject,
  computed,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import { SaltosService } from '../../services/saltos/saltos.service';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { Salto } from '../../models/salto';
import { SaltoGroup } from '../../models/saltogroup';

@Component({
  selector: 'app-option-selector',
  templateUrl: './option-selector.component.html',
  styleUrl: './option-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionSelectorComponent {
  private readonly saltosService = inject(SaltosService);
  private readonly storage = inject(StorageService);

  // Global reactive state converted to signals for synchronous usage.
  readonly totalSaltos = toSignal(this.storage.totalSaltos$, { initialValue: 0 });
  readonly selectedBox = toSignal(this.storage.selectedBox$, { initialValue: null });

  // Fetch salto groups and store them in the global storage.
  readonly saltoGroups = toSignal(
    this.saltosService.fetchSaltos().pipe(tap((groups) => this.storage.setSaltoGroups(groups))),
    { initialValue: [] as SaltoGroup[] },
  );

  // Tracks the currently selected salto type.
  // Used for UI filtering.
  readonly selectedSaltoType = signal<string | null>(null);

  constructor() {
    // Sync the selected salto type whenever the selected box changes.
    effect(() => {
      const box = this.selectedBox();
      if (box?.saltoType) {
        this.selectedSaltoType.set(box.saltoType);
      }
    });
  }

  // Returns the currently selected salto option for the selected box.
  readonly selectedSaltoOption = computed(() => {
    const box = this.selectedBox();
    const groups = this.saltoGroups();

    if (!box || !box.saltoId || !box.saltoType) {
      return null;
    }

    const group = groups.find((g) => g.type === box.saltoType);

    return group?.items?.find((item) => item.id === box.saltoId) ?? null;
  });

  // Handles user selecting a salto option.
  onSelectOption(salto: Salto, type: string): void {
    const previousSelection = this.selectedSaltoOption();

    this.saltosService.handleSaltoSelection(salto, type, previousSelection);
  }
}
