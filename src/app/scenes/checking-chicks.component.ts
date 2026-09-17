import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = "One tap checks a whole nest of chicks — markAsTouched() cascades now.";

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
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
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
        <span class="pip pip-md"><app-penguin mood="busy" /></span>
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
        <app-reset-button [disabled]="oldTaps() === 0" (reset)="resetOld()" />
      </div>

      <div new class="nest-scene">
        <span class="pip pip-md"><app-penguin [mood]="newChecked() ? 'proud' : 'happy'" /></span>
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
        <app-reset-button [disabled]="!newChecked()" (reset)="resetNew()" />
      </div>

      <div old-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="cc-old-street">Street</label>
          <input id="cc-old-street" type="text" class="real-input" [class.invalid]="oldStreetTouched() && !oldStreet()"
            [value]="oldStreet()" (input)="oldStreet.set(inputValue($event))" (blur)="oldStreetTouched.set(true)" />
          @if (oldStreetTouched() && !oldStreet()) { <div class="real-error">Street is required</div> }
        </div>
        <div class="real-field">
          <label class="real-label" for="cc-old-city">City</label>
          <input id="cc-old-city" type="text" class="real-input" [class.invalid]="oldCityTouched() && !oldCity()"
            [value]="oldCity()" (input)="oldCity.set(inputValue($event))" (blur)="oldCityTouched.set(true)" />
          @if (oldCityTouched() && !oldCity()) { <div class="real-error">City is required</div> }
        </div>
        <div class="real-field">
          <label class="real-label" for="cc-old-zip">ZIP</label>
          <input id="cc-old-zip" type="text" class="real-input" [class.invalid]="oldZipTouched() && !oldZip()"
            [value]="oldZip()" (input)="oldZip.set(inputValue($event))" (blur)="oldZipTouched.set(true)" />
          @if (oldZipTouched() && !oldZip()) { <div class="real-error">ZIP is required</div> }
        </div>
        <button type="button" class="real-btn" (click)="submitOld()">Submit</button>
        <app-reset-button [disabled]="!oldRealDirty()" (reset)="resetOldReal()" />
      </div>

      <div new-real class="real-form">
        <div class="real-field">
          <label class="real-label" for="cc-new-street">Street</label>
          <input id="cc-new-street" type="text" class="real-input" [class.invalid]="newStreetTouched() && !newStreet()"
            [value]="newStreet()" (input)="newStreet.set(inputValue($event))" (blur)="newStreetTouched.set(true)" />
          @if (newStreetTouched() && !newStreet()) { <div class="real-error">Street is required</div> }
        </div>
        <div class="real-field">
          <label class="real-label" for="cc-new-city">City</label>
          <input id="cc-new-city" type="text" class="real-input" [class.invalid]="newCityTouched() && !newCity()"
            [value]="newCity()" (input)="newCity.set(inputValue($event))" (blur)="newCityTouched.set(true)" />
          @if (newCityTouched() && !newCity()) { <div class="real-error">City is required</div> }
        </div>
        <div class="real-field">
          <label class="real-label" for="cc-new-zip">ZIP</label>
          <input id="cc-new-zip" type="text" class="real-input" [class.invalid]="newZipTouched() && !newZip()"
            [value]="newZip()" (input)="newZip.set(inputValue($event))" (blur)="newZipTouched.set(true)" />
          @if (newZipTouched() && !newZip()) { <div class="real-error">ZIP is required</div> }
        </div>
        <button type="button" class="real-btn" (click)="submitNew()">Submit</button>
        <app-reset-button [disabled]="!newRealDirty()" (reset)="resetNewReal()" />
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
    if (arr[i]) return;
    const next = [...arr];
    next[i] = true;
    this.oldChecked.set(next);
    this.oldTaps.update((v) => v + 1);
  }

  resetOld() {
    this.oldChecked.set([false, false, false, false]);
    this.oldTaps.set(0);
  }

  toggleNew() {
    if (this.newChecked()) return;
    this.engaged.set(true);
    this.newChecked.set(true);
  }

  resetNew() {
    this.newChecked.set(false);
  }

  oldStreet = signal('');
  oldCity = signal('');
  oldZip = signal('');
  oldStreetTouched = signal(false);
  oldCityTouched = signal(false);
  oldZipTouched = signal(false);

  newStreet = signal('');
  newCity = signal('');
  newZip = signal('');
  newStreetTouched = signal(false);
  newCityTouched = signal(false);
  newZipTouched = signal(false);

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  submitOld() {
    // Bug: only the first field gets marked touched on submit.
    this.oldStreetTouched.set(true);
  }

  oldRealDirty() {
    return !!(this.oldStreet() || this.oldCity() || this.oldZip() || this.oldStreetTouched() || this.oldCityTouched() || this.oldZipTouched());
  }

  resetOldReal() {
    this.oldStreet.set('');
    this.oldCity.set('');
    this.oldZip.set('');
    this.oldStreetTouched.set(false);
    this.oldCityTouched.set(false);
    this.oldZipTouched.set(false);
  }

  submitNew() {
    this.engaged.set(true);
    this.newStreetTouched.set(true);
    this.newCityTouched.set(true);
    this.newZipTouched.set(true);
  }

  newRealDirty() {
    return !!(this.newStreet() || this.newCity() || this.newZip() || this.newStreetTouched() || this.newCityTouched() || this.newZipTouched());
  }

  resetNewReal() {
    this.newStreet.set('');
    this.newCity.set('');
    this.newZip.set('');
    this.newStreetTouched.set(false);
    this.newCityTouched.set(false);
    this.newZipTouched.set(false);
  }
}
