import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = "Only Pip updates the notice board — everyone else just asks (touch input/output).";

const OLD_CODE = `@Component({
  selector: 'app-custom-input',
  template: \`<input [value]="value()"
    (blur)="touched.set(true)">\`
})
class CustomInput {
  touched = model(false);
  // could read AND directly
  // overwrite "touched"
}`;

const NEW_CODE = `@Component({
  selector: 'app-custom-input',
  template: \`<input [value]="value()"
    (blur)="touch.emit()">\`
})
class CustomInput {
  touched = input(false); // read-only
  touch = output<void>(); // just asks
}`;

@Component({
  selector: 'app-notice-board',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
  template: `
    <app-room-shell
      title="The Iceberg Notice Board"
      subtitle="Who's allowed to write on the board that tells everyone what's happening today?"
      [stopIndex]="1"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="board-scene">
        <div class="board" [class.messy]="oldMessed()">
          <div class="board-text" [class.scribbled]="oldMessed()">Today's Plan</div>
          @if (oldMessed()) {
            <div class="scribble s1">???</div>
            <div class="scribble s2">NO WAIT</div>
            <div class="scribble s3">×××</div>
          }
        </div>
        <div class="crowd">
          @for (p of [1,2,3]; track p) {
            <button type="button" class="tile-btn penguin-btn" (click)="toggleOld()">
              <span class="pip pip-sm"><app-penguin [mood]="oldMessed() ? 'busy' : 'happy'" /></span>
            </button>
          }
        </div>
        <div class="stat">{{ oldMessed() ? 'Board overwritten' : 'Click a penguin to edit it' }}</div>
        <app-reset-button [disabled]="!oldMessed()" (reset)="resetOld()" />
      </div>

      <div new class="board-scene">
        <div class="board calm">
          <div class="board-text">Today's Plan</div>
        </div>
        <div class="crowd">
          @for (p of [1,2,3]; track p) {
            <button type="button" class="tile-btn penguin-btn" (click)="askNew()">
              <span class="pip pip-sm"><app-penguin [mood]="asked() ? 'happy' : 'walking'" /></span>
            </button>
          }
        </div>
        <div class="stat" [class.win]="asked()">{{ asked() ? 'Request sent — only Pip can edit' : 'Click a penguin to try' }}</div>
        <app-reset-button [disabled]="!asked()" (reset)="resetNew()" />
      </div>

      <div old-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="nb-old-name">Display name</label>
          <input
            id="nb-old-name"
            type="text"
            class="real-input"
            [class.invalid]="realOldTouched() && !realOldValue()"
            placeholder="e.g. Pip"
            [value]="realOldValue()"
            (input)="onRealOldInput($event)"
            (blur)="onRealOldBlur()"
          />
          @if (realOldTouched() && !realOldValue()) {
            <div class="real-error">Name is required</div>
          }
        </div>
        <button type="button" class="real-btn real-btn-secondary" (click)="simulateOldTouch()">
          (simulate another part of the page touching this field)
        </button>
        <app-reset-button [disabled]="!realOldValue() && !realOldTouched()" (reset)="resetRealOld()" />
      </div>

      <div new-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="nb-new-name">Display name</label>
          <input
            id="nb-new-name"
            type="text"
            class="real-input"
            [class.invalid]="realNewTouched() && !realNewValue()"
            placeholder="e.g. Pip"
            [value]="realNewValue()"
            (input)="onRealNewInput($event)"
            (blur)="onRealNewBlur()"
          />
          @if (realNewTouched() && !realNewValue()) {
            <div class="real-error">Name is required</div>
          }
        </div>
        <div class="real-hint">The only way to mark this touched is leaving the field.</div>
        <app-reset-button [disabled]="!realNewValue() && !realNewTouched()" (reset)="resetRealNew()" />
      </div>
    </app-room-shell>
  `,
  styles: [`
    .board-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      width: 100%;
    }
    .board {
      width: 100%;
      max-width: 260px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 16px;
      min-height: 90px;
      position: relative;
      text-align: center;
      transition: box-shadow 0.3s ease;
    }
    .board.messy { box-shadow: inset 0 0 0 2px var(--ink-faint); }
    .board.calm { background: var(--surface-accent); border-color: var(--accent); }
    .board-text { font-weight: 800; color: var(--ink); font-size: 14px; }
    .board-text.scribbled { text-decoration: line-through; opacity: 0.5; }
    .scribble {
      position: absolute;
      font-weight: 800;
      color: var(--ink-muted);
      font-size: 11px;
      transform: rotate(-8deg);
      animation: pop-in 0.3s ease both;
    }
    .s1 { top: 8px; right: 10px; transform: rotate(12deg); }
    .s2 { bottom: 10px; left: 8px; transform: rotate(-14deg); animation-delay: 0.15s; }
    .s3 { top: 40%; right: 20%; font-size: 20px; animation-delay: 0.3s; }
    @keyframes pop-in {
      from { opacity: 0; transform: scale(0.4) rotate(0deg); }
      to { opacity: 1; }
    }
    .crowd { display: flex; gap: 14px; }
    .penguin-btn {
      width: 48px;
      height: 52px;
      padding: 4px 0 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
  `],
})
export class NoticeBoardComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  oldMessed = signal(false);
  asked = signal(false);
  engaged = signal(false);

  toggleOld() {
    if (this.oldMessed()) return;
    this.oldMessed.set(true);
  }

  resetOld() {
    this.oldMessed.set(false);
  }

  askNew() {
    if (this.asked()) return;
    this.engaged.set(true);
    this.asked.set(true);
  }

  resetNew() {
    this.asked.set(false);
  }

  realOldValue = signal('');
  realOldTouched = signal(false);
  realNewValue = signal('');
  realNewTouched = signal(false);

  onRealOldInput(event: Event) {
    this.realOldValue.set((event.target as HTMLInputElement).value);
  }

  onRealOldBlur() {
    this.realOldTouched.set(true);
  }

  simulateOldTouch() {
    this.realOldTouched.set(true);
  }

  resetRealOld() {
    this.realOldValue.set('');
    this.realOldTouched.set(false);
  }

  onRealNewInput(event: Event) {
    this.realNewValue.set((event.target as HTMLInputElement).value);
  }

  onRealNewBlur() {
    this.realNewTouched.set(true);
    this.engaged.set(true);
  }

  resetRealNew() {
    this.realNewValue.set('');
    this.realNewTouched.set(false);
  }
}
