import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'trans',
  standalone: true,
  pure: false // re-evaluates when language signal changes
})
export class TransPipe implements PipeTransform {
  private transService = inject(TranslationService);

  transform(key: string): string {
    // Reads currentLang() so Angular tracks dependency change
    this.transService.currentLang();
    return this.transService.translate(key);
  }
}
