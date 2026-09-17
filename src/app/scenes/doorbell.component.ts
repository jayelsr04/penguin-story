import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent, PenguinMood } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = "debounce can now wait for you to walk away, not just pause typing.";

const OLD_CODE = `debounce(f.guestName, 400);
// waits 400ms after each
// keystroke pause —
// that's the only wait mode
// there is`;

const NEW_CODE = `debounce(f.guestName, 400);
// same as before: keystroke

debounce(f.guestName, 400, 'blur');
// NEW: ignores typing pauses,
// waits until they step away`;

@Component({
  selector: 'app-doorbell',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
  template: `
    <app-room-shell
      title="The Guestbook Podium"
      subtitle="A guestbook only wants to check your name once you're done writing it. Should it wait for your pen to pause, or wait for you to actually step back?"
      [stopIndex]="5"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="podium-scene">
        <span class="pip pip-md"><app-penguin [mood]="oldMood()" /></span>
        <div class="podium">📖</div>
        <input
          type="text"
          class="guest-input"
          placeholder="Sign here…"
          [disabled]="oldResolved()"
          [value]="oldText()"
          (input)="onOldInput($event)"
        />
        <div class="stat" [class.win]="oldResolved()">{{ oldStatus() }}</div>
        <app-reset-button [disabled]="!oldResolved() && !oldText()" (reset)="resetOld()" />
      </div>

      <div new class="podium-scene">
        <span class="pip pip-md"><app-penguin [mood]="newMood()" /></span>
        <div class="podium">📖</div>
        <input
          type="text"
          class="guest-input"
          placeholder="Sign here…"
          [disabled]="newResolved()"
          [value]="newText()"
          (input)="onNewInput($event)"
          (blur)="onNewBlur()"
        />
        <div class="stat" [class.win]="newResolved()">{{ newStatus() }}</div>
        <app-reset-button [disabled]="!newResolved() && !newText()" (reset)="resetNew()" />
      </div>

      <div old-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="db-old-phone">Phone number</label>
          <input id="db-old-phone" type="tel" class="real-input" placeholder="(555) 123-4567"
            [value]="realOldPhone()" (input)="onRealOldPhoneInput($event)" (blur)="onRealOldPhoneBlur()" />
        </div>
        <div class="real-hint">{{ realOldFormatted() ? 'formatted ✓' : 'raw digits' }}</div>
        <app-reset-button [disabled]="!realOldPhone()" (reset)="resetRealOldPhone()" />
      </div>

      <div new-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="db-new-phone">Phone number</label>
          <input id="db-new-phone" type="tel" class="real-input" placeholder="(555) 123-4567"
            [value]="realNewPhone()" (input)="onRealNewPhoneInput($event)" (blur)="onRealNewPhoneBlur()" />
        </div>
        <div class="real-hint">{{ realNewFormatted() ? 'formatted ✓' : 'raw digits' }}</div>
        <app-reset-button [disabled]="!realNewPhone()" (reset)="resetRealNewPhone()" />
      </div>
    </app-room-shell>
  `,
  styles: [`
    .podium-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    .podium {
      font-size: 38px;
    }
    .guest-input {
      width: 100%;
      max-width: 200px;
      font-family: var(--sans);
      font-size: 13px;
      color: var(--ink);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 7px 10px;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .guest-input:focus {
      border-color: var(--accent);
    }
    .guest-input:disabled {
      opacity: 0.6;
    }
  `],
})
export class DoorbellComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  oldText = signal('');
  oldPending = signal(false);
  oldResolved = signal(false);
  private oldTimer?: ReturnType<typeof setTimeout>;

  newText = signal('');
  newPending = signal(false);
  newResolved = signal(false);
  private newTimer?: ReturnType<typeof setTimeout>;

  engaged = signal(false);

  onOldInput(event: Event) {
    if (this.oldResolved()) return;
    const value = (event.target as HTMLInputElement).value;
    this.oldText.set(value);
    this.engaged.set(true);
    clearTimeout(this.oldTimer);
    if (!value) {
      this.oldPending.set(false);
      return;
    }
    this.oldPending.set(true);
    this.oldTimer = setTimeout(() => {
      this.oldPending.set(false);
      this.oldResolved.set(true);
    }, 400);
  }

  resetOld() {
    clearTimeout(this.oldTimer);
    this.oldText.set('');
    this.oldPending.set(false);
    this.oldResolved.set(false);
  }

  onNewInput(event: Event) {
    if (this.newResolved()) return;
    this.newText.set((event.target as HTMLInputElement).value);
  }

  onNewBlur() {
    if (this.newResolved() || !this.newText()) return;
    this.engaged.set(true);
    this.newPending.set(true);
    clearTimeout(this.newTimer);
    this.newTimer = setTimeout(() => {
      this.newPending.set(false);
      this.newResolved.set(true);
    }, 400);
  }

  resetNew() {
    clearTimeout(this.newTimer);
    this.newText.set('');
    this.newPending.set(false);
    this.newResolved.set(false);
  }

  oldMood(): PenguinMood {
    if (this.oldPending()) return 'busy';
    return this.oldResolved() ? 'proud' : 'happy';
  }

  oldStatus() {
    if (this.oldPending()) return 'checking…';
    if (this.oldResolved()) return 'checked ✓';
    return 'sign the book';
  }

  newMood(): PenguinMood {
    if (this.newPending()) return 'busy';
    if (this.newResolved()) return 'proud';
    return this.newText() ? 'walking' : 'happy';
  }

  newStatus() {
    if (this.newPending()) return 'checking…';
    if (this.newResolved()) return 'checked ✓';
    return this.newText() ? 'still writing… (won\'t check yet)' : 'sign the book, then step away';
  }

  realOldPhone = signal('');
  realOldFormatted = signal(false);
  private realOldPhoneTimer?: ReturnType<typeof setTimeout>;

  realNewPhone = signal('');
  realNewFormatted = signal(false);

  private formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  onRealOldPhoneInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    this.realOldPhone.set(raw);
    this.realOldFormatted.set(false);
    clearTimeout(this.realOldPhoneTimer);
    // Old debounce mode only fires after a pause in typing — blurring away
    // before that pause elapses cancels the reformat entirely.
    this.realOldPhoneTimer = setTimeout(() => {
      this.realOldPhone.set(this.formatPhone(raw));
      this.realOldFormatted.set(true);
    }, 400);
  }

  onRealOldPhoneBlur() {
    clearTimeout(this.realOldPhoneTimer);
  }

  resetRealOldPhone() {
    clearTimeout(this.realOldPhoneTimer);
    this.realOldPhone.set('');
    this.realOldFormatted.set(false);
  }

  onRealNewPhoneInput(event: Event) {
    this.realNewPhone.set((event.target as HTMLInputElement).value);
    this.realNewFormatted.set(false);
  }

  onRealNewPhoneBlur() {
    if (!this.realNewPhone()) return;
    this.realNewPhone.set(this.formatPhone(this.realNewPhone()));
    this.realNewFormatted.set(true);
    this.engaged.set(true);
  }

  resetRealNewPhone() {
    this.realNewPhone.set('');
    this.realNewFormatted.set(false);
  }
}
