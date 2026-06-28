import { Component, inject } from '@angular/core';
import { ProjectItem, ProjectService } from '../services/project-service';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-projects',
  imports: [TranslatePipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private readonly projectService = inject(ProjectService);
  readonly projectCards: ProjectItem[] = this.projectService.getProjects();
}
