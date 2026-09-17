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
import { PenguinComponent } from './penguin/penguin.component';
import { HALLWAY_STOPS, WING_NAMES } from './shared/room-shell.component';

import { RECAP_LINE as NOTICE_BOARD_RECAP } from './scenes/notice-board.component';
import { RECAP_LINE as CHECKING_CHICKS_RECAP } from './scenes/checking-chicks.component';
import { RECAP_LINE as UNIVERSAL_TICKET_RECAP } from './scenes/universal-ticket.component';
import { RECAP_LINE as BOUNCER_BOOTH_RECAP } from './scenes/bouncer-booth.component';
import { RECAP_LINE as DOORBELL_RECAP } from './scenes/doorbell.component';
import { RECAP_LINE as WAITING_GAME_RECAP } from './scenes/waiting-game.component';
import { RECAP_LINE as SEAT_RECHECK_RECAP } from './scenes/seat-recheck-booth.component';
import { RECAP_LINE as NURSE_STATION_RECAP } from './scenes/nurse-station.component';
import { RECAP_LINE as TRANSLATOR_BOOTH_RECAP } from './scenes/translator-booth.component';
import { RECAP_LINE as ADAPTER_DESK_RECAP } from './scenes/adapter-desk.component';

type Screen = 'intro' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'outro';

// Survives a browser refresh so reloading lands back on the same room
// instead of resetting to the intro. Cleared when the tab actually closes.
const SCREEN_STORAGE_KEY = 'pip-office-screen';

function loadStoredScreen(): Screen {
  const raw = sessionStorage.getItem(SCREEN_STORAGE_KEY);
  if (raw === 'intro' || raw === 'outro') return raw;
  const n = Number(raw);
  return n >= 1 && n <= 10 ? (n as Screen) : 'intro';
}

// One recap line per room, in stop order (1..10) — each line lives in its
// own room's file next to that room's title/code, so changing a room's
// concept can't silently drift out of sync with the outro recap.
const ROOM_RECAPS = [
  NOTICE_BOARD_RECAP,
  CHECKING_CHICKS_RECAP,
  UNIVERSAL_TICKET_RECAP,
  BOUNCER_BOOTH_RECAP,
  DOORBELL_RECAP,
  WAITING_GAME_RECAP,
  SEAT_RECHECK_RECAP,
  NURSE_STATION_RECAP,
  TRANSLATOR_BOOTH_RECAP,
  ADAPTER_DESK_RECAP,
];

function buildRecap() {
  const wings: { wing: string; items: string[] }[] = [];
  HALLWAY_STOPS.forEach((stop, i) => {
    const wingName = WING_NAMES[stop.wing];
    let group = wings.find((w) => w.wing === wingName);
    if (!group) {
      group = { wing: wingName, items: [] };
      wings.push(group);
    }
    group.items.push(ROOM_RECAPS[i]);
  });
  return wings;
}

const RECAP = buildRecap();

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
    PenguinComponent,
  ],
  template: `
    <div class="app-shell">
      <div class="screen-content" [class.fading]="fading()">
      @switch (screen()) {
        @case ('intro') {
          <section class="cover">
            <div class="cover-top">
            <div class="cover-left">
              <div class="status-tag"><span class="dot"></span> Angular Signal Forms v22 · Field Notes</div>
              <h1 class="cover-title">What's New<br>in Signal<br>Forms v22</h1>
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
            </div>

            <div class="iceberg-scene" aria-hidden="true">
              <svg class="iceberg-art" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                <circle class="moon" cx="1050" cy="52" r="30" />
                <circle class="moon-halo" cx="1050" cy="52" r="52" />
                <path class="ice-back" d="M0,150 L150,96 L280,150 L430,84 L560,150 L720,70 L880,150 L1040,100 L1200,150 L1200,240 L0,240 Z" />
                <path class="ice-front" d="M0,182 L120,130 L260,182 L360,110 L470,182 L640,124 L800,182 L960,140 L1120,182 L1200,158 L1200,240 L0,240 Z" />
                <path class="ice-lit" d="M360,110 L470,182 L400,182 Z" />
                <path class="ice-lit" d="M640,124 L720,182 L660,182 Z" />
                <rect class="water" x="0" y="182" width="1200" height="58" />
              </svg>
              <span class="pip pip-lg cover-pip"><app-penguin mood="happy" /></span>
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
              <span class="pip pip-md outro-pip"><app-penguin mood="proud" /></span>
              <div>
                <div class="status-tag"><span class="dot"></span> Tour complete</div>
                <h1 class="cover-title">You've seen all {{ totalChanges() }} changes.</h1>
              </div>
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
      position: relative;
      isolation: isolate;
      background-color: var(--bg);
      background-image:
        radial-gradient(120% 80% at 50% -18%, var(--scene-glow) 0%, transparent 52%),
        radial-gradient(80% 50% at 88% 2%, var(--scene-glow-warm) 0%, transparent 60%),
        radial-gradient(150% 65% at 50% 120%, var(--scene-floor) 0%, transparent 62%);
      background-attachment: fixed;
    }
    /* Faint stars — visible only in dark theme (star color is transparent in light) */
    :host::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background-repeat: no-repeat;
      background-image:
        radial-gradient(1.5px 1.5px at 12% 16%, var(--scene-star), transparent),
        radial-gradient(1.5px 1.5px at 27% 9%, var(--scene-star), transparent),
        radial-gradient(1px 1px at 63% 13%, var(--scene-star), transparent),
        radial-gradient(1.5px 1.5px at 81% 21%, var(--scene-star), transparent),
        radial-gradient(1px 1px at 91% 10%, var(--scene-star), transparent),
        radial-gradient(1px 1px at 45% 26%, var(--scene-star), transparent),
        radial-gradient(1.5px 1.5px at 7% 31%, var(--scene-star), transparent),
        radial-gradient(1px 1px at 70% 30%, var(--scene-star), transparent);
      opacity: 0.9;
    }
    /* Soft vignette for depth (darkens edges — only strengthens contrast) */
    :host::after {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(125% 100% at 50% 38%, transparent 55%, var(--scene-vignette) 100%);
    }
    .app-shell {
      position: relative;
      z-index: 1;
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
    }
    .cover-top {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 64px;
      align-items: center;
    }

    /* Iceberg horizon illustration under the intro hero */
    .iceberg-scene {
      position: relative;
      margin-top: clamp(28px, 5vh, 56px);
      width: 100%;
      height: clamp(140px, 20vh, 220px);
    }
    .iceberg-art {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
    .iceberg-art .moon { fill: var(--ice-lit); opacity: 0.75; }
    .iceberg-art .moon-halo { fill: var(--scene-glow); }
    .iceberg-art .ice-back { fill: var(--ice); opacity: 0.7; }
    .iceberg-art .ice-front { fill: var(--ice-2); }
    .iceberg-art .ice-lit { fill: var(--ice-lit); opacity: 0.85; }
    .iceberg-art .water { fill: var(--scene-floor); }
    .cover-pip {
      position: absolute;
      left: 12%;
      bottom: 26%;
      filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.28));
      animation: pip-bob 3.2s ease-in-out infinite;
    }
    @keyframes pip-bob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
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
    .outro-head { margin-bottom: 32px; display: flex; align-items: center; gap: 20px; }
    .outro-pip { filter: drop-shadow(0 5px 9px rgba(0, 0, 0, 0.25)); }
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
      .cover-top { grid-template-columns: 1fr; }
    }
  `],
})
export class AppComponent {
  screen = signal<Screen>(loadStoredScreen());
  fading = signal(false);
  recap = RECAP;

  totalChanges() {
    return this.recap.reduce((sum, wing) => sum + wing.items.length, 0);
  }

  go(s: Screen) {
    this.fading.set(true);
    setTimeout(() => {
      this.screen.set(s);
      sessionStorage.setItem(SCREEN_STORAGE_KEY, String(s));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => this.fading.set(false));
    }, 150);
  }

  jumpTo(stop: number) {
    this.go(stop as Screen);
  }
}
