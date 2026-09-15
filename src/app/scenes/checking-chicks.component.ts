import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';

const OLD_CODE = `markAsTouched(addressGroup);
markAsTouched(addressGroup.street);
markAsTouched(addressGroup.city);
markAsTouched(addressGroup.zip);
// had to touch every nested
// field yourself`;

const NEW_CODE = `markAsTouched(addressGroup);
// street, city, zip are now
// ALL marked touched too

// don't want the cascade?
markAsTouched(addressGroup, {
  skipDescendants: true,
});`;

@Component({
  selector: 'app-checking-chicks',
  standalone: true,
  imports: [RoomShellComponent],
  template: `
    <app-room-shell
      title="Checking on the Chicks"
      subtitle="Pip needs to check off a whole nest of baby chicks as 'seen today.' How many taps does that take?"
      [stopIndex]="2"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="nest-scene">
        <div class="nest-label">Tap each chick, one at a time</div>
        <div class="nest">
          @for (c of chicks; track c; let i = $index) {
            <button type="button" class="tile-btn chick-btn" [class.checked]="oldChecked()[i]" (click)="clickChick(i)">
              🐣
              @if (oldChecked()[i]) {
                <span class="check">✔</span>
              }
            </button>
          }
        </div>
        <div class="stat">{{ oldTaps() }} / 4 taps</div>
      </div>

      <div new class="nest-scene">
        <div class="nest-label">Tap the whole nest at once</div>
        <button type="button" class="nest tile-btn" (click)="toggleNew()">
          @for (c of chicks; track c) {
            <span class="chick-icon">
              🐣
              @if (newChecked()) {
                <span class="check">✔</span>
              }
            </span>
          }
        </button>
        <div class="stat" [class.win]="newChecked()">{{ newChecked() ? '1 tap — done' : 'Click the nest' }}</div>
      </div>
    </app-room-shell>
  `,
  styles: [`
    .nest-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      width: 100%;
    }
    .nest-label {
      font-size: 12px;
      font-weight: 700;
      color: var(--ink-muted);
    }
    .nest {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 16px;
    }
    .chick-btn {
      position: relative;
      font-size: 30px;
      text-align: center;
      padding: 4px;
      transition: transform 0.2s ease;
    }
    .chick-btn.checked { transform: scale(1.08); }
    .chick-icon { position: relative; font-size: 30px; }
    .check {
      position: absolute;
      top: -6px;
      right: -2px;
      background: var(--accent);
      color: var(--accent-ink);
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pop 0.25s ease both;
    }
    @keyframes pop {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }
  `],
})
export class CheckingChicksComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  chicks = [0, 1, 2, 3];
  oldChecked = signal([false, false, false, false]);
  oldTaps = signal(0);
  newChecked = signal(false);
  engaged = signal(false);

  clickChick(i: number) {
    const arr = this.oldChecked();
    if (arr.every((c) => c)) {
      this.oldChecked.set([false, false, false, false]);
      this.oldTaps.set(0);
      return;
    }
    if (!arr[i]) {
      const next = [...arr];
      next[i] = true;
      this.oldChecked.set(next);
      this.oldTaps.update((v) => v + 1);
    }
  }

  toggleNew() {
    this.engaged.set(true);
    this.newChecked.update((v) => !v);
  }
}
