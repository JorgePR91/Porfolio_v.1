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
  providedIn: 'root'
})
export class ProjectService {
  private readonly projects: ProjectItem[] = [
    {
      title: 'El Joc de la Vida',
      description:
        "Inicialment fet en Java per a l'assignatura de Programacio de DAW, pero migrat a Vanilla JavaScript i llancat en un servei web permanent.",
      image: 'assets/celula-e.jpg',
      imageAlt: 'Imatge del Joc de la Vida',
      projectUrl: 'https://jorgepergueillrubio.com/joc-vida',
      technologies: ['JavaScript', 'Joc', 'Servei Web']
    }
  ];

  getProjects(): ProjectItem[] {
    return this.projects;
  }
}
