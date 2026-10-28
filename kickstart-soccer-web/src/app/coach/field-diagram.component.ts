import { Component, Input } from '@angular/core';

@Component({ selector: 'app-field-diagram', standalone: true, template: `
  @if (diagramKey === 'gate-passing' || diagramKey === 'red-light-green-light') {
    <figure class="field-wrap">
      <svg viewBox="0 0 360 210" role="img" [attr.aria-label]="title + ' soccer field diagram'">
        <rect x="8" y="8" width="344" height="194" rx="12" class="field" />
        <line x1="180" y1="8" x2="180" y2="202" class="line" />
        <circle cx="180" cy="105" r="28" class="line" />
        <rect x="8" y="65" width="35" height="80" class="line" />
        <rect x="317" y="65" width="35" height="80" class="line" />
        @if (diagramKey === 'gate-passing') {
          <text x="180" y="32" class="label">PASS THROUGH THE GATE</text>
          <circle cx="110" cy="105" r="8" class="player" /><circle cx="250" cy="105" r="8" class="player" />
          <path d="M125 105 H225" class="route" /><path d="m218 99 8 6-8 6" class="route" />
          <path d="M168 88v34m24-34v34" class="cone" />
          <circle cx="145" cy="105" r="5" class="ball" />
        } @else {
          <text x="180" y="32" class="label">DRIBBLE · STOP · SCAN</text>
          <circle cx="94" cy="105" r="8" class="player" /><circle cx="270" cy="105" r="8" class="player stop" />
          <path d="M110 105 H235" class="route" /><path d="m228 99 8 6-8 6" class="route" />
          <circle cx="150" cy="105" r="5" class="ball" />
          <path d="M255 83v-10m15 10v-10m15 10v-10" class="cone" />
          <text x="270" y="140" class="small">STOP</text>
        }
      </svg>
      <figcaption>{{ title }} field setup</figcaption>
    </figure>
  }
`, styles: [`
  .field-wrap { margin: 0; padding: 10px; border-radius: 12px; background: #eff6ef; }
  svg { display: block; width: 100%; height: auto; }
  .field { fill: #4f9a5a; stroke: #fff; stroke-width: 2; }
  .line { fill: none; stroke: #fff; stroke-width: 2; }
  .player { fill: #f4cf45; stroke: #243c65; stroke-width: 2; }
  .stop { fill: #ee7866; }
  .route { fill: none; stroke: #fff; stroke-width: 3; stroke-dasharray: 7 5; }
  .cone { fill: none; stroke: #ff9d43; stroke-width: 4; stroke-linecap: round; }
  .ball { fill: #fff; stroke: #14243d; stroke-width: 2; }
  .label, .small { fill: #fff; font: 700 10px sans-serif; text-anchor: middle; }
  .small { font-size: 8px; }
  figcaption { margin-top: 6px; color: #52627a; font-size: .8rem; text-align: center; }
` ] })
export class FieldDiagramComponent {
  @Input() diagramKey: string | null | undefined;
  @Input() title = 'Practice';
}
