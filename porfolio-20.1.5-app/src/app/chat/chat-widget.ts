import {
  Component,
  signal,
  inject,
  viewChild,
  ElementRef,
  effect,
  HostListener,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../services/chat-service';
import { ChatUiService } from '../services/chat-ui-service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { LangService } from '../i18n/lang.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss',
})
export class ChatWidgetComponent {
  private chat = inject(ChatService);
  private chatUiService = inject(ChatUiService);
  private lang = inject(LangService);
  private platformId = inject(PLATFORM_ID);
  private closeBtnRef = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');
  private lastFocused: HTMLElement | null = null;
  private savedScrollY = 0;

  isOpen = this.chatUiService.isOpen;
  messages = signal<ChatMessage[]>([]);
  loading = signal(false);
  draft = '';

  constructor() {
    effect((onCleanup) => {
      const open = this.isOpen();
      const closeBtn = this.closeBtnRef();

      if (!isPlatformBrowser(this.platformId)) return;

      // Bloquear el overflow desactiva el scroll-snap de <html>, y la página
      // salta a su desplazamiento sin ajustar: hay que guardar y restaurar.
      if (open) this.savedScrollY = window.scrollY;
      // html + body: iOS Safari ignora el bloqueo si sólo se pone en uno.
      document.documentElement.style.overflow = open ? 'hidden' : '';
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) window.scrollTo(0, this.savedScrollY);

      if (open) {
        if (!this.lastFocused) {
          this.lastFocused = document.activeElement as HTMLElement | null;
        }
        closeBtn?.nativeElement.focus();

        // El teclado virtual encoge el viewport visual, no el de layout: sin
        // esto el campo de texto acaba detrás del teclado en iOS/Android.
        const vv = window.visualViewport;
        if (vv) {
          this.syncViewportHeight();
          vv.addEventListener('resize', this.syncViewportHeight);
          vv.addEventListener('scroll', this.syncViewportHeight);
          onCleanup(() => {
            vv.removeEventListener('resize', this.syncViewportHeight);
            vv.removeEventListener('scroll', this.syncViewportHeight);
            document.documentElement.style.removeProperty('--chat-vh');
          });
        }
      } else {
        this.lastFocused?.focus({ preventScroll: true });
        this.lastFocused = null;
        window.scrollTo(0, this.savedScrollY);
      }
    });
  }

  private syncViewportHeight = () => {
    const vv = window.visualViewport;
    if (!vv) return;
    document.documentElement.style.setProperty('--chat-vh', `${vv.height}px`);
  };

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) this.close();
  }

  send(e: Event) {
    e.preventDefault();
    const text = this.draft.trim();
    if (!text || this.loading()) return;

    const history = this.messages();
    this.messages.update((m) => [...m, { role: 'user', content: text }]);
    this.draft = '';
    this.loading.set(true);

    this.chat.send(text, history).subscribe({
      next: ({ reply }) => {
        this.messages.update((m) => [
          ...m,
          { role: 'assistant', content: reply },
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.messages.update((m) => [
          ...m,
          {
            role: 'assistant',
            content: this.lang.instant('chat.error'),
          },
        ]);
        this.loading.set(false);
      },
    });
  }

  close() {
    this.chatUiService.close();
  }
  open() {
    this.chatUiService.open();
  }
}
