import { Component, inject } from '@angular/core';
import { ButtonLocalLink } from '../button-local-link/button-local-link';
import { LangService, Lang } from '../i18n/lang.service';

@Component({
  selector: 'app-nav',
  imports: [ButtonLocalLink],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected readonly langService = inject(LangService);
  readonly langs: Lang[] = ['ca', 'es', 'en'];
  readonly langLabels: Record<Lang, string> = { ca: 'VA/CA', es: 'ES', en: 'EN' };

  use(lang: Lang): void {
    this.langService.use(lang);
  }
}
