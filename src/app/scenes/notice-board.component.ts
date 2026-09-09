import { Component, EventEmitter, Output, signal } from '@angular/core';
import { SceneShellComponent } from '../shared/scene-shell.component';

@Component({
  selector: 'app-notice-board',
  standalone: true,
  imports: [SceneShellComponent],
  template: `
    <app-scene-shell
      title="The Iceberg Notice Board"
      subtitle="Who's allowed to write on the board that tells everyone what's happening today?"
      [caption]="caption()"
      [mood]="mood()"
      [index]="1"
      [total]="4"
      (play)="toggle()"
      (next)="next.emit()"
      (prev)="prev.emit()"
    >
      <div old class="board-scene">
        <div class="board" [class.messy]="playing()">
          <div class="board-text" [class.scribbled]="playing()">Today's Plan</div>
          @if (playing()) {
            <div class="scribble s1">???</div>
            <div class="scribble s2">NO WAIT</div>
            <div class="scribble s3">×××</div>
          }
        </div>
        <div class="crowd">
          @for (p of [1,2,3]; track p) {
            <div class="mini-penguin" [class.jiggle]="playing()" [style.animationDelay.ms]="p * 120">🐧</div>
          }
        </div>
        @if (playing()) {
          <div class="callout old-callout">Everyone scribbles at once — the board gets messy!</div>
        }
      </div>

      <div new class="board-scene">
        <div class="board calm">
          <div class="board-text">Today's Plan</div>
          @if (playing()) {
            <div class="clean-update">🐟 Fish at 3pm!</div>
          }
        </div>
        <div class="crowd">
          @for (p of [1,2,3]; track p) {
            <div class="mini-penguin raise" [class.raised]="playing()" [style.animationDelay.ms]="p * 150">
              🐧<span class="flipper" [class.up]="playing()">🙋</span>
            </div>
          }
        </div>
        @if (playing()) {
          <div class="callout new-callout">Everyone just asks Pip — only Pip updates the board!</div>
        }
      </div>
    </app-scene-shell>
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
      background: #d8b98a;
      border: 6px solid #8a5a2b;
      border-radius: 8px;
      padding: 16px;
      min-height: 90px;
      position: relative;
      text-align: center;
      transition: all 0.4s ease;
    }
    .board.messy { background: #e8c7a0; box-shadow: 0 0 0 3px #ff6b6b inset; }
    .board.calm { background: #d8f5e0; border-color: #4caf7d; }
    .board-text { font-weight: 800; color: #4a3418; font-size: 14px; }
    .board.calm .board-text { color: #256b45; }
    .board-text.scribbled { text-decoration: line-through; opacity: 0.5; }
    .scribble {
      position: absolute;
      font-weight: 800;
      color: #d64545;
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
    .clean-update {
      margin-top: 8px;
      font-weight: 800;
      color: #256b45;
      font-size: 14px;
      animation: fade-slide 0.4s ease both;
    }
    @keyframes fade-slide {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .crowd { display: flex; gap: 18px; font-size: 28px; }
    .mini-penguin { position: relative; transition: transform 0.3s ease; }
    .mini-penguin.jiggle { animation: jiggle 0.35s ease infinite; }
    @keyframes jiggle {
      0%, 100% { transform: rotate(0deg) translateY(0); }
      50% { transform: rotate(-8deg) translateY(-3px); }
    }
    .flipper {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%) scale(0);
      font-size: 16px;
      transition: transform 0.3s ease;
    }
    .flipper.up { transform: translateX(-50%) scale(1); }
    .callout {
      font-size: 12.5px;
      font-weight: 700;
      text-align: center;
      padding: 6px 12px;
      border-radius: 10px;
      max-width: 230px;
      animation: fade-slide 0.4s ease both;
    }
    .old-callout { background: #ffe4e4; color: #b23c3c; }
    .new-callout { background: #dcf7e6; color: #1f8a4c; }
  `],
})
export class NoticeBoardComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  playing = signal(false);

  caption() {
    return this.playing()
      ? "See? Only I touch the board now — everyone else just asks me!"
      : 'Tap "Watch what happens" to see the old chaos vs. the new calm.';
  }

  mood() {
    return this.playing() ? 'proud' : 'happy';
  }

  toggle() {
    this.playing.update((v) => !v);
  }
}
