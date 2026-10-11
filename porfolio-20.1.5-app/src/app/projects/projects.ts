import { Component, inject } from '@angular/core';
import { ProjectItem, ProjectService } from '../services/project-service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { ChatUiService } from '../services/chat-ui-service';

@Component({
  selector: 'app-projects',
  imports: [TranslatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private readonly projectService = inject(ProjectService);
  private readonly chatUiService = inject(ChatUiService);
  readonly projectCards: ProjectItem[] = this.projectService.getProjects();

  featured = this.projectCards.find((p) => p.featured);
  others = this.projectCards.filter((p) => !p.featured);

  openChat(){
      this.chatUiService.open();
  }
}
