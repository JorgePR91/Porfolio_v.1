import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@angular/core';
import { ca } from './ca';
import { es } from './es';
import { en } from './en';

export type Lang = 'ca' | 'es' | 'en';

const TRANSLATIONS: Record<Lang, Record<string, any>> = { ca, es, en };

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _lang = signal<Lang>('ca');
  readonly lang = this._lang.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('app-lang') as Lang | null;
      if (saved === 'ca' || saved === 'es' || saved === 'en') {
        this._lang.set(saved);
      } else {
        const browserLang = navigator.language.split('-')[0].toLowerCase();
        if (browserLang === 'ca' || browserLang === 'es' || browserLang === 'en') {
          this._lang.set(browserLang as Lang);
        }
      }
    } else if (isPlatformServer(this.platformId)) {
      const req = inject(REQUEST, { optional: true }) as Request | null;
      const accept = req?.headers?.get('accept-language') ?? '';
      const lang = accept.split(',')[0].split('-')[0].toLowerCase();
      if (lang === 'ca' || lang === 'es' || lang === 'en') {
        this._lang.set(lang as Lang);
      }
    }
  }

  use(lang: Lang): void {
    this._lang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('app-lang', lang);
    }
  }

  instant(key: string): string {
    const parts = key.split('.');
    let value: any = TRANSLATIONS[this._lang()];
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined) return key;
    }
    return typeof value === 'string' ? value : key;
  }
}
