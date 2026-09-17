import { Component, EventEmitter, input, Output, signal } from '@angular/core';

export interface HallwayStop {
  wing: 'A' | 'B' | 'C' | 'D';
  label: string;
}

export const HALLWAY_STOPS: HallwayStop[] = [
  { wing: 'A', label: 'Notice Board' },
  { wing: 'A', label: 'Chick Nursery' },
  { wing: 'B', label: 'Booth Corridor' },
  { wing: 'B', label: 'Bouncer Booth' },
  { wing: 'C', label: 'Doorbell' },
  { wing: 'C', label: 'Fish Counter' },
  { wing: 'D', label: 'Seat Re-Check' },
  { wing: 'D', label: "Nurse's Station" },
  { wing: 'D', label: 'Translator Booth' },
  { wing: 'D', label: 'Adapter Desk' },
];

export const WING_NAMES: Record<HallwayStop['wing'], string> = {
  A: 'Front Office',
  B: 'Rules & Conditions',
  C: 'Waiting Room',
  D: 'Back Office',
};

@Component({
  selector: 'app-room-shell',
  standalone: true,
  template: `
    <section class="room">
      <nav class="rail">
        @for (stop of stops; track stop.label; let i = $index) {
          @if (i > 0 && stop.wing !== stops[i - 1].wing) {
            <div class="wing-gap"></div>
          }
          <button
            type="button"
            class="rail-step"
            [class.active]="i + 1 === stopIndex()"
            [class.done]="i + 1 < stopIndex()"
            (click)="jump.emit(i + 1)"
          >
            <span class="n">{{ (i + 1).toString().padStart(2, '0') }}</span>
            <span class="l">{{ stop.label }}</span>
          </button>
        }
      </nav>

      <div class="room-meta">Wing {{ wing() }} &middot; {{ wingName() }} &mdash; <strong>Stop {{ stopIndex() }} of {{ stops.length }}</strong></div>

      <div class="title-row">
        <h2 class="room-title">{{ title() }}</h2>
        <div class="mode-toggle" role="tablist">
          <button
            type="button"
            role="tab"
            class="mode-tab"
            [class.active]="mode() === 'story'"
            [attr.aria-selected]="mode() === 'story'"
            (click)="mode.set('story')"
          >🐧 The Story</button>
          <button
            type="button"
            role="tab"
            class="mode-tab"
            [class.active]="mode() === 'real'"
            [attr.aria-selected]="mode() === 'real'"
            (click)="mode.set('real')"
          >💻 See It For Real</button>
        </div>
      </div>
      <p class="room-sub">{{ subtitle() }}</p>

      <div class="compare-grid">
        <div class="panel panel-before">
          <div class="panel-tab">Before</div>
          @if (mode() === 'story') {
            <ng-content select="[old]"></ng-content>
          } @else {
            <ng-content select="[old-real]"></ng-content>
          }
        </div>
        <div class="panel panel-after">
          <div class="panel-tab">After</div>
          @if (mode() === 'story') {
            <ng-content select="[new]"></ng-content>
          } @else {
            <ng-content select="[new-real]"></ng-content>
          }
        </div>
        <div class="code-rail">
          <div class="code-block">
            <span class="code-tab">Before</span>
            <pre>{{ oldCode() }}</pre>
          </div>
          <div class="code-block is-after" [class.highlight]="solved()">
            <span class="code-tab">After</span>
            <pre>{{ newCode() }}</pre>
          </div>
        </div>
      </div>

      <div class="control-row">
        <span class="step-count">{{ stopIndex().toString().padStart(2, '0') }} / {{ stops.length }}</span>
        <button class="btn btn-secondary" (click)="prev.emit()">&larr; Back</button>
        <button class="btn btn-primary" (click)="next.emit()">
          {{ stopIndex() === stops.length ? 'Finish' : 'Next room →' }}
        </button>
      </div>
    </section>
  `,
  styles: [`
    .room {
      max-width: 1500px;
      margin: 0 auto;
      width: 100%;
      font-family: var(--sans);
    }

    .rail {
      display: flex;
      border-bottom: 1px solid var(--border);
      margin-bottom: 32px;
      overflow-x: auto;
      overflow-y: hidden;
    }
    .wing-gap { width: 18px; flex-shrink: 0; }
    .rail-step {
      flex: 1;
      min-width: 64px;
      padding: 0 8px 12px;
      border: none;
      border-bottom: 2px solid var(--border);
      margin-bottom: -1px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: transparent;
      font-family: inherit;
      text-align: left;
      cursor: pointer;
      transition: border-color 0.15s ease;
    }
    .rail-step:hover { border-bottom-color: var(--ink-muted); }
    .rail-step:hover .n, .rail-step:hover .l { color: var(--ink-muted); }
    .rail-step .n {
      font-family: var(--mono);
      font-size: 10px;
      color: var(--ink-faint);
      transition: color 0.15s ease;
    }
    .rail-step .l {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--ink-faint);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.15s ease;
    }
    .rail-step.done { border-bottom-color: var(--ink-faint); }
    .rail-step.done .l { color: var(--ink-muted); }
    .rail-step.active { border-bottom-color: var(--accent); }
    .rail-step.active:hover { border-bottom-color: var(--accent); }
    .rail-step.active .n, .rail-step.active .l { color: var(--ink); }

    .room-meta {
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--ink-faint);
      margin-bottom: 10px;
    }
    .room-meta strong { color: var(--accent); font-weight: 700; }
    .title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .room-title {
      font-size: clamp(22px, 2.6vw, 30px);
      font-weight: 800;
      letter-spacing: -0.015em;
      margin: 0;
      color: var(--ink);
      text-wrap: balance;
    }
    .mode-toggle {
      display: inline-flex;
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 3px;
      gap: 2px;
      flex-shrink: 0;
    }
    .mode-tab {
      font-family: var(--sans);
      font-size: 12px;
      font-weight: 700;
      color: var(--ink-faint);
      background: transparent;
      border: none;
      border-radius: 999px;
      padding: 7px 14px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .mode-tab:hover { color: var(--ink-muted); }
    .mode-tab.active {
      background: var(--surface);
      color: var(--ink);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }
    .room-sub {
      font-size: 14.5px;
      color: var(--ink-muted);
      max-width: 68ch;
      margin: 0 0 28px;
      line-height: 1.6;
    }

    .compare-grid {
      display: grid;
      grid-template-columns: 1fr 1fr minmax(260px, 320px);
      gap: 18px;
      align-items: stretch;
      margin-bottom: 24px;
    }
    .panel {
      position: relative;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      padding: 20px 18px 52px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .panel:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); }
    .panel-before { background: var(--surface-2); }
    .panel-after { background: var(--surface); box-shadow: inset 0 0 0 1px var(--accent); }
    .panel-after:hover { box-shadow: inset 0 0 0 1px var(--accent), 0 6px 16px rgba(0, 0, 0, 0.08); }
    .panel-tab {
      align-self: flex-start;
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      margin-bottom: 16px;
      color: var(--ink-faint);
    }
    .panel-after .panel-tab { color: var(--accent); }

    .code-rail { display: flex; flex-direction: column; gap: 12px; }
    .code-block {
      background: var(--code-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      padding: 12px 14px 14px;
      flex: 1;
      transition: box-shadow 0.2s ease, transform 0.15s ease;
    }
    .code-block:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16); }
    .code-block.is-after { border-color: var(--accent); }
    .code-block.is-after.highlight {
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent);
    }
    .code-tab {
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--code-muted);
      margin-bottom: 8px;
      display: block;
    }
    .code-block.is-after .code-tab { color: var(--code-accent); }
    .code-block pre {
      margin: 0;
      font-family: var(--mono);
      font-size: 11.5px;
      line-height: 1.6;
      color: var(--code-ink);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .control-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    .step-count { font-family: var(--mono); font-size: 11px; color: var(--ink-faint); margin-right: auto; }

    @media (max-width: 980px) {
      .compare-grid { grid-template-columns: 1fr; }
      .rail-step .l { display: none; }
    }
  `],
})
export class RoomShellComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  stopIndex = input.required<number>();
  oldCode = input<string>('');
  newCode = input<string>('');
  solved = input<boolean>(false);

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() jump = new EventEmitter<number>();

  mode = signal<'story' | 'real'>('story');

  stops = HALLWAY_STOPS;

  wing() {
    return HALLWAY_STOPS[this.stopIndex() - 1]?.wing ?? 'A';
  }

  wingName() {
    return WING_NAMES[this.wing()];
  }
}
