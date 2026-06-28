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

  isOpen = this.chatUiService.isOpen;
  messages = signal<ChatMessage[]>([]);
  loading = signal(false);
  draft = '';

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const closeBtn = this.closeBtnRef();

      if (!isPlatformBrowser(this.platformId)) return;
      document.documentElement.style.overflow = open ? 'hidden' : '';

      if (open) {
        if (!this.lastFocused) {
          this.lastFocused = document.activeElement as HTMLElement | null;
        }
        closeBtn?.nativeElement.focus();
      } else {
        this.lastFocused?.focus();
        this.lastFocused = null;
      }
    });
  }

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
