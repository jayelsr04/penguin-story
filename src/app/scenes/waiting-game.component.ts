import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { ResetButtonComponent } from '../shared/reset-button.component';
import { PenguinComponent } from '../penguin/penguin.component';

export const RECAP_LINE = "Only the slow async check waits — instant checks don't.";

const OLD_CODE = `debounce(f.username, 500);

minLength(f.username, 3);
// instant check, forced
// to wait anyway

validateAsync(f.username, {
  request: (value) =>
    checkUsernameAvailable(value),
});`;

const NEW_CODE = `minLength(f.username, 3);
// reacts instantly, no delay

validateAsync(f.username, {
  request: (value) =>
    checkUsernameAvailable(value),
  debounce: 500,
  // ONLY this waits 500ms
});`;

type TriState = 'idle' | 'checking' | 'done';

@Component({
  selector: 'app-waiting-game',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
  template: `
    <app-room-shell
      title="The Fish Counter Line"
      subtitle="One question is instant. One question takes time. Should they make you wait the same amount?"
      [stopIndex]="6"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="counter-scene">
        <span class="pip pip-md counter-pip"><app-penguin [mood]="oldState() === 'checking' ? 'busy' : 'confused'" /></span>
        <div class="question">
          <span>Is your name spelled right? <span class="tag">(instant)</span></span>
          <span class="status" [class.stuck]="oldState() !== 'idle'">
            {{ oldState() === 'idle' ? '—' : oldState() === 'checking' ? 'waiting…' : 'yes ✓' }}
          </span>
        </div>
        <div class="question">
          <span>Is there a fish left? <span class="tag">(back-room check)</span></span>
          <span class="status" [class.stuck]="oldState() !== 'idle'">
            {{ oldState() === 'idle' ? '—' : oldState() === 'checking' ? 'waiting…' : 'yes ✓' }}
          </span>
        </div>
        <button type="button" class="tile-btn action-btn" [disabled]="oldState() !== 'idle'" (click)="askOld()">Ask both</button>
        <app-reset-button [disabled]="oldState() === 'idle'" (reset)="resetOld()" />
      </div>

      <div new class="counter-scene">
        <span class="pip pip-md counter-pip"><app-penguin [mood]="newFishState() === 'checking' ? 'busy' : (engaged() ? 'proud' : 'happy')" /></span>
        <div class="question">
          <span>Is your name spelled right? <span class="tag">(instant)</span></span>
          <span class="status" [class.instant]="newNameDone()">{{ newNameDone() ? 'yes ✓' : '—' }}</span>
        </div>
        <div class="question">
          <span>Is there a fish left? <span class="tag">(back-room check)</span></span>
          <span class="status" [class.checking]="newFishState() === 'checking'" [class.done]="newFishState() === 'done'">
            {{ newFishState() === 'idle' ? '—' : newFishState() === 'checking' ? 'checking…' : 'yes ✓' }}
          </span>
        </div>
        <button type="button" class="tile-btn action-btn" [disabled]="newFishState() !== 'idle'" (click)="askNew()">Ask both</button>
        <app-reset-button [disabled]="newFishState() === 'idle'" (reset)="resetNew()" />
      </div>

      <div old-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="wg-old-username">Choose a username</label>
          <input id="wg-old-username" type="text" class="real-input" [value]="realOldUsername()" (input)="onRealOldUsernameInput($event)" />
        </div>
        @if (realOldMsg() === 'short') {
          <div class="real-error">At least 3 characters</div>
        } @else if (realOldMsg() === 'checking') {
          <div class="real-hint">checking availability…</div>
        } @else if (realOldMsg() === 'available') {
          <div class="real-hint">Available ✓</div>
        } @else if (realOldMsg() === 'taken') {
          <div class="real-error">Already taken</div>
        }
        <app-reset-button [disabled]="!realOldUsername()" (reset)="resetRealOldUsername()" />
      </div>

      <div new-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="wg-new-username">Choose a username</label>
          <input id="wg-new-username" type="text" class="real-input" [value]="realNewUsername()" (input)="onRealNewUsernameInput($event)" />
        </div>
        @if (realNewShort()) {
          <div class="real-error">At least 3 characters</div>
        }
        @if (realNewAvail() === 'checking') {
          <div class="real-hint">checking availability…</div>
        } @else if (realNewAvail() === 'available') {
          <div class="real-hint">Available ✓</div>
        } @else if (realNewAvail() === 'taken') {
          <div class="real-error">Already taken</div>
        }
        <app-reset-button [disabled]="!realNewUsername()" (reset)="resetRealNewUsername()" />
      </div>
    </app-room-shell>
  `,
  styles: [`
    .counter-scene {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    .counter-pip { align-self: center; }
    .question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink);
    }
    .tag {
      font-weight: 500;
      font-size: 11px;
      color: var(--ink-faint);
    }
    .status {
      font-family: var(--mono);
      font-weight: 700;
      font-size: 12.5px;
      color: var(--ink-faint);
      transition: all 0.3s ease;
    }
    .status.stuck { color: var(--ink-muted); }
    .status.instant { color: var(--accent); animation: pop 0.3s ease; }
    .status.checking { color: var(--ink-muted); }
    .status.done { color: var(--accent); animation: pop 0.3s ease; }
    @keyframes pop {
      from { transform: scale(0.6); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .action-btn {
      font-family: var(--sans);
      font-weight: 700;
      font-size: 12.5px;
      color: var(--ink);
      padding: 8px 16px;
      align-self: center;
    }
  `],
})
export class WaitingGameComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  oldState = signal<TriState>('idle');
  newNameDone = signal(false);
  newFishState = signal<TriState>('idle');
  engaged = signal(false);

  askOld() {
    if (this.oldState() !== 'idle') return;
    this.oldState.set('checking');
    setTimeout(() => this.oldState.set('done'), 900);
  }

  resetOld() {
    this.oldState.set('idle');
  }

  askNew() {
    if (this.newFishState() !== 'idle') return;
    this.engaged.set(true);
    this.newNameDone.set(true);
    this.newFishState.set('checking');
    setTimeout(() => this.newFishState.set('done'), 900);
  }

  resetNew() {
    this.newNameDone.set(false);
    this.newFishState.set('idle');
  }

  realOldUsername = signal('');
  realOldMsg = signal<'idle' | 'short' | 'checking' | 'available' | 'taken'>('idle');
  private realOldTimer?: ReturnType<typeof setTimeout>;

  realNewUsername = signal('');
  realNewShort = signal(false);
  realNewAvail = signal<'idle' | 'checking' | 'available' | 'taken'>('idle');
  private realNewTimer?: ReturnType<typeof setTimeout>;

  onRealOldUsernameInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.realOldUsername.set(value);
    clearTimeout(this.realOldTimer);
    this.realOldMsg.set('idle');
    if (!value) return;
    // Bug: even the instant length check is stuck behind the same debounce.
    this.realOldTimer = setTimeout(() => {
      if (value.length < 3) {
        this.realOldMsg.set('short');
        return;
      }
      this.realOldMsg.set('checking');
      setTimeout(() => this.realOldMsg.set(value.toLowerCase() === 'admin' ? 'taken' : 'available'), 500);
    }, 600);
  }

  resetRealOldUsername() {
    clearTimeout(this.realOldTimer);
    this.realOldUsername.set('');
    this.realOldMsg.set('idle');
  }

  onRealNewUsernameInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.realNewUsername.set(value);
    this.realNewShort.set(!!value && value.length < 3);
    clearTimeout(this.realNewTimer);
    this.realNewAvail.set('idle');
    if (value.length >= 3) {
      this.realNewTimer = setTimeout(() => {
        this.engaged.set(true);
        this.realNewAvail.set('checking');
        setTimeout(() => this.realNewAvail.set(value.toLowerCase() === 'admin' ? 'taken' : 'available'), 500);
      }, 600);
    }
  }

  resetRealNewUsername() {
    clearTimeout(this.realNewTimer);
    this.realNewUsername.set('');
    this.realNewShort.set(false);
    this.realNewAvail.set('idle');
  }
}
