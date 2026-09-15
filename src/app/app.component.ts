import { Component, signal } from '@angular/core';
import { NoticeBoardComponent } from './scenes/notice-board.component';
import { CheckingChicksComponent } from './scenes/checking-chicks.component';
import { UniversalTicketComponent } from './scenes/universal-ticket.component';
import { BouncerBoothComponent } from './scenes/bouncer-booth.component';
import { DoorbellComponent } from './scenes/doorbell.component';
import { WaitingGameComponent } from './scenes/waiting-game.component';
import { SeatRecheckBoothComponent } from './scenes/seat-recheck-booth.component';
import { NurseStationComponent } from './scenes/nurse-station.component';
import { TranslatorBoothComponent } from './scenes/translator-booth.component';
import { AdapterDeskComponent } from './scenes/adapter-desk.component';

type Screen = 'intro' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'outro';

const RECAP = [
  { wing: 'Front Office', items: [
    'Only Pip updates the notice board — everyone else just asks (touch input/output).',
    'One tap checks a whole nest of chicks — markAsTouched() cascades now.',
  ]},
  { wing: 'Rules & Conditions', items: [
    'Every booth uses the same "when" rule shape now.',
    'minDate()/maxDate() do the date math for you.',
  ]},
  { wing: 'Waiting Room', items: [
    'debounce can now wait for blur, not just typing.',
    'Only the slow async check waits — instant checks don’t.',
  ]},
  { wing: 'Back Office', items: [
    'reloadValidation() forces a fresh check on demand.',
    'getError(kind) looks up one error directly.',
    'Legacy CVA validators are now seen automatically.',
    'One component adapts to Reactive, template, and Signal forms — plus reset().',
  ]},
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NoticeBoardComponent,
    CheckingChicksComponent,
    UniversalTicketComponent,
    BouncerBoothComponent,
    DoorbellComponent,
    WaitingGameComponent,
    SeatRecheckBoothComponent,
    NurseStationComponent,
    TranslatorBoothComponent,
    AdapterDeskComponent,
  ],
  template: `
    <div class="app-shell">
      <div class="screen-content" [class.fading]="fading()">
      @switch (screen()) {
        @case ('intro') {
          <section class="cover">
            <div class="cover-left">
              <div class="status-tag"><span class="dot"></span> Angular Signal Forms v22 · Field Notes</div>
              <h1 class="cover-title">Eleven changes,<br>one form at a<br>time.</h1>
              <p class="cover-desc">
                Pip runs the office on Iceberg Island — built, room by room, as one big
                Angular Signal Forms instance. Walk through ten stops and see exactly
                what changed between v21 and v22, with the working code next to every
                example.
              </p>
              <div class="cta-row">
                <button class="btn btn-primary" (click)="go(1)">Start the tour →</button>
                <button class="btn btn-ghost" (click)="go('outro')">Jump to recap</button>
              </div>
            </div>
            <div class="terminal">
              <div class="terminal-bar">
                <span></span><span></span><span></span>
                <span class="terminal-title">notice-board.component.ts</span>
              </div>
              <pre>&#64;Component(&#123;
  selector: 'app-custom-input',
  template: '&lt;input [value]="value()"
    (blur)="touched.set(true)"&gt;'
&#125;)
class CustomInput &#123;
  touched = model(false);
  // could read AND overwrite "touched"
&#125;</pre>
            </div>
          </section>
        }
        @case (1) { <app-notice-board (next)="go(2)" (prev)="go('intro')" (jump)="jumpTo($event)"></app-notice-board> }
        @case (2) { <app-checking-chicks (next)="go(3)" (prev)="go(1)" (jump)="jumpTo($event)"></app-checking-chicks> }
        @case (3) { <app-universal-ticket (next)="go(4)" (prev)="go(2)" (jump)="jumpTo($event)"></app-universal-ticket> }
        @case (4) { <app-bouncer-booth (next)="go(5)" (prev)="go(3)" (jump)="jumpTo($event)"></app-bouncer-booth> }
        @case (5) { <app-doorbell (next)="go(6)" (prev)="go(4)" (jump)="jumpTo($event)"></app-doorbell> }
        @case (6) { <app-waiting-game (next)="go(7)" (prev)="go(5)" (jump)="jumpTo($event)"></app-waiting-game> }
        @case (7) { <app-seat-recheck-booth (next)="go(8)" (prev)="go(6)" (jump)="jumpTo($event)"></app-seat-recheck-booth> }
        @case (8) { <app-nurse-station (next)="go(9)" (prev)="go(7)" (jump)="jumpTo($event)"></app-nurse-station> }
        @case (9) { <app-translator-booth (next)="go(10)" (prev)="go(8)" (jump)="jumpTo($event)"></app-translator-booth> }
        @case (10) { <app-adapter-desk (next)="go('outro')" (prev)="go(9)" (jump)="jumpTo($event)"></app-adapter-desk> }
        @case ('outro') {
          <section class="outro">
            <div class="outro-head">
              <div class="status-tag"><span class="dot"></span> Tour complete</div>
              <h1 class="cover-title">You've seen all {{ totalChanges() }} changes.</h1>
            </div>
            <div class="recap-grid">
              @for (wing of recap; track wing.wing) {
                <div class="recap-card">
                  <h3>{{ wing.wing }}</h3>
                  <ul>
                    @for (item of wing.items; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              }
            </div>
            <button class="btn btn-primary" (click)="go('intro')">Walk it again ↺</button>
          </section>
        }
      }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg);
    }
    .app-shell {
      padding: clamp(32px, 6vh, 72px) clamp(20px, 4vw, 64px);
    }
    .screen-content {
      opacity: 1;
      transition: opacity 150ms ease;
    }
    .screen-content.fading { opacity: 0; }

    .status-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-muted);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 5px 10px;
      margin-bottom: 24px;
    }
    .status-tag .dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }

    .cover {
      max-width: 1500px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 64px;
      align-items: center;
    }
    .cover-left { max-width: 620px; }
    .cover-title {
      font-size: clamp(32px, 4vw, 48px);
      line-height: 1.08;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 20px;
      color: var(--ink);
      text-wrap: balance;
    }
    .cover-desc {
      font-size: 16px;
      line-height: 1.65;
      color: var(--ink-muted);
      margin: 0 0 28px;
      max-width: 54ch;
    }
    .cta-row { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }

    .terminal {
      background: var(--code-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      overflow: hidden;
    }
    .terminal-bar {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .terminal-bar span { width: 9px; height: 9px; border-radius: 50%; background: #3a3f49; flex-shrink: 0; }
    .terminal-title {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--code-muted);
      margin-left: 4px;
      white-space: nowrap;
      letter-spacing: 0.04em;
    }
    .terminal pre {
      margin: 0;
      padding: 22px 20px 26px;
      font-family: var(--mono);
      font-size: 13px;
      line-height: 1.7;
      color: var(--code-ink);
      white-space: pre-wrap;
    }

    .outro { max-width: 1500px; margin: 0 auto; }
    .outro-head { margin-bottom: 32px; }
    .recap-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .recap-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
    }
    .recap-card h3 {
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 14px;
      font-weight: 700;
    }
    .recap-card ul { list-style: none; margin: 0; padding: 0; }
    .recap-card li {
      font-size: 13.5px;
      line-height: 1.5;
      color: var(--ink);
      padding: 10px 0;
      border-top: 1px solid var(--border);
    }
    .recap-card li:first-child { border-top: none; padding-top: 0; }

    @media (max-width: 980px) {
      .cover { grid-template-columns: 1fr; }
    }
  `],
})
export class AppComponent {
  screen = signal<Screen>('intro');
  fading = signal(false);
  recap = RECAP;

  totalChanges() {
    return this.recap.reduce((sum, wing) => sum + wing.items.length, 0);
  }

  go(s: Screen) {
    this.fading.set(true);
    setTimeout(() => {
      this.screen.set(s);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => this.fading.set(false));
    }, 150);
  }

  jumpTo(stop: number) {
    this.go(stop as Screen);
  }
}
