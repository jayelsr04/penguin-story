import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';

const OLD_CODE = `const errors = f.email().errors();
const requiredError =
  errors.find(e =>
    e.kind === 'required');

if (requiredError) {
  // show the message
}`;

const NEW_CODE = `const requiredError =
  getError(f.email, 'required');

if (requiredError) {
  // show the message
}
// direct lookup, no searching`;

@Component({
  selector: 'app-nurse-station',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent],
  template: `
    <app-room-shell
      title="The Nurse's Station"
      subtitle="A patient's chart lists every symptom. To find one specific symptom, do you read the whole chart, or just ask for it?"
      [stopIndex]="8"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="chart-scene">
        <span class="pip pip-md"><app-penguin [mood]="scanning() ? 'busy' : 'confused'" /></span>
        <div class="clipboard">
          @for (s of symptoms; track s; let i = $index) {
            <div class="symptom" [class.scanned]="scanIndex() > i" [class.found]="s === 'required' && scanIndex() > i">
              {{ s }}
            </div>
          }
        </div>
        <button type="button" class="tile-btn action-btn" (click)="scanOld()">
          {{ scanIndex() >= symptoms.length ? 'Reset' : 'Scan chart' }}
        </button>
        <div class="stat">{{ scanIndex() }} / {{ symptoms.length }} steps</div>
      </div>

      <div new class="chart-scene">
        <span class="pip pip-md"><app-penguin [mood]="newFound() ? 'proud' : 'happy'" /></span>
        <div class="clipboard">
          @for (s of symptoms; track s) {
            <div class="symptom" [class.found]="s === 'required' && newFound()">{{ s }}</div>
          }
        </div>
        <button type="button" class="tile-btn action-btn" (click)="askNew()">
          {{ newFound() ? 'Reset' : 'Ask directly' }}
        </button>
        <div class="stat" [class.win]="newFound()">{{ newFound() ? '1 step — done' : 'click to ask' }}</div>
      </div>
    </app-room-shell>
  `,
  styles: [`
    .chart-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
    }
    .clipboard {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 140px;
    }
    .symptom {
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 600;
      color: var(--ink-faint);
      transition: color 0.2s ease, background 0.2s ease;
      padding: 2px 6px;
      border-radius: 2px;
    }
    .symptom.scanned { background: var(--surface-2); color: var(--ink); }
    .symptom.found { background: var(--surface-accent); color: var(--accent); }
    .action-btn {
      font-family: var(--sans);
      font-weight: 700;
      font-size: 12.5px;
      color: var(--ink);
      padding: 8px 16px;
    }
  `],
})
export class NurseStationComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  symptoms = ['tooShort', 'required', 'missingNumber', 'noSpecialChar'];
  scanIndex = signal(0);
  scanning = signal(false);
  newFound = signal(false);
  engaged = signal(false);

  scanOld() {
    if (this.scanning()) return;
    if (this.scanIndex() >= this.symptoms.length) {
      this.scanIndex.set(0);
      return;
    }
    this.scanning.set(true);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      this.scanIndex.set(i);
      if (i >= this.symptoms.length) {
        clearInterval(timer);
        this.scanning.set(false);
      }
    }, 280);
  }

  askNew() {
    this.engaged.set(true);
    this.newFound.update((v) => !v);
  }
}
