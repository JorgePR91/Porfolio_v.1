import { Component, inject } from '@angular/core';
import { ProjectItem, ProjectService } from '../services/project-service';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private readonly projectService = inject(ProjectService);
  readonly projectCards: ProjectItem[] = this.projectService.getProjects();

}
