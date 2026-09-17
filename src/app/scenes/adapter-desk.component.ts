import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = 'One component adapts to Reactive, template, and Signal forms — plus reset().';

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
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
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
        <span class="pip pip-md"><app-penguin mood="confused" /></span>
        <div class="sockets">
          @for (s of sockets; track s.name; let i = $index) {
            <div class="socket">
              <button type="button" class="tile-btn plug" [class.lit]="oldLit()[i]" (click)="clickSocket(i)">{{ s.symbol }}</button>
              <div class="socket-name">{{ s.name }}</div>
            </div>
          }
        </div>
        <div class="stat">{{ oldLitCount() }} / 3 plugged in</div>
        <app-reset-button [disabled]="oldLitCount() === 0" (reset)="resetOld()" />
      </div>

      <div new class="desk-scene">
        <span class="pip pip-md"><app-penguin [mood]="newLit() ? 'proud' : 'happy'" /></span>
        <button type="button" class="tile-btn adapter" [class.settle]="newLit()" [disabled]="newLit()" (click)="plugAdapter()">🔌</button>
        <div class="sockets">
          @for (s of sockets; track s.name) {
            <div class="socket">
              <div class="plug fits" [class.lit]="newLit()">{{ s.symbol }}</div>
              <div class="socket-name">{{ s.name }}</div>
            </div>
          }
        </div>
        <div class="stat" [class.win]="newLit()">{{ newLit() ? 'all 3 fit' : 'click the adapter' }}</div>
        <app-reset-button [disabled]="!newLit()" (reset)="resetLever()" />
      </div>

      <div old-real class="real-form">
        <div class="real-field">
          <label class="real-label">Service</label>
          <div class="real-star-row">
            @for (n of [1,2,3,4,5]; track n) {
              <button type="button" class="real-star" [class.filled]="n <= realOldService()" (click)="realOldService.set(n)">★</button>
            }
          </div>
        </div>
        <div class="real-field">
          <label class="real-label" for="ad-old-food">Food</label>
          <select id="ad-old-food" class="real-select" (change)="onOldFoodSelect($event)">
            <option [selected]="realOldFood() === 0" value="0">Select a rating…</option>
            @for (n of [1,2,3,4,5]; track n) {
              <option [selected]="realOldFood() === n" [value]="n">{{ n }}</option>
            }
          </select>
        </div>
        <div class="real-field">
          <label class="real-label">Venue</label>
          <div class="real-check-row">
            @for (n of [1,2,3,4,5]; track n) {
              <label class="real-radio-row">
                <input type="radio" name="ad-old-venue" [checked]="realOldVenue() === n" (change)="realOldVenue.set(n)" />{{ n }}
              </label>
            }
          </div>
        </div>
        <app-reset-button [disabled]="!oldRealRated()" (reset)="resetRealOld()" />
      </div>

      <div new-real class="real-form">
        <div class="real-field">
          <label class="real-label">Service</label>
          <div class="real-star-row">
            @for (n of [1,2,3,4,5]; track n) {
              <button type="button" class="real-star" [class.filled]="n <= realNewService()" (click)="setNewRating('service', n)">★</button>
            }
          </div>
        </div>
        <div class="real-field">
          <label class="real-label">Food</label>
          <div class="real-star-row">
            @for (n of [1,2,3,4,5]; track n) {
              <button type="button" class="real-star" [class.filled]="n <= realNewFood()" (click)="setNewRating('food', n)">★</button>
            }
          </div>
        </div>
        <div class="real-field">
          <label class="real-label">Venue</label>
          <div class="real-star-row">
            @for (n of [1,2,3,4,5]; track n) {
              <button type="button" class="real-star" [class.filled]="n <= realNewVenue()" (click)="setNewRating('venue', n)">★</button>
            }
          </div>
        </div>
        <app-reset-button [disabled]="!newRealRated()" (reset)="resetRealNew()" />
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
    if (arr[i]) return;
    const next = [...arr];
    next[i] = true;
    this.oldLit.set(next);
  }

  resetOld() {
    this.oldLit.set([false, false, false]);
  }

  plugAdapter() {
    if (this.newLit()) return;
    this.engaged.set(true);
    this.newLit.set(true);
  }

  resetLever() {
    this.newLit.set(false);
  }

  realOldService = signal(0);
  realOldFood = signal(0);
  realOldVenue = signal(0);

  onOldFoodSelect(event: Event) {
    this.realOldFood.set(Number((event.target as HTMLSelectElement).value));
  }

  oldRealRated() {
    return this.realOldService() > 0 || this.realOldFood() > 0 || this.realOldVenue() > 0;
  }

  resetRealOld() {
    this.realOldService.set(0);
    this.realOldFood.set(0);
    this.realOldVenue.set(0);
  }

  realNewService = signal(0);
  realNewFood = signal(0);
  realNewVenue = signal(0);

  setNewRating(field: 'service' | 'food' | 'venue', n: number) {
    this.engaged.set(true);
    if (field === 'service') this.realNewService.set(n);
    if (field === 'food') this.realNewFood.set(n);
    if (field === 'venue') this.realNewVenue.set(n);
  }

  newRealRated() {
    return this.realNewService() > 0 || this.realNewFood() > 0 || this.realNewVenue() > 0;
  }

  resetRealNew() {
    this.realNewService.set(0);
    this.realNewFood.set(0);
    this.realNewVenue.set(0);
  }
}
