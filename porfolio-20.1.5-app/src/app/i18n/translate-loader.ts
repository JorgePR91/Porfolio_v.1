import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ca } from './ca';
import { es } from './es';
import { en } from './en';

// 'as any' evita el error de firma de índice de TranslationObject
const translations = { ca, es, en } as Record<string, any>;

export class StaticTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(translations[lang] ?? translations['ca']);
  }
}
