import { Injectable } from '@angular/core';

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  projectUrl: string;
  technologies: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly projects: ProjectItem[] = [
    {
      title: 'projects.preformTitle',
      description: 'projects.preformDesc',
      image: 'assets/preform-logo.png',
      imageAlt: 'projects.preformAlt',
      projectUrl: 'https://github.com/JorgePR91/PreForm',
      technologies: ['Electron', 'JavaScript', 'Desktop App'],
    },
    {
      title: 'projects.gameOfLifeTitle',
      description: 'projects.gameOfLifeDesc',
      image: 'assets/celula-e.jpg',
      imageAlt: 'projects.gameOfLifeAlt',
      projectUrl: 'https://jdlv-vanilla.vercel.app/',
      technologies: ['JavaScript', 'Game', 'Web Service'],
    },
    {
      title: 'projects.onboardProgramTitle',
      description: 'projects.onboardProgramDesc',
      image: 'assets/onboarding-program.png',
      imageAlt: 'projects.onboardProgramAlt',
      projectUrl: 'https://github.com/JorgePR91/onboard-program-skill-',
      technologies: ['IA', 'Skill', 'Code Learning'],
    },
  ];

  getProjects(): ProjectItem[] {
    return this.projects;
  }
}
