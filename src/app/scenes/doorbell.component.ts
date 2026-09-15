import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent, PenguinMood } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = 'debounce can now wait for blur, not just typing.';

const OLD_CODE = `debounce(f.username, 300);
// waits 300ms after each
// keystroke pauses —
// that's the only wait mode
// there is`;

const NEW_CODE = `debounce(f.username, 300);
// same as before: keystroke

debounce(f.username, 300, 'blur');
// NEW: waits until they
// click away, then reacts`;

@Component({
  selector: 'app-doorbell',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
  template: `
    <app-room-shell
      title="The Doorbell"
      subtitle="A doorbell waits a moment before ringing, in case more presses are coming. Can it also wait for you to just... leave?"
      [stopIndex]="5"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="door-scene">
        <span class="pip pip-md"><app-penguin [mood]="oldPending() ? 'busy' : oldRinging() ? 'happy' : 'walking'" /></span>
        <div class="door">🚪<span class="bell" [class.ring]="oldRinging()">🔔</span></div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" [disabled]="oldPending() || oldRinging()" (click)="pressOld()">Press</button>
          <button type="button" class="tile-btn action-btn" disabled title="Not a wait mode in the old version">Walk away</button>
        </div>
        <div class="stat">{{ oldPending() ? 'waiting…' : oldRinging() ? 'rang' : 'click Press' }}</div>
        <app-reset-button [disabled]="!oldRinging()" (reset)="resetOld()" />
      </div>

      <div new class="door-scene">
        <span class="pip pip-md"><app-penguin [mood]="newMood()" /></span>
        <div class="door">🚪<span class="bell" [class.ring]="newRinging()">🔔</span></div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" [disabled]="newBusy()" (click)="pressNew()">Press</button>
          <button type="button" class="tile-btn action-btn" [disabled]="newBusy()" (click)="walkAwayNew()">Walk away</button>
        </div>
        <div class="stat" [class.win]="newRinging()">{{ newStatus() }}</div>
        <app-reset-button [disabled]="!newRinging()" (reset)="resetNew()" />
      </div>
    </app-room-shell>
  `,
  styles: [`
    .door-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    .door {
      position: relative;
      font-size: 38px;
    }
    .bell {
      position: absolute;
      top: -14px;
      right: -14px;
      font-size: 19px;
      transform: scale(1);
      transition: transform 0.15s ease;
    }
    .bell.ring { animation: ring 0.3s ease 2; }
    @keyframes ring {
      0%, 100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(18deg) scale(1.3); }
    }
    .btn-row { display: flex; gap: 8px; }
    .action-btn {
      font-family: var(--sans);
      font-weight: 700;
      font-size: 12px;
      color: var(--ink);
      padding: 7px 14px;
    }
  `],
})
export class DoorbellComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  oldRinging = signal(false);
  oldPending = signal(false);
  newRinging = signal(false);
  newPending = signal<'idle' | 'press' | 'walk'>('idle');
  engaged = signal(false);

  pressOld() {
    if (this.oldPending() || this.oldRinging()) return;
    this.oldPending.set(true);
    setTimeout(() => {
      this.oldPending.set(false);
      this.oldRinging.set(true);
    }, 400);
  }

  resetOld() {
    this.oldRinging.set(false);
    this.oldPending.set(false);
  }

  pressNew() {
    if (this.newPending() !== 'idle' || this.newRinging()) return;
    this.engaged.set(true);
    this.newPending.set('press');
    setTimeout(() => {
      this.newPending.set('idle');
      this.newRinging.set(true);
    }, 400);
  }

  walkAwayNew() {
    if (this.newPending() !== 'idle' || this.newRinging()) return;
    this.engaged.set(true);
    this.newPending.set('walk');
    setTimeout(() => {
      this.newPending.set('idle');
      this.newRinging.set(true);
    }, 400);
  }

  resetNew() {
    this.newRinging.set(false);
    this.newPending.set('idle');
  }

  newMood(): PenguinMood {
    if (this.newPending() === 'walk') return 'walking';
    if (this.newPending() === 'press') return 'busy';
    return this.newRinging() ? 'proud' : 'happy';
  }

  newBusy() {
    return this.newPending() !== 'idle' || this.newRinging();
  }

  newStatus() {
    if (this.newPending() === 'press') return 'pressing…';
    if (this.newPending() === 'walk') return 'walking away…';
    return this.newRinging() ? 'rang' : 'click either button';
  }
}
