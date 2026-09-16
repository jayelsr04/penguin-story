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
      subtitle="This seat's already taken, but selecting it won't tell you that on its own. Can the form ever find out?"
      [stopIndex]="7"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="theater-scene">
        <span class="pip pip-md"><app-penguin mood="happy" /></span>
        <button
          type="button"
          class="refresh-btn"
          disabled
          title="Nothing rechecks it in the old version"
        >⟳</button>
        <div class="row">
          <div class="seat filled"></div>
          <div class="seat filled"></div>
          <button
            type="button"
            class="seat seat-btn tracked"
            [disabled]="oldSeatClicked()"
            (click)="clickOldSeat()"
            aria-label="Try this seat"
          ></button>
          <div class="seat filled"></div>
          <div class="seat filled"></div>
        </div>
        <div class="seat-status">{{ oldSeatClicked() ? 'Seat selected ✓' : 'Try this seat' }}</div>
        <div class="labels">
          <div class="label">Reality: <strong>Taken</strong></div>
          <div class="label">Form says: <strong>Available</strong></div>
        </div>
        <app-reset-button [disabled]="!oldSeatClicked()" (reset)="resetOld()" />
      </div>

      <div new class="theater-scene">
        <span class="pip pip-md"><app-penguin [mood]="newFormSynced() ? 'proud' : 'happy'" /></span>
        <button
          type="button"
          class="refresh-btn"
          [disabled]="!newSeatClicked() || newFormSynced()"
          [class.pulse]="newSeatClicked() && !newFormSynced()"
          (click)="recheckNew()"
          title="Recheck against reality"
        >⟳</button>
        <div class="row">
          <div class="seat filled"></div>
          <div class="seat filled"></div>
          <button
            type="button"
            class="seat seat-btn tracked"
            [class.errored]="newFormSynced()"
            [disabled]="newSeatClicked()"
            (click)="clickNewSeat()"
            aria-label="Try this seat"
          ></button>
          <div class="seat filled"></div>
          <div class="seat filled"></div>
        </div>
        @if (newFormSynced()) {
          <div class="seat-error">⚠ Seat already taken</div>
        } @else {
          <div class="seat-status">{{ newSeatClicked() ? 'Seat selected ✓' : 'Try this seat' }}</div>
        }
        <div class="labels">
          <div class="label">Reality: <strong>Taken</strong></div>
          <div class="label">Form says: <strong [class.mismatch]="newSeatClicked() && !newFormSynced()" [class.win]="newFormSynced()">{{ newFormSynced() ? 'Taken' : 'Available' }}</strong></div>
        </div>
        <app-reset-button [disabled]="!newSeatClicked()" (reset)="resetNew()" />
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
    .seat-btn {
      padding: 0;
      appearance: none;
      font: inherit;
      cursor: pointer;
    }
    .seat-btn:disabled { cursor: default; }
    .seat.errored { background: var(--surface-accent); }
    .seat-status {
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 600;
      color: var(--ink-faint);
    }
    .seat-error {
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--accent);
      animation: seat-pop 0.3s ease;
    }
    @keyframes seat-pop {
      from { opacity: 0; transform: scale(0.7); }
      to { opacity: 1; transform: scale(1); }
    }
    .refresh-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--sans);
      font-size: 14px;
      font-weight: 700;
      color: var(--ink-muted);
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 50%;
      cursor: pointer;
      transition: border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
    }
    .refresh-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
    .refresh-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .refresh-btn.pulse { animation: pulse 0.8s ease-in-out infinite; border-color: var(--accent); color: var(--accent); }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `],
})
export class SeatRecheckBoothComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  // The seat is already taken in reality on both sides, but selecting it looks like it worked —
  // neither side's validator re-checks just because the seat was clicked.
  oldSeatClicked = signal(false);
  newSeatClicked = signal(false);
  // "FormSynced" = whether an explicit recheck has forced the form to catch up to reality.
  newFormSynced = signal(false);
  engaged = signal(false);

  clickOldSeat() {
    if (this.oldSeatClicked()) return;
    this.oldSeatClicked.set(true);
  }

  resetOld() {
    this.oldSeatClicked.set(false);
  }

  clickNewSeat() {
    if (this.newSeatClicked()) return;
    this.engaged.set(true);
    this.newSeatClicked.set(true);
  }

  recheckNew() {
    if (!this.newSeatClicked() || this.newFormSynced()) return;
    this.engaged.set(true);
    this.newFormSynced.set(true);
  }

  resetNew() {
    this.newSeatClicked.set(false);
    this.newFormSynced.set(false);
  }
}
