import { Component, EventEmitter, Output, signal } from '@angular/core';
import { SceneShellComponent } from '../shared/scene-shell.component';

@Component({
  selector: 'app-checking-chicks',
  standalone: true,
  imports: [SceneShellComponent],
  template: `
    <app-scene-shell
      title="Checking on the Chicks"
      subtitle="Pip needs to check off a whole nest of baby chicks as 'seen today.' How many taps does that take?"
      [caption]="caption()"
      [mood]="mood()"
      [index]="2"
      [total]="4"
      (play)="toggle()"
      (next)="next.emit()"
      (prev)="prev.emit()"
    >
      <div old class="nest-scene">
        <div class="nest-label">Nest (needs 4 separate taps)</div>
        <div class="nest">
          @for (c of chicks; track c; let i = $index) {
            <div class="chick" [class.checked]="oldChecked()[i]">
              🐣
              @if (oldChecked()[i]) {
                <span class="check">✔</span>
              }
            </div>
          }
        </div>
        @if (playing()) {
          <div class="callout old-callout">Pip has to tap each chick, one at a time…</div>
        }
      </div>

      <div new class="nest-scene">
        <div class="nest-label">Whole nest (just 1 tap!)</div>
        <div class="nest">
          @for (c of chicks; track c) {
            <div class="chick" [class.checked]="playing()">
              🐣
              @if (playing()) {
                <span class="check">✔</span>
              }
            </div>
          }
        </div>
        @if (playing()) {
          <div class="callout new-callout">One tap on the nest checks every chick at once!</div>
        }
      </div>
    </app-scene-shell>
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
      font-size: 12.5px;
      font-weight: 700;
      color: #5b6b82;
    }
    .nest {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      background: #fff7e6;
      border: 3px dashed #e2c17a;
      border-radius: 16px;
      padding: 16px;
    }
    .chick {
      position: relative;
      font-size: 34px;
      text-align: center;
      transition: transform 0.25s ease;
    }
    .chick.checked { transform: scale(1.12); }
    .check {
      position: absolute;
      top: -6px;
      right: -2px;
      background: #2fbf6f;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pop 0.25s ease both;
    }
    @keyframes pop {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }
    .callout {
      font-size: 12.5px;
      font-weight: 700;
      text-align: center;
      padding: 6px 12px;
      border-radius: 10px;
      max-width: 230px;
    }
    .old-callout { background: #ffe4e4; color: #b23c3c; }
    .new-callout { background: #dcf7e6; color: #1f8a4c; }
  `],
})
export class CheckingChicksComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  chicks = [0, 1, 2, 3];
  playing = signal(false);
  private step = signal(0);

  oldChecked() {
    const s = this.step();
    return this.chicks.map((_, i) => this.playing() && i < s);
  }

  caption() {
    return this.playing()
      ? 'One tap on the whole nest — done! No more checking chicks one by one.'
      : 'Tap "Watch what happens" to see one-by-one vs. all-at-once.';
  }

  mood() {
    return this.playing() ? 'proud' : 'busy';
  }

  toggle() {
    const turningOn = !this.playing();
    this.playing.set(turningOn);
    this.step.set(0);
    if (turningOn) {
      let i = 0;
      const timer = setInterval(() => {
        i++;
        this.step.set(i);
        if (i >= 4) clearInterval(timer);
      }, 260);
    }
  }
}
