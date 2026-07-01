import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LangService } from '../i18n/lang.service'

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private lang = inject(LangService);

  send(message: string, history: ChatMessage[]): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(environment.chatApiUrl, { message, history, lang: this.lang.lang() });
  }

}
