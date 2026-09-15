import { Component, EventEmitter, Output, signal } from '@angular/core';
import { RoomShellComponent } from '../shared/room-shell.component';
import { PenguinComponent } from '../penguin/penguin.component';
import { ResetButtonComponent } from '../shared/reset-button.component';

export const RECAP_LINE = 'Legacy CVA validators are now seen automatically.';

const OLD_CODE = `// LegacyPhoneValidator itself
// doesn't change at all

f.phone().errors();
// would NOT include errors
// from LegacyPhoneValidator`;

const NEW_CODE = `// same old component,
// no changes needed to it

f.phone().errors();
// NOW includes errors from
// LegacyPhoneValidator too`;

type SendState = 'idle' | 'sending' | 'done';

@Component({
  selector: 'app-translator-booth',
  standalone: true,
  imports: [RoomShellComponent, PenguinComponent, ResetButtonComponent],
  template: `
    <app-room-shell
      title="The Translator Booth"
      subtitle="Two clerks, two departments, two different stamp languages. Can one understand the other's paperwork?"
      [stopIndex]="9"
      [oldCode]="oldCode"
      [newCode]="newCode"
      [solved]="engaged()"
      (next)="next.emit()"
      (prev)="prev.emit()"
      (jump)="jump.emit($event)"
    >
      <div old class="depts">
        <div class="dept"><span class="pip pip-sm"><app-penguin mood="confused" /></span><div class="dept-name">Legacy Clerk</div></div>
        <div class="wall">
          <div class="paper" [class.thrown]="oldState() === 'sending'">📄</div>
          <div class="dropped" [class.show]="oldState() === 'done'">lost</div>
        </div>
        <div class="dept"><span class="pip pip-sm"><app-penguin mood="confused" /></span><div class="dept-name">Signal Forms</div></div>
        <button type="button" class="tile-btn action-btn" [disabled]="oldState() !== 'idle'" (click)="sendOld()">Send report</button>
        <div class="stat">{{ oldState() === 'idle' ? 'click to send' : oldState() === 'sending' ? 'sending…' : 'lost — ignored' }}</div>
        <app-reset-button [disabled]="oldState() === 'idle'" (reset)="resetOld()" />
      </div>

      <div new class="depts">
        <div class="dept"><span class="pip pip-sm"><app-penguin mood="happy" /></span><div class="dept-name">Legacy Clerk</div></div>
        <div class="wall with-translator">
          <div class="translator" [class.working]="newState() === 'sending'">
            <span class="pip pip-xs"><app-penguin [mood]="newState() === 'sending' ? 'busy' : 'walking'" /></span>
          </div>
          <div class="paper" [class.carried]="newState() === 'sending'">📄</div>
        </div>
        <div class="dept"><span class="pip pip-sm"><app-penguin mood="happy" /></span><div class="dept-name">Signal Forms</div></div>
        <button type="button" class="tile-btn action-btn" [disabled]="newState() !== 'idle'" (click)="sendNew()">Send report</button>
        <div class="stat" [class.win]="newState() === 'done'">
          {{ newState() === 'idle' ? 'click to send' : newState() === 'sending' ? 'carrying…' : 'delivered ✓' }}
        </div>
        <app-reset-button [disabled]="newState() === 'idle'" (reset)="resetNew()" />
      </div>
    </app-room-shell>
  `,
  styles: [`
    .depts {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      flex-wrap: wrap;
    }
    .dept {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 26px;
    }
    .dept-name { font-size: 9.5px; font-weight: 700; color: var(--ink-muted); }
    .wall {
      position: relative;
      width: 46px;
      height: 58px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .wall.with-translator { background: var(--surface-accent); border-color: var(--accent); }
    .paper { font-size: 17px; transition: transform 0.4s ease, opacity 0.4s ease; }
    .paper.thrown { animation: arc-drop 0.6s ease forwards; }
    @keyframes arc-drop {
      0% { transform: translateY(-20px); opacity: 1; }
      70% { transform: translateY(6px); opacity: 1; }
      100% { transform: translateY(10px); opacity: 0.2; }
    }
    .dropped {
      position: absolute;
      bottom: -16px;
      font-family: var(--mono);
      font-size: 10px;
      font-weight: 700;
      color: var(--ink-faint);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .dropped.show { opacity: 1; }
    .translator {
      position: absolute;
      font-size: 15px;
      opacity: 0.5;
    }
    .translator.working { animation: carry 0.6s ease; opacity: 1; }
    @keyframes carry {
      0% { transform: translateX(-10px); }
      100% { transform: translateX(10px); }
    }
    .paper.carried { animation: carry-paper 0.6s ease; }
    @keyframes carry-paper {
      0% { transform: translateX(-10px); }
      100% { transform: translateX(10px); }
    }
    .action-btn {
      font-family: var(--sans);
      font-weight: 700;
      font-size: 12.5px;
      color: var(--ink);
      padding: 8px 16px;
      flex-basis: 100%;
      justify-self: center;
      margin: 0 auto;
    }
  `],
})
export class TranslatorBoothComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  oldCode = OLD_CODE;
  newCode = NEW_CODE;

  oldState = signal<SendState>('idle');
  newState = signal<SendState>('idle');
  engaged = signal(false);

  sendOld() {
    if (this.oldState() !== 'idle') return;
    this.oldState.set('sending');
    setTimeout(() => this.oldState.set('done'), 600);
  }

  resetOld() {
    this.oldState.set('idle');
  }

  sendNew() {
    if (this.newState() !== 'idle') return;
    this.engaged.set(true);
    this.newState.set('sending');
    setTimeout(() => this.newState.set('done'), 600);
  }

  resetNew() {
    this.newState.set('idle');
  }
}
