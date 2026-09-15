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
}
