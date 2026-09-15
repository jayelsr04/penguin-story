import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';

const OLD_CODE = `validate(f.startDate, ({ value }) => {
  const min = new Date('2026-01-01');
  return value() < min
    ? { kind: 'tooEarly' }
    : null;
});
// hand-written date math,
// every time — and nobody
// wrote the upper bound`;

const NEW_CODE = `minDate(f.startDate,
  new Date('2026-01-01'));

maxDate(f.endDate,
  new Date('2026-12-31'));
// built-in, one line each —
// both bounds, every time`;

type Verdict = 'ok' | 'tooEarly' | 'tooLate' | null;

interface DateCase {
  key: 'early' | 'valid' | 'future';
  label: string;
}

const CASES: DateCase[] = [
  { key: 'early', label: 'Jun 2025' },
  { key: 'valid', label: 'Jun 2026' },
  { key: 'future', label: 'Jan 2099' },
];

@Component({
  selector: 'app-bouncer-booth',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent],
  template: `
    <app-room-shell
      title="The Bouncer Booth"
      subtitle="Pip's bouncer checks birthdates at the rope. His hand-written check only looks at one end of the range — does the built-in stamp catch what he misses?"
      [stopIndex]="4"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="booth-scene">
        <div class="bouncer"><span class="pip pip-md"><app-penguin mood="confused" /></span></div>
        <div class="dates">
          @for (d of cases; track d.key) {
            <button type="button" class="tile-btn date-btn" (click)="testOld(d.key)">
              {{ d.label }}
              @if (oldResults()[d.key]) {
                <span class="result">{{ oldResults()[d.key] === 'tooEarly' ? '✗ too early' : '✓ okay' }}</span>
              }
            </button>
          }
        </div>
        <div class="stat">{{ oldAccepted() }} / 3 accepted</div>
      </div>

      <div new class="booth-scene">
        <div class="bouncer"><span class="pip pip-md"><app-penguin [mood]="engaged() ? 'proud' : 'happy'" /></span></div>
        <div class="dates">
          @for (d of cases; track d.key) {
            <button type="button" class="tile-btn date-btn" (click)="testNew(d.key)">
              {{ d.label }}
              @if (newResults()[d.key]) {
                <span class="result" [class.win]="newResults()[d.key] === 'ok'">
                  {{ newResults()[d.key] === 'tooEarly' ? '✗ too early' : newResults()[d.key] === 'tooLate' ? '✗ too late' : '✓ okay' }}
                </span>
              }
            </button>
          }
        </div>
        <div class="stat" [class.win]="newAccepted() === 1">{{ newAccepted() }} / 3 accepted</div>
      </div>
    </app-room-shell>
  `,
  styles: [`
    .booth-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    .bouncer { display: flex; justify-content: center; }
    .dates {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      max-width: 180px;
    }
    .date-btn {
      font-family: var(--sans);
      font-weight: 700;
      font-size: 12.5px;
      color: var(--ink);
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .result {
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--ink-faint);
    }
    .result.win { color: var(--accent); }
  `],
})
export class BouncerBoothComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;
  cases = CASES;

  oldResults = signal<Record<DateCase['key'], Verdict>>({ early: null, valid: null, future: null });
  newResults = signal<Record<DateCase['key'], Verdict>>({ early: null, valid: null, future: null });
  engaged = signal(false);

  oldAccepted() {
    return Object.values(this.oldResults()).filter((v) => v === 'ok').length;
  }

  newAccepted() {
    return Object.values(this.newResults()).filter((v) => v === 'ok').length;
  }

  testOld(key: DateCase['key']) {
    const r = this.oldResults();
    if (Object.values(r).every((v) => v !== null)) {
      this.oldResults.set({ early: null, valid: null, future: null });
      return;
    }
    // The old validator only ever checks the lower bound — it has no
    // upper-bound branch at all, so a wildly future date sails through.
    const verdict: Verdict = key === 'early' ? 'tooEarly' : 'ok';
    this.oldResults.update((cur) => ({ ...cur, [key]: verdict }));
  }

  testNew(key: DateCase['key']) {
    this.engaged.set(true);
    const r = this.newResults();
    if (Object.values(r).every((v) => v !== null)) {
      this.newResults.set({ early: null, valid: null, future: null });
      return;
    }
    const verdict: Verdict = key === 'early' ? 'tooEarly' : key === 'future' ? 'tooLate' : 'ok';
    this.newResults.update((cur) => ({ ...cur, [key]: verdict }));
  }
}
