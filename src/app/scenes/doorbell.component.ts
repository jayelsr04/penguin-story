import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';

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
  imports: [RoomShellComponent],
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
        <div class="door">🚪<span class="bell" [class.ring]="oldRinging()">🔔</span></div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" (click)="pressOld()">Press</button>
          <button type="button" class="tile-btn action-btn" disabled title="Not a wait mode in the old version">Walk away</button>
        </div>
        <div class="stat">{{ oldRinging() ? 'rang — click Press to reset' : 'click Press' }}</div>
      </div>

      <div new class="door-scene">
        <div class="door">🚪<span class="bell" [class.ring]="newRinging()">🔔</span></div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" (click)="triggerNew()">Press</button>
          <button type="button" class="tile-btn action-btn" (click)="triggerNew()">Walk away</button>
        </div>
        <div class="stat" [class.win]="newRinging()">{{ newRinging() ? 'rang — click either to reset' : 'click either button' }}</div>
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
  newRinging = signal(false);
  engaged = signal(false);

  pressOld() {
    if (this.oldRinging()) {
      this.oldRinging.set(false);
      return;
    }
    setTimeout(() => this.oldRinging.set(true), 400);
  }

  triggerNew() {
    this.engaged.set(true);
    if (this.newRinging()) {
      this.newRinging.set(false);
      return;
    }
    setTimeout(() => this.newRinging.set(true), 400);
  }
}
