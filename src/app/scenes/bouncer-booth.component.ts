import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = 'minDate()/maxDate() do the date math for you.';

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
  date: Date;
}

// Same bounds shown in the printed code samples above — the verdicts below
// are computed against these, not hardcoded per case, so editing a case's
// date can never silently contradict the code shown next to it.
const MIN_DATE = new Date('2026-01-01');
const MAX_DATE = new Date('2026-12-31');

const CASES: DateCase[] = [
  { key: 'early', label: 'Jun 2025', date: new Date('2025-06-01') },
  { key: 'valid', label: 'Jun 2026', date: new Date('2026-06-01') },
  { key: 'future', label: 'Jan 2099', date: new Date('2099-01-01') },
];

@Component({
  selector: 'app-bouncer-booth',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
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
        <app-reset-button [disabled]="oldTestedCount() === 0" (reset)="resetOld()" />
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
        <app-reset-button [disabled]="newTestedCount() === 0" (reset)="resetNew()" />
      </div>

      <div old-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="bb-old-date">Appointment date</label>
          <input id="bb-old-date" type="date" class="real-input" [value]="realOldDate()" (change)="onRealOldDateChange($event)" />
        </div>
        @if (realOldResult() === 'tooEarly') {
          <div class="real-error">Please pick a date on or after today.</div>
        } @else if (realOldResult() === 'ok') {
          <div class="real-hint">Looks good ✓</div>
        }
        <app-reset-button [disabled]="!realOldDate()" (reset)="resetRealOld()" />
      </div>

      <div new-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="bb-new-date">Appointment date</label>
          <input id="bb-new-date" type="date" class="real-input" [class.invalid]="realNewResult() === 'tooEarly' || realNewResult() === 'tooLate'"
            [value]="realNewDate()" (change)="onRealNewDateChange($event)" />
        </div>
        @if (realNewResult() === 'tooEarly') {
          <div class="real-error">Please pick a date on or after today.</div>
        } @else if (realNewResult() === 'tooLate') {
          <div class="real-error">Please pick a date within the next 90 days.</div>
        } @else if (realNewResult() === 'ok') {
          <div class="real-hint">Looks good ✓</div>
        }
        <app-reset-button [disabled]="!realNewDate()" (reset)="resetRealNew()" />
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

  oldTestedCount() {
    return Object.values(this.oldResults()).filter((v) => v !== null).length;
  }

  newTestedCount() {
    return Object.values(this.newResults()).filter((v) => v !== null).length;
  }

  // The old validator only ever checks the lower bound — it has no
  // upper-bound branch at all, so a wildly future date sails through.
  private verdictOld(date: Date): Verdict {
    return date < MIN_DATE ? 'tooEarly' : 'ok';
  }

  private verdictNew(date: Date): Verdict {
    if (date < MIN_DATE) return 'tooEarly';
    if (date > MAX_DATE) return 'tooLate';
    return 'ok';
  }

  testOld(key: DateCase['key']) {
    if (this.oldResults()[key] !== null) return;
    const found = CASES.find((c) => c.key === key)!;
    this.oldResults.update((cur) => ({ ...cur, [key]: this.verdictOld(found.date) }));
  }

  resetOld() {
    this.oldResults.set({ early: null, valid: null, future: null });
  }

  testNew(key: DateCase['key']) {
    if (this.newResults()[key] !== null) return;
    this.engaged.set(true);
    const found = CASES.find((c) => c.key === key)!;
    this.newResults.update((cur) => ({ ...cur, [key]: this.verdictNew(found.date) }));
  }

  resetNew() {
    this.newResults.set({ early: null, valid: null, future: null });
  }

  private today = new Date(new Date().toDateString());
  private maxRealNewDate = new Date(this.today.getTime() + 90 * 24 * 60 * 60 * 1000);

  realOldDate = signal('');
  realOldResult = signal<Verdict>(null);
  realNewDate = signal('');
  realNewResult = signal<Verdict>(null);

  onRealOldDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.realOldDate.set(value);
    if (!value) {
      this.realOldResult.set(null);
      return;
    }
    this.realOldResult.set(new Date(value) < this.today ? 'tooEarly' : 'ok');
  }

  resetRealOld() {
    this.realOldDate.set('');
    this.realOldResult.set(null);
  }

  onRealNewDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.realNewDate.set(value);
    if (!value) {
      this.realNewResult.set(null);
      return;
    }
    const date = new Date(value);
    this.engaged.set(true);
    if (date < this.today) {
      this.realNewResult.set('tooEarly');
    } else if (date > this.maxRealNewDate) {
      this.realNewResult.set('tooLate');
    } else {
      this.realNewResult.set('ok');
    }
  }

  resetRealNew() {
    this.realNewDate.set('');
    this.realNewResult.set(null);
  }
}
