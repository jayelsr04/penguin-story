import { Component, EventEmitter, Output, signal } from '@angular/core';
import { SceneShellComponent } from '../shared/scene-shell.component';

@Component({
  selector: 'app-universal-ticket',
  standalone: true,
  imports: [SceneShellComponent],
  template: `
    <app-scene-shell
      title="Three Booths, One Rule"
      subtitle="Every booth on the iceberg used to have its own weird 'only if...' shape. Now they all match."
      [caption]="caption()"
      [mood]="mood()"
      [index]="3"
      [total]="4"
      (play)="toggle()"
      (next)="next.emit()"
      (prev)="prev.emit()"
    >
      <div old class="booths">
        @for (b of booths; track b.name) {
          <div class="booth">
            <div class="booth-name">{{ b.name }}</div>
            <div class="ticket-shape" [class]="b.shapeClass" [class.wobble]="playing()">
              {{ b.symbol }}
            </div>
          </div>
        }
        @if (playing()) {
          <div class="callout old-callout">Every booth has a different shaped rule — confusing!</div>
        }
      </div>

      <div new class="booths">
        @for (b of booths; track b.name) {
          <div class="booth">
            <div class="booth-name">{{ b.name }}</div>
            <div class="ticket-shape uniform" [class.settle]="playing()">
              {{ playing() ? '⭐' : '?' }}
            </div>
          </div>
        }
        @if (playing()) {
          <div class="callout new-callout">Same star-shaped "when" rule — everywhere!</div>
        }
      </div>
    </app-scene-shell>
  `,
  styles: [`
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
      min-width: 80px;
    }
    .booth-name {
      font-size: 11px;
      font-weight: 700;
      color: #5b6b82;
      text-align: center;
    }
    .ticket-shape {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
      color: white;
      background: #7a8ba3;
      transition: transform 0.35s ease;
    }
    .shape-circle { border-radius: 50%; background: #4d90fe; }
    .shape-square { border-radius: 6px; background: #f5a623; }
    .shape-zigzag {
      background: #e0568c;
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }
    .uniform {
      border-radius: 12px;
      background: #cfd8e3;
      transform: scale(0.9);
    }
    .uniform.settle {
      background: #2fbf6f;
      transform: scale(1.08);
    }
    .wobble { animation: wobble 0.5s ease; }
    @keyframes wobble {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-6deg); }
      75% { transform: rotate(6deg); }
    }
    .callout {
      font-size: 12.5px;
      font-weight: 700;
      text-align: center;
      padding: 6px 12px;
      border-radius: 10px;
      max-width: 260px;
      margin-top: 6px;
      flex-basis: 100%;
    }
    .old-callout { background: #ffe4e4; color: #b23c3c; }
    .new-callout { background: #dcf7e6; color: #1f8a4c; }
  `],
})
export class UniversalTicketComponent {
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  booths = [
    { name: 'Fish Buffet', symbol: '●', shapeClass: 'shape-circle' },
    { name: 'Ice Rink', symbol: '■', shapeClass: 'shape-square' },
    { name: 'Sledding Hill', symbol: '★', shapeClass: 'shape-zigzag' },
  ];

  playing = signal(false);

  caption() {
    return this.playing()
      ? 'One shape to learn — it works at every single booth now!'
      : 'Tap "Watch what happens" to compare three shapes vs. one.';
  }

  mood() {
    return this.playing() ? 'proud' : 'confused';
  }

  toggle() {
    this.playing.update((v) => !v);
  }
}
