import { Component, signal } from '@angular/core';
import { PenguinComponent } from './penguin/penguin.component';
import { NoticeBoardComponent } from './scenes/notice-board.component';
import { CheckingChicksComponent } from './scenes/checking-chicks.component';
import { UniversalTicketComponent } from './scenes/universal-ticket.component';
import { WaitingGameComponent } from './scenes/waiting-game.component';

type Screen = 'intro' | 1 | 2 | 3 | 4 | 'outro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PenguinComponent,
    NoticeBoardComponent,
    CheckingChicksComponent,
    UniversalTicketComponent,
    WaitingGameComponent,
  ],
  template: `
    <div class="app-shell">
      @switch (screen()) {
        @case ('intro') {
          <section class="cover">
            <div class="cover-penguin"><app-penguin mood="happy"></app-penguin></div>
            <h1>Pip's Iceberg Office</h1>
            <p>
              Pip the Penguin runs the office on Iceberg Island. Some of the old
              rules just changed! Let's see what's different, one story at a time.
            </p>
            <button class="start-btn" (click)="go(1)">Start the Story ▶</button>
          </section>
        }
        @case (1) {
          <app-notice-board (next)="go(2)" (prev)="go('intro')"></app-notice-board>
        }
        @case (2) {
          <app-checking-chicks (next)="go(3)" (prev)="go(1)"></app-checking-chicks>
        }
        @case (3) {
          <app-universal-ticket (next)="go(4)" (prev)="go(2)"></app-universal-ticket>
        }
        @case (4) {
          <app-waiting-game (next)="go('outro')" (prev)="go(3)"></app-waiting-game>
        }
        @case ('outro') {
          <section class="cover">
            <div class="cover-penguin"><app-penguin mood="proud"></app-penguin></div>
            <h1>You know all of Pip's new rules!</h1>
            <ul class="recap">
              <li>🧊 Only Pip updates the notice board — everyone else just asks.</li>
              <li>🐣 One tap checks a whole nest of chicks, not one at a time.</li>
              <li>🎫 Every booth uses the same "only if…" rule shape now.</li>
              <li>⏳ Instant questions answer right away — only the slow ones wait.</li>
            </ul>
            <button class="start-btn" (click)="go(1)">Watch it again ↺</button>
          </section>
        }
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: radial-gradient(circle at top, #eaf6ff 0%, #d7ecfb 55%, #c3e3f7 100%);
    }
    .app-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 12px;
    }
    .cover {
      text-align: center;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      font-family: 'Quicksand', 'Segoe UI', sans-serif;
    }
    .cover-penguin { width: 130px; height: 150px; }
    h1 { font-size: 30px; color: #1a2740; margin: 0; }
    .cover p { color: #4d5f79; font-size: 15px; line-height: 1.5; margin: 0; }
    .start-btn {
      margin-top: 10px;
      background: #ff8c42;
      color: white;
      border: none;
      padding: 14px 30px;
      border-radius: 999px;
      font-weight: 800;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 8px 18px rgba(255, 140, 66, 0.35);
      transition: transform 0.15s ease;
    }
    .start-btn:hover { transform: translateY(-2px); }
    .recap {
      list-style: none;
      padding: 0;
      margin: 6px 0 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: left;
      width: 100%;
    }
    .recap li {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 13.5px;
      color: #33445c;
      font-weight: 600;
    }
  `],
})
export class AppComponent {
  screen = signal<Screen>('intro');

  go(s: Screen) {
    this.screen.set(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
