import { Component, signal } from '@angular/core';
import { Nav } from "./nav/nav";
import { Header } from "./header/header";
import { RouterOutlet } from '@angular/router';
import { ButtonLocalLink } from "./button-local-link/button-local-link";
import { AboutMe } from "./about-me/about-me";
import { Goals } from "./goals/goals";
import { Projects } from "./projects/projects";
import { Skills } from "./skills/skills";
import { Contact } from "./contact/contact";
import { Footer } from "./footer/footer";
import { ButtonUp } from "./button-up/button-up";

//DECORADOR: SINTÀXIS I PATRÓ JS PER A APLICAR A LA CLASSE DE BAIX.
@Component({
  selector: 'app-root',
  //COSES QUE NECESSITEM UTILITZAR EN L'APP
  imports: [Header, Nav, ButtonLocalLink, AboutMe, Goals, Projects, Skills, Contact, ButtonUp, Footer],
  //EL QUE ES REDERITZA 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('porfolio-20.1.5-app');
  protected readonly city = 'Xàtiva';
}
