import { Component, inject, signal } from '@angular/core';
import { Nav } from "./nav/nav";
import { Header } from "./header/header";
import { AboutMe } from "./about-me/about-me";
import { Projects } from "./projects/projects";
import { Skills } from "./skills/skills";
import { Contact } from "./contact/contact";
import { Footer } from "./footer/footer";
import { ButtonUp } from "./button-up/button-up";
import { Goals } from "./goals/goals";
import { ChatWidgetComponent } from './chat/chat-widget';
import { ChatUiService } from './services/chat-ui-service';
import { TranslatePipe } from './i18n/translate.pipe';

//DECORADOR: SINTÀXIS I PATRÓ JS PER A APLICAR A LA CLASSE DE BAIX.
@Component({
  selector: 'app-root',
  //COSES QUE NECESSITEM UTILITZAR EN L'APP
  imports: [Header, Nav, AboutMe, Goals, Projects, Skills, Contact, ButtonUp, ChatWidgetComponent, Footer, TranslatePipe],
  //EL QUE ES REDERITZA
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('porfolio-20.1.5-app');
  protected readonly city = 'Xàtiva';
    private chatUiService = inject(ChatUiService);

    openChat(){
      this.chatUiService.open();
    }

}
