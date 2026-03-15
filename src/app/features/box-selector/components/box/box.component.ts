import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { StorageService } from '../../../../core/services/storage/storage.service';
import { BoxService } from '../../services/box/box.service';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  private readonly storage = inject(StorageService);
  private readonly boxService = inject(BoxService);

  // Input boxId coming from the parent list.
  readonly boxId = input.required<number>();

  // Reactive state from the global store converted to signals so they can be consumed synchronously in the template.
  readonly boxes = toSignal(this.storage.boxes$, { initialValue: [] });
  readonly selectedBox = toSignal(this.storage.selectedBox$, { initialValue: null });
  readonly saltoGroups = toSignal(this.storage.saltos$, { initialValue: [] });

  // Select the current box based on the input `boxId`.
  readonly box = computed(() => this.boxes().find((box) => box.id === this.boxId()));

  // Returns the latest version of this box from the store.
  readonly currentBox = computed(() => {
    const inputBox = this.box();
    const boxes = this.boxes();

    return boxes.find((b) => b.id === inputBox?.id) ?? inputBox;
  });

  // Determines if this box is currently selected.
  readonly isSelected = computed(() => {
    const selected = this.selectedBox();
    const box = this.currentBox();

    return selected?.id === box?.id;
  });

  // Returns the selected salto option associated with this box.
  readonly selectedSaltoOption = computed(() => {
    const box = this.currentBox();
    const groups = this.saltoGroups();

    if (!groups || !box?.saltoId || !box.saltoType) {
      return null;
    }

    const group = groups.find((g) => g.type === box.saltoType);

    return group?.items?.find((item) => item.id === box.saltoId) ?? null;
  });

  // Handles user clicking the box.
  // Toggles box selection through the BoxService.
  onBoxClick(): void {
    const box = this.currentBox();
    if (box) {
      const isSelected = this.isSelected();

      this.boxService.toggleBoxSelection(box, isSelected);
    }
  }
}
