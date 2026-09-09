import { Component, EventEmitter, Output, signal } from '@angular/core';
import { SceneShellComponent } from '../shared/scene-shell.component';

@Component({
  selector: 'app-waiting-game',
  standalone: true,
  imports: [SceneShellComponent],
  template: `
    <app-scene-shell
      title="The Fish Counter Line"
      subtitle="One question is instant. One question takes time. Should they make you wait the same amount?"
      [caption]="caption()"
      [mood]="mood()"
      [index]="4"
      [total]="4"
      (play)="toggle()"
      (next)="next.emit()"
      (prev)="prev.emit()"
    >
      <div old class="counter-scene">
        <div class="question">
          <span>Is your name spelled right?</span>
          <span class="status" [class.stuck]="playing()">
            {{ playing() ? '⏳ waiting…' : '❔' }}
          </span>
        </div>
        <div class="question">
          <span>Is there a fish left?</span>
          <span class="status" [class.stuck]="playing()">
            {{ playing() ? '⏳ waiting…' : '❔' }}
          </span>
        </div>
        @if (playing()) {
          <div class="callout old-callout">Both questions wait together — even the easy one!</div>
        }
      </div>

      <div new class="counter-scene">
        <div class="question">
          <span>Is your name spelled right?</span>
          <span class="status" [class.instant]="playing()">
            {{ playing() ? '✅ yes!' : '❔' }}
          </span>
        </div>
        <div class="question">
          <span>Is there a fish left?</span>
          <span class="status" [class.checking]="checkingFish()" [class.done]="fishDone()">
            {{ fishDone() ? '🐟 yes!' : playing() ? '⏳ checking…' : '❔' }}
          </span>
        </div>
        @if (playing()) {
          <div class="callout new-callout">The easy question answers right away — only the fish check waits!</div>
        }
      </div>
    </app-scene-shell>
  `,
  styles: [`
    .counter-scene {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }
    .question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      color: #33445c;
    }
    .status {
      font-weight: 800;
      font-size: 13px;
      transition: all 0.3s ease;
    }
    .status.stuck { color: #b23c3c; }
    .status.instant { color: #1f8a4c; animation: pop 0.3s ease; }
    .status.checking { color: #b98a2f; }
    .status.done { color: #1f8a4c; animation: pop 0.3s ease; }
    @keyframes pop {
      from { transform: scale(0.6); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .callout {
      font-size: 12.5px;
      font-weight: 700;
      text-align: center;
      padding: 6px 12px;
      border-radius: 10px;
    }
    .old-callout { background: #ffe4e4; color: #b23c3c; }
    .new-callout { background: #dcf7e6; color: #1f8a4c; }
  `],
})
export class WaitingGameComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  playing = signal(false);
  checkingFish = signal(false);
  fishDone = signal(false);

  caption() {
    if (this.fishDone()) {
      return 'The name check was instant — only the slow fish check made anyone wait!';
    }
    return this.playing()
      ? 'Watch — one answer comes instantly, one takes a moment…'
      : 'Tap "Watch what happens" to compare an instant check vs. a slow one.';
  }

  mood() {
    return this.fishDone() ? 'proud' : this.playing() ? 'busy' : 'happy';
  }

  toggle() {
    const turningOn = !this.playing();
    this.playing.set(turningOn);
    this.checkingFish.set(false);
    this.fishDone.set(false);
    if (turningOn) {
      this.checkingFish.set(true);
      setTimeout(() => {
        this.checkingFish.set(false);
        this.fishDone.set(true);
      }, 1200);
    }
  }
}
