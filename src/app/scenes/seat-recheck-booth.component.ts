import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';

const OLD_CODE = `this.usernameControl
  .updateValueAndValidity();
// borrowed from the OLD
// Reactive Forms system —
// Signal Forms had no
// version of this at all`;

const NEW_CODE = `reloadValidation(f.username);

onTeamRosterChanged() {
  reloadValidation(f.teamMembers);
  // re-verify everyone,
  // right now
}`;

@Component({
  selector: 'app-seat-recheck-booth',
  standalone: true,
  imports: [RoomShellComponent],
  template: `
    <app-room-shell
      title="The Seat Re-Check Booth"
      subtitle="The seat itself gets taken in real time. The question is whether the form's own display ever catches up."
      [stopIndex]="7"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="theater-scene">
        <div class="row">
          <div class="seat filled"></div>
          <div class="seat filled"></div>
          <div class="seat tracked" [class.filled]="oldBooked()"></div>
          <div class="seat filled"></div>
          <div class="seat filled"></div>
        </div>
        <div class="stat">form still says: Available</div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" (click)="toggleOldBooked()">
            {{ oldBooked() ? 'Reset' : 'Someone books it' }}
          </button>
          <button type="button" class="tile-btn action-btn" disabled title="Nothing rechecks it in the old version">Recheck</button>
        </div>
      </div>

      <div new class="theater-scene">
        <div class="row">
          <div class="seat filled"></div>
          <div class="seat filled"></div>
          <div class="seat tracked" [class.filled]="newBooked()"></div>
          <div class="seat filled"></div>
          <div class="seat filled"></div>
        </div>
        <div class="stat" [class.win]="newFormUpdated()">form says: {{ newFormUpdated() ? 'Taken' : 'Available' }}</div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" (click)="toggleNewBooked()">
            {{ newFormUpdated() ? 'Reset' : 'Someone books it' }}
          </button>
          <button type="button" class="tile-btn action-btn" [class.pulse]="newBooked() && !newFormUpdated()" (click)="recheckNew()">
            Recheck
          </button>
        </div>
      </div>
    </app-room-shell>
  `,
  styles: [`
    .theater-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    .row { display: flex; gap: 6px; }
    .seat {
      width: 26px;
      height: 26px;
      border-radius: 6px 6px 2px 2px;
      border: 1px solid var(--border);
      background: transparent;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .seat.filled { background: var(--ink-faint); border-color: var(--ink-faint); }
    .seat.tracked { border-color: var(--accent); border-width: 2px; }
    .btn-row { display: flex; gap: 8px; }
    .action-btn {
      font-family: var(--sans);
      font-weight: 700;
      font-size: 12px;
      color: var(--ink);
      padding: 7px 14px;
    }
    .action-btn.pulse { animation: pulse 0.8s ease-in-out infinite; }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.06); }
    }
  `],
})
export class SeatRecheckBoothComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  // "Booked" = reality — the seat itself, updates instantly on both sides.
  oldBooked = signal(false);
  newBooked = signal(false);
  // "FormUpdated" = what the form displays — only the new side can ever catch up to reality.
  newFormUpdated = signal(false);
  engaged = signal(false);

  toggleOldBooked() {
    this.oldBooked.update((v) => !v);
  }

  toggleNewBooked() {
    this.engaged.set(true);
    if (this.newFormUpdated()) {
      this.newBooked.set(false);
      this.newFormUpdated.set(false);
      return;
    }
    this.newBooked.update((v) => !v);
  }

  recheckNew() {
    this.engaged.set(true);
    if (this.newBooked()) {
      this.newFormUpdated.set(true);
    }
  }
}
