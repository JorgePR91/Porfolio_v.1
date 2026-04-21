import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-button-local-link',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './button-local-link.html',
  styleUrl: './button-local-link.scss'
})
export class ButtonLocalLink {

  //CREA UN OBJECTE QUE SAP SI ESTEM EN EL NAVEGADOR O EN EL SERVIDOR
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  buttons = [
    {
      name: 'about-me',
      text: 'Qui sóc'
    },
        {
      name: 'projects',
      text: 'Projectes'
    },
    // {
    //   name: 'goals',
    //   text: 'Trajectòria'
    // },
        {
      name: 'skills',
      text: 'Habilitats'
    },
        {
      name: 'contact',
      text: 'Contacte'
    }
  ];

  scrollTo(targetId: string): void {

    //FUNCIÓ PER A ASSEGURAR-SE DE QUE ESTEM EN EL NAVEGADOR
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(targetId);

    if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset;

      window.scrollTo({ 
        top: offsetPosition,
        behavior: 'smooth',  // Animación suave
      });
    }
    }

  }
}
