import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = 'reloadValidation() forces a fresh check on demand.';

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
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
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
        <span class="pip pip-md"><app-penguin mood="confused" /></span>
        <div class="row">
          <div class="seat filled"></div>
          <div class="seat filled"></div>
          <div class="seat tracked" [class.filled]="oldBooked()"></div>
          <div class="seat filled"></div>
          <div class="seat filled"></div>
        </div>
        <div class="labels">
          <div class="label">Reality: <strong>{{ oldBooked() ? 'Taken' : 'Available' }}</strong></div>
          <div class="label">Form says: <strong>Available</strong></div>
        </div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" [disabled]="oldBooked()" (click)="toggleOldBooked()">Someone books it</button>
          <button type="button" class="tile-btn action-btn" disabled title="Nothing rechecks it in the old version">Recheck</button>
        </div>
        <app-reset-button [disabled]="!oldBooked()" (reset)="resetOld()" />
      </div>

      <div new class="theater-scene">
        <span class="pip pip-md"><app-penguin [mood]="newFormUpdated() ? 'proud' : (newBooked() ? 'busy' : 'happy')" /></span>
        <div class="row">
          <div class="seat filled"></div>
          <div class="seat filled"></div>
          <div class="seat tracked" [class.filled]="newBooked()"></div>
          <div class="seat filled"></div>
          <div class="seat filled"></div>
        </div>
        <div class="labels">
          <div class="label">Reality: <strong [class.mismatch]="newBooked() && !newFormUpdated()">{{ newBooked() ? 'Taken' : 'Available' }}</strong></div>
          <div class="label">Form says: <strong [class.win]="newFormUpdated()">{{ newFormUpdated() ? 'Taken' : 'Available' }}</strong></div>
        </div>
        <div class="btn-row">
          <button type="button" class="tile-btn action-btn" [disabled]="newBooked()" (click)="toggleNewBooked()">Someone books it</button>
          <button type="button" class="tile-btn action-btn" [disabled]="!newBooked() || newFormUpdated()" [class.pulse]="newBooked() && !newFormUpdated()" (click)="recheckNew()">
            Recheck
          </button>
        </div>
        <app-reset-button [disabled]="!newBooked()" (reset)="resetNew()" />
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
    .labels {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
    }
    .label {
      font-family: var(--mono);
      font-size: 11.5px;
      font-weight: 600;
      color: var(--ink-muted);
    }
    .label strong { color: var(--ink); font-weight: 700; }
    .label strong.mismatch { color: var(--accent); }
    .label strong.win { color: var(--accent); }
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
    if (this.oldBooked()) return;
    this.oldBooked.set(true);
  }

  resetOld() {
    this.oldBooked.set(false);
  }

  toggleNewBooked() {
    if (this.newBooked()) return;
    this.engaged.set(true);
    this.newBooked.set(true);
  }

  recheckNew() {
    if (!this.newBooked() || this.newFormUpdated()) return;
    this.engaged.set(true);
    this.newFormUpdated.set(true);
  }

  resetNew() {
    this.newBooked.set(false);
    this.newFormUpdated.set(false);
  }
}
