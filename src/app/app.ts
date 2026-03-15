import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BoxGridComponent } from './features/box-selector/components/box-grid/box-grid.component';
import { OptionSelectorComponent } from './features/box-selector/components/option-selector/option-selector.component';
import { TotalComponent } from './features/box-selector/components/total/total.component';

@Component({
  selector: 'app-root',
  imports: [BoxGridComponent, OptionSelectorComponent, TotalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('allianz-task');
}
