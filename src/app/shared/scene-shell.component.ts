import { Component, EventEmitter, input, Output } from '@angular/core';
import { PenguinComponent, PenguinMood } from '../penguin/penguin.component';

@Component({
  selector: 'app-scene-shell',
  standalone: true,
  imports: [PenguinComponent],
  template: `
    <section class="scene">
      <header class="scene-header">
        <div class="badge">Rule {{ index() }} of {{ total() }}</div>
        <h2>{{ title() }}</h2>
        <p class="subtitle">{{ subtitle() }}</p>
      </header>

      <div class="split">
        <div class="panel old-panel">
          <div class="panel-label old-label">🧊 OLD WAY</div>
          <div class="panel-body">
            <ng-content select="[old]"></ng-content>
          </div>
        </div>
        <div class="divider">
          <span>vs</span>
        </div>
        <div class="panel new-panel">
          <div class="panel-label new-label">✨ NEW WAY</div>
          <div class="panel-body">
            <ng-content select="[new]"></ng-content>
          </div>
        </div>
      </div>

      <div class="control-row">
        <button class="play-btn" (click)="play.emit()">
          <span class="play-icon">▶</span> Watch what happens
        </button>
        <div class="pip-caption">
          <div class="pip-mini">
            <app-penguin [mood]="mood()"></app-penguin>
          </div>
          <div class="speech-bubble">{{ caption() }}</div>
        </div>
      </div>

      <nav class="nav-row">
        <button class="nav-btn" [disabled]="index() === 1" (click)="prev.emit()">← Back</button>
        <div class="dots">
          @for (d of dotsArray(); track d) {
            <span class="dot" [class.dot-active]="d === index()"></span>
          }
        </div>
        <button class="nav-btn primary" (click)="next.emit()">
          {{ index() === total() ? 'Finish 🎉' : 'Next →' }}
        </button>
      </nav>
    </section>
  `,
  styles: [`
    .scene {
      max-width: 980px;
      margin: 0 auto;
      padding: 28px 24px 20px;
      font-family: 'Quicksand', 'Segoe UI', sans-serif;
    }
    .scene-header { text-align: center; margin-bottom: 18px; }
    .badge {
      display: inline-block;
      background: #eaf4ff;
      color: #2b6cb0;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.06em;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 10px;
    }
    h2 {
      margin: 0 0 6px;
      font-size: 28px;
      color: #1a2740;
    }
    .subtitle {
      margin: 0;
      color: #5b6b82;
      font-size: 15px;
      max-width: 640px;
      margin-inline: auto;
    }
    .split {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 14px;
      align-items: stretch;
      margin: 22px 0 18px;
    }
    .panel {
      border-radius: 18px;
      padding: 16px;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 6px 18px rgba(20, 40, 80, 0.06);
    }
    .old-panel { background: linear-gradient(180deg, #eef3f8, #e4ecf5); border: 2px solid #cdd9e6; }
    .new-panel { background: linear-gradient(180deg, #eafff1, #dcfbe8); border: 2px solid #b6ecc9; }
    .panel-label {
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.04em;
      margin-bottom: 10px;
    }
    .old-label { color: #5b6b82; }
    .new-label { color: #1f9d55; }
    .panel-body {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a7b4c3;
      font-weight: 700;
      font-style: italic;
    }
    .control-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
    .play-btn {
      background: #ff8c42;
      color: white;
      border: none;
      padding: 12px 22px;
      border-radius: 999px;
      font-weight: 800;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 6px 14px rgba(255, 140, 66, 0.35);
      transition: transform 0.15s ease;
    }
    .play-btn:hover { transform: translateY(-2px); }
    .play-btn:active { transform: translateY(0); }
    .play-icon { margin-right: 6px; }
    .pip-caption {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 240px;
    }
    .pip-mini { width: 44px; height: 52px; flex-shrink: 0; }
    .speech-bubble {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 8px 14px;
      font-size: 13.5px;
      color: #33445c;
      position: relative;
    }
    .nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-btn {
      background: white;
      border: 2px solid #dbe3ee;
      color: #33445c;
      font-weight: 700;
      padding: 9px 18px;
      border-radius: 999px;
      cursor: pointer;
    }
    .nav-btn.primary {
      background: #2b6cb0;
      border-color: #2b6cb0;
      color: white;
    }
    .nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .dots { display: flex; gap: 6px; }
    .dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #d7dee8;
    }
    .dot-active { background: #ff8c42; }

    @media (max-width: 720px) {
      .split { grid-template-columns: 1fr; }
      .divider { display: none; }
    }
  `],
})
export class SceneShellComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  caption = input<string>('');
  mood = input<PenguinMood>('happy');
  index = input.required<number>();
  total = input.required<number>();

  @Output() play = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  dotsArray() {
    return Array.from({ length: this.total() }, (_, i) => i + 1);
  }
}
