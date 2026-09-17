import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = 'getError(kind) looks up one error directly.';

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
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
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
          @for (s of symptoms; track s.kind; let i = $index) {
            <div class="symptom" [class.scanned]="scanIndex() > i" [class.found]="s.kind === 'required' && scanIndex() > i">
              {{ s.kind }} <span class="gloss">({{ s.gloss }})</span>
            </div>
          }
        </div>
        <button type="button" class="tile-btn action-btn" [disabled]="scanning() || scanIndex() > 0" (click)="scanOld()">Scan chart</button>
        <div class="stat">{{ scanIndex() }} / {{ symptoms.length }} steps</div>
        <app-reset-button [disabled]="scanning() || scanIndex() === 0" (reset)="resetOld()" />
      </div>

      <div new class="chart-scene">
        <span class="pip pip-md"><app-penguin [mood]="newFound() ? 'proud' : 'happy'" /></span>
        <div class="clipboard">
          @for (s of symptoms; track s.kind) {
            <div class="symptom" [class.found]="s.kind === 'required' && newFound()">{{ s.kind }} <span class="gloss">({{ s.gloss }})</span></div>
          }
        </div>
        <button type="button" class="tile-btn action-btn" [disabled]="newFound()" (click)="askNew()">Ask directly</button>
        <div class="stat" [class.win]="newFound()">{{ newFound() ? '1 step — done' : 'click to ask' }}</div>
        <app-reset-button [disabled]="!newFound()" (reset)="resetNew()" />
      </div>

      <div old-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="ns-old-pass">Create password</label>
          <input id="ns-old-pass" type="password" class="real-input" [class.invalid]="oldPasswordFailing()"
            [value]="realOldPassword()" (input)="onRealOldPasswordInput($event)" />
        </div>
        @if (oldPasswordFailing()) {
          <div class="real-error-summary">
            Password requirements:
            <ul>
              @for (r of ruleChecks; track r.key) { <li>{{ r.label }}</li> }
            </ul>
          </div>
        }
        <app-reset-button [disabled]="!realOldPassword()" (reset)="resetRealOldPassword()" />
      </div>

      <div new-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="ns-new-pass">Create password</label>
          <input id="ns-new-pass" type="password" class="real-input" [class.invalid]="newFailingRules().length > 0"
            [value]="realNewPassword()" (input)="onRealNewPasswordInput($event)" />
        </div>
        @for (r of newFailingRules(); track r.key) {
          <div class="real-error">{{ r.label }}</div>
        }
        <app-reset-button [disabled]="!realNewPassword()" (reset)="resetRealNewPassword()" />
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
    .gloss {
      font-weight: 500;
      color: var(--ink-faint);
    }
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

  symptoms = [
    { kind: 'tooShort', gloss: 'too short' },
    { kind: 'required', gloss: 'left blank' },
    { kind: 'missingNumber', gloss: 'no number' },
    { kind: 'noSpecialChar', gloss: 'no special character' },
  ];
  scanIndex = signal(0);
  scanning = signal(false);
  newFound = signal(false);
  engaged = signal(false);

  scanOld() {
    if (this.scanning() || this.scanIndex() > 0) return;
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

  resetOld() {
    this.scanIndex.set(0);
    this.scanning.set(false);
  }

  askNew() {
    if (this.newFound()) return;
    this.engaged.set(true);
    this.newFound.set(true);
  }

  resetNew() {
    this.newFound.set(false);
  }

  ruleChecks = [
    { key: 'length', label: 'Must be 8+ characters', test: (v: string) => v.length >= 8 },
    { key: 'number', label: 'Must contain a number', test: (v: string) => /\d/.test(v) },
    { key: 'symbol', label: 'Must contain a symbol', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
  ];

  realOldPassword = signal('');
  realNewPassword = signal('');

  onRealOldPasswordInput(event: Event) {
    this.realOldPassword.set((event.target as HTMLInputElement).value);
  }

  oldPasswordFailing() {
    const value = this.realOldPassword();
    return !!value && this.ruleChecks.some((r) => !r.test(value));
  }

  resetRealOldPassword() {
    this.realOldPassword.set('');
  }

  onRealNewPasswordInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.realNewPassword.set(value);
    if (value) this.engaged.set(true);
  }

  newFailingRules() {
    const value = this.realNewPassword();
    if (!value) return [];
    return this.ruleChecks.filter((r) => !r.test(value));
  }

  resetRealNewPassword() {
    this.realNewPassword.set('');
  }
}
