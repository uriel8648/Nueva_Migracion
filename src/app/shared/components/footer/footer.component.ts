import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  // No functionality needed for this simple footer component
  // The original footer was just static HTML
  
  // Current year is calculated dynamically
  currentYear: number = new Date().getFullYear();
}