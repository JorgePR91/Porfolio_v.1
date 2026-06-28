import { inject, Pipe, PipeTransform } from '@angular/core';
import { LangService } from './lang.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly langService = inject(LangService);

  transform(key: string): string {
    return this.langService.instant(key);
  }
}
