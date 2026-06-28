import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-button-local-link',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  templateUrl: './button-local-link.html',
  styleUrl: './button-local-link.scss',
})
export class ButtonLocalLink {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  buttons = [
    { name: 'about-me', text: 'nav.about' },
    { name: 'projects', text: 'nav.projects' },
    // { name: 'goals', text: 'nav.goals' },
    { name: 'skills', text: 'nav.skills' },
    { name: 'contact', text: 'nav.contact' },
  ];

  scrollTo(targetId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(targetId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  }
}
