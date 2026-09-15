import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';

const OLD_CODE = `<input [formControlName]="'email'">
<!-- only works with
     Reactive Forms -->

<input [field]="f.username">
<!-- only works with
     Signal Forms, separately -->`;

const NEW_CODE = `<app-custom-input
  formControlName="email">
</app-custom-input>

<app-custom-input
  [(ngModel)]="username">
</app-custom-input>

<app-custom-input
  [field]="f.email">
</app-custom-input>

resetForm() {
  reset(f); // clears everything
}`;

@Component({
  selector: 'app-adapter-desk',
  standalone: true,
  imports: [RoomShellComponent],
  template: `
    <app-room-shell
      title="The Universal Adapter Desk"
      subtitle="Three different plug sockets on Pip's desk used to need three different devices. Now there's one adapter — and a reset lever."
      [stopIndex]="10"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="desk-scene">
        <div class="sockets">
          @for (s of sockets; track s.name; let i = $index) {
            <div class="socket">
              <button type="button" class="tile-btn plug" [class.lit]="oldLit()[i]" (click)="clickSocket(i)">{{ s.symbol }}</button>
              <div class="socket-name">{{ s.name }}</div>
            </div>
          }
        </div>
        <div class="stat">{{ oldLitCount() }} / 3 plugged in</div>
      </div>

      <div new class="desk-scene">
        <button type="button" class="tile-btn adapter" [class.settle]="newLit()" (click)="plugAdapter()">🔌</button>
        <div class="sockets">
          @for (s of sockets; track s.name) {
            <div class="socket">
              <div class="plug fits" [class.lit]="newLit()">{{ s.symbol }}</div>
              <div class="socket-name">{{ s.name }}</div>
            </div>
          }
        </div>
        <button type="button" class="tile-btn lever" [class.pulled]="newLit()" (click)="resetLever()">RESET</button>
        <div class="stat" [class.win]="newLit()">{{ newLit() ? 'all 3 fit — click Reset' : 'click the adapter' }}</div>
      </div>
    </app-room-shell>
  `,
  styles: [`
    .desk-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
    }
    .sockets { display: flex; gap: 14px; }
    .socket {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .plug {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 800;
      color: var(--ink-faint);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      transition: transform 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    .plug.lit { color: var(--accent); border-color: var(--accent); transform: scale(1.1); }
    .socket-name { font-size: 9.5px; font-weight: 700; color: var(--ink-muted); }
    .adapter {
      font-size: 28px;
      width: 52px;
      height: 52px;
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }
    .adapter.settle { transform: scale(1.12) rotate(-8deg); }
    .lever {
      margin-top: 6px;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--ink);
      padding: 4px 12px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .lever.pulled { border-color: var(--accent); color: var(--accent); }
  `],
})
export class AdapterDeskComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  sockets = [
    { name: 'Reactive', symbol: '▲' },
    { name: 'Template', symbol: '●' },
    { name: 'Signal', symbol: '◆' },
  ];

  oldLit = signal([false, false, false]);
  newLit = signal(false);
  engaged = signal(false);

  oldLitCount() {
    return this.oldLit().filter(Boolean).length;
  }

  clickSocket(i: number) {
    const arr = this.oldLit();
    if (arr.every(Boolean)) {
      this.oldLit.set([false, false, false]);
      return;
    }
    if (!arr[i]) {
      const next = [...arr];
      next[i] = true;
      this.oldLit.set(next);
    }
  }

  plugAdapter() {
    this.engaged.set(true);
    this.newLit.set(true);
  }

  resetLever() {
    this.engaged.set(true);
    this.newLit.set(false);
  }
}
