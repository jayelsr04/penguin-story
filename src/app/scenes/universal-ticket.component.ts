import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = 'Every booth uses the same "when" rule shape now.';

const OLD_CODE = `disabled(f.shippingAddress,
  () => f.sameAsBilling().value());

required(f.email);
// no clean way to say
// "only required if X"

hidden(f.promoCode, ...);   // own pattern
readonly(f.accountId, ...); // own pattern`;

const NEW_CODE = `disabled(f.shippingAddress, {
  when: () => f.sameAsBilling().value(),
});

required(f.email, {
  when: () => f.wantsNewsletter().value(),
});

hidden(f.promoCode, {
  when: () => !f.hasPromo().value(),
});

readonly(f.accountId, {
  when: () => f.isExistingUser().value(),
});`;

@Component({
  selector: 'app-universal-ticket',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
  template: `
    <app-room-shell
      title="Four Booths, One Rule"
      subtitle="Every booth on the iceberg used to have its own weird 'only if...' shape. Now they all match."
      [stopIndex]="3"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="ticket-scene">
        <span class="pip pip-md"><app-penguin mood="confused" /></span>
        <div class="booths">
        @for (b of booths; track b.name; let i = $index) {
          <div class="booth">
            <div class="booth-name">{{ b.name }}</div>
            <button type="button" class="tile-btn ticket-shape" [class]="b.shapeClass" (click)="revealOld(i)">
              {{ oldRevealed()[i] ? b.symbol : '?' }}
            </button>
          </div>
        }
        <div class="stat">{{ oldRevealedCount() }} / 4 shapes learned</div>
        </div>
        <app-reset-button [disabled]="oldRevealedCount() === 0" (reset)="resetOld()" />
      </div>

      <div new class="ticket-scene">
        <span class="pip pip-md"><app-penguin [mood]="newRevealed() ? 'proud' : 'happy'" /></span>
        <div class="booths">
        @for (b of booths; track b.name) {
          <div class="booth">
            <div class="booth-name">{{ b.name }}</div>
            <button type="button" class="tile-btn ticket-shape uniform" [class.settle]="newRevealed()" (click)="toggleNew()">
              {{ newRevealed() ? '★' : '?' }}
            </button>
          </div>
        }
        <div class="stat" [class.win]="newRevealed()">{{ newRevealed() ? '1 click — all 4 done' : 'Click any booth' }}</div>
        </div>
        <app-reset-button [disabled]="!newRevealed()" (reset)="resetNew()" />
      </div>

      <div old-real class="real-form">
        <label class="real-check-row">
          <input type="checkbox" [checked]="oldSameShipping()" (change)="toggleOldSame()" />
          Same as shipping address
        </label>
        <div class="real-collapsible snap" [class.open]="!oldSameShipping()">
          <div class="real-field">
            <label class="real-label" for="ut-old-ship">Shipping address</label>
            <input id="ut-old-ship" type="text" class="real-input" placeholder="123 Iceberg Way" />
          </div>
        </div>

        <label class="real-check-row">
          <input type="checkbox" [checked]="oldNewsletterChecked()" (change)="toggleOldNewsletter()" />
          Subscribe to newsletter
        </label>
        <div class="real-collapsible jumpy" [class.open]="oldNewsletterVisible()">
          <div class="real-field">
            <label class="real-label" for="ut-old-freq">Email frequency</label>
            <select id="ut-old-freq" class="real-select">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <div class="real-field">
          <label class="real-label" for="ut-old-promo">Promo code</label>
          <input id="ut-old-promo" type="text" class="real-input" [value]="oldPromoText()" (input)="onOldPromoInput($event)" />
        </div>
        @if (oldPromoApplied()) {
          <div class="real-badge bounce">Applied ✓</div>
        }
        <app-reset-button [disabled]="!oldRealDirty()" (reset)="resetOldReal()" />
      </div>

      <div new-real class="real-form">
        <label class="real-check-row">
          <input type="checkbox" [checked]="newSameShipping()" (change)="toggleNewSame()" />
          Same as shipping address
        </label>
        <div class="real-collapsible uniform" [class.open]="!newSameShipping()">
          <div class="real-field">
            <label class="real-label" for="ut-new-ship">Shipping address</label>
            <input id="ut-new-ship" type="text" class="real-input" placeholder="123 Iceberg Way" />
          </div>
        </div>

        <label class="real-check-row">
          <input type="checkbox" [checked]="newNewsletterChecked()" (change)="toggleNewNewsletter()" />
          Subscribe to newsletter
        </label>
        <div class="real-collapsible uniform" [class.open]="newNewsletterChecked()">
          <div class="real-field">
            <label class="real-label" for="ut-new-freq">Email frequency</label>
            <select id="ut-new-freq" class="real-select">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <div class="real-field">
          <label class="real-label" for="ut-new-promo">Promo code</label>
          <input id="ut-new-promo" type="text" class="real-input" [value]="newPromoText()" (input)="onNewPromoInput($event)" />
        </div>
        @if (newPromoText()) {
          <div class="real-badge uniform-in">Applied ✓</div>
        }
        <app-reset-button [disabled]="!newRealDirty()" (reset)="resetNewReal()" />
      </div>
    </app-room-shell>
  `,
  styles: [`
    .ticket-scene {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      width: 100%;
    }
    .booths {
      display: flex;
      justify-content: space-around;
      width: 100%;
      gap: 8px;
      flex-wrap: wrap;
    }
    .booth {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 70px;
    }
    .booth-name {
      font-size: 10.5px;
      font-weight: 700;
      color: var(--ink-muted);
      text-align: center;
    }
    .ticket-shape {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      font-weight: 800;
      color: var(--ink);
      transition: transform 0.35s ease;
    }
    .shape-diamond { transform: rotate(45deg); }
    .uniform {
      background: var(--surface-2);
      transform: scale(0.92);
    }
    .uniform.settle {
      background: var(--surface-accent);
      border-color: var(--accent);
      color: var(--accent);
      transform: scale(1.05);
    }
    .stat { flex-basis: 100%; text-align: center; justify-content: center; }
  `],
})
export class UniversalTicketComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  booths = [
    { name: 'Shipping', symbol: '●', shapeClass: 'shape-circle' },
    { name: 'Newsletter', symbol: '■', shapeClass: 'shape-square' },
    { name: 'Promo Code', symbol: '★', shapeClass: 'shape-zigzag' },
    { name: 'Account', symbol: '◆', shapeClass: 'shape-diamond' },
  ];

  oldRevealed = signal([false, false, false, false]);
  newRevealed = signal(false);
  engaged = signal(false);

  oldRevealedCount() {
    return this.oldRevealed().filter(Boolean).length;
  }

  revealOld(i: number) {
    const arr = this.oldRevealed();
    if (arr[i]) return;
    const next = [...arr];
    next[i] = true;
    this.oldRevealed.set(next);
  }

  resetOld() {
    this.oldRevealed.set([false, false, false, false]);
  }

  toggleNew() {
    if (this.newRevealed()) return;
    this.engaged.set(true);
    this.newRevealed.set(true);
  }

  resetNew() {
    this.newRevealed.set(false);
  }

  oldSameShipping = signal(false);
  oldNewsletterChecked = signal(false);
  oldNewsletterVisible = signal(false);
  oldPromoText = signal('');
  oldPromoApplied = signal(false);
  private oldNewsletterTimer?: ReturnType<typeof setTimeout>;

  newSameShipping = signal(false);
  newNewsletterChecked = signal(false);
  newPromoText = signal('');

  toggleOldSame() {
    this.oldSameShipping.update((v) => !v);
  }

  toggleOldNewsletter() {
    const next = !this.oldNewsletterChecked();
    this.oldNewsletterChecked.set(next);
    clearTimeout(this.oldNewsletterTimer);
    if (next) {
      this.oldNewsletterTimer = setTimeout(() => this.oldNewsletterVisible.set(true), 400);
    } else {
      this.oldNewsletterVisible.set(false);
    }
  }

  onOldPromoInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.oldPromoText.set(value);
    this.oldPromoApplied.set(!!value);
  }

  oldRealDirty() {
    return this.oldSameShipping() || this.oldNewsletterChecked() || !!this.oldPromoText();
  }

  resetOldReal() {
    clearTimeout(this.oldNewsletterTimer);
    this.oldSameShipping.set(false);
    this.oldNewsletterChecked.set(false);
    this.oldNewsletterVisible.set(false);
    this.oldPromoText.set('');
    this.oldPromoApplied.set(false);
  }

  toggleNewSame() {
    this.engaged.set(true);
    this.newSameShipping.update((v) => !v);
  }

  toggleNewNewsletter() {
    this.engaged.set(true);
    this.newNewsletterChecked.update((v) => !v);
  }

  onNewPromoInput(event: Event) {
    this.engaged.set(true);
    this.newPromoText.set((event.target as HTMLInputElement).value);
  }

  newRealDirty() {
    return this.newSameShipping() || this.newNewsletterChecked() || !!this.newPromoText();
  }

  resetNewReal() {
    this.newSameShipping.set(false);
    this.newNewsletterChecked.set(false);
    this.newPromoText.set('');
  }
}
