import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
  selector: 'app-reset-button',
  standalone: true,
  template: `
    <button type="button" class="reset-btn" [disabled]="disabled()" (click)="reset.emit()">
      <span class="reset-icon">&#8634;</span> Reset
    </button>
  `,
  styles: [`
    .reset-btn {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: var(--sans);
      font-size: 11px;
      font-weight: 700;
      color: var(--ink-muted);
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 5px 10px;
      cursor: pointer;
      transition: border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
    }
    .reset-btn:hover:not(:disabled) { border-color: var(--ink-faint); color: var(--ink); }
    .reset-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .reset-icon { font-size: 12px; line-height: 1; }
  `],
})
export class ResetButtonComponent {
  disabled = input<boolean>(false);
  @Output() reset = new EventEmitter<void>();
}
