import { Component, input } from '@angular/core';

export type PenguinMood = 'happy' | 'confused' | 'busy' | 'proud' | 'walking';

@Component({
  selector: 'app-penguin',
  standalone: true,
  template: `
    <svg
      class="penguin"
      [class.confused]="mood() === 'confused'"
      [class.busy]="mood() === 'busy'"
      [class.proud]="mood() === 'proud'"
      [class.walking]="mood() === 'walking'"
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- feet -->
      <ellipse class="foot" cx="42" cy="130" rx="14" ry="6" />
      <ellipse class="foot" cx="78" cy="130" rx="14" ry="6" />

      <!-- body -->
      <ellipse class="body" cx="60" cy="78" rx="42" ry="52" />
      <!-- belly -->
      <ellipse class="belly" cx="60" cy="86" rx="27" ry="38" />

      <!-- wings -->
      <ellipse class="wing wing-left" cx="22" cy="80" rx="10" ry="26" />
      <ellipse class="wing wing-right" cx="98" cy="80" rx="10" ry="26" />

      <!-- head -->
      <circle class="body" cx="60" cy="38" r="30" />

      <!-- eyes -->
      <ellipse class="eye-white" cx="48" cy="36" rx="9" ry="10" />
      <ellipse class="eye-white" cx="72" cy="36" rx="9" ry="10" />
      <circle class="pupil" cx="49" cy="38" r="4" />
      <circle class="pupil" cx="73" cy="38" r="4" />

      <!-- confused eyebrow -->
      @if (mood() === 'confused') {
        <path class="eyebrow" d="M40,22 L56,27" />
        <path class="eyebrow" d="M84,22 L68,27" />
      }

      <!-- beak -->
      <path class="beak" d="M52,46 L68,46 L60,58 Z" />

      <!-- proud sparkle -->
      @if (mood() === 'proud') {
        <text class="sparkle" x="90" y="14">✨</text>
        <text class="sparkle sparkle-2" x="14" y="20">✨</text>
      }
    </svg>
  `,
  styles: [`
    .penguin {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .body { fill: #2b2f3a; }
    .belly { fill: #ffffff; }
    .wing { fill: #2b2f3a; transform-origin: center; }
    .eye-white { fill: #ffffff; }
    .pupil { fill: #1a1a1a; }
    .beak, .foot { fill: #f5a623; }
    .eyebrow {
      stroke: #1a1a1a;
      stroke-width: 3;
      stroke-linecap: round;
      fill: none;
    }
    .sparkle {
      font-size: 16px;
      opacity: 0;
    }
    .proud .sparkle {
      animation: twinkle 1.1s ease-in-out infinite;
    }
    .proud .sparkle-2 { animation-delay: 0.4s; }
    @keyframes twinkle {
      0%, 100% { opacity: 0; transform: scale(0.6); }
      50% { opacity: 1; transform: scale(1); }
    }
    .busy .wing-left {
      animation: flap-left 0.45s ease-in-out infinite;
    }
    .busy .wing-right {
      animation: flap-right 0.45s ease-in-out infinite;
    }
    @keyframes flap-left {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-18deg); }
    }
    @keyframes flap-right {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(18deg); }
    }
    .confused { animation: tilt 1.6s ease-in-out infinite; }
    @keyframes tilt {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-6deg); }
    }
    .walking { animation: waddle 0.35s ease-in-out infinite; }
    .walking .foot:nth-of-type(1) { animation: step-left 0.35s ease-in-out infinite; }
    .walking .foot:nth-of-type(2) { animation: step-right 0.35s ease-in-out infinite; }
    @keyframes waddle {
      0%, 100% { transform: rotate(-4deg) translateY(0); }
      50% { transform: rotate(4deg) translateY(-4px); }
    }
    @keyframes step-left {
      0%, 100% { transform: translateY(0) scaleX(1); }
      50% { transform: translateY(-3px) scaleX(0.85); }
    }
    @keyframes step-right {
      0%, 100% { transform: translateY(-3px) scaleX(0.85); }
      50% { transform: translateY(0) scaleX(1); }
    }
  `],
})
export class PenguinComponent {
  mood = input<PenguinMood>('happy');
}
