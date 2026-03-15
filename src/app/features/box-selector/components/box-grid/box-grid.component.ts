import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BoxComponent } from '../box/box.component';
import { BoxService } from '../../services/box/box.service';
import { StorageService } from '../../../../core/services/storage/storage.service';

@Component({
  selector: 'app-box-grid',
  imports: [BoxComponent],
  templateUrl: './box-grid.component.html',
  styleUrl: './box-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxGridComponent {
  private readonly boxService = inject(BoxService);
  private readonly storage = inject(StorageService);

  //  Signal representing the current boxes list from the global store.
  readonly boxes = toSignal(this.storage.boxes$, { initialValue: [] });

  //  Initializes boxes data.
  //  Loads boxes from localStorage if available,
  //  otherwise fetches them from the API and updates the store.
  ngOnInit(): void {
    this.boxService.initializeBoxes();
  }
}
