import { Routes } from '@angular/router';
import { AboutMe } from './about-me/about-me';
import { Contact } from './contact/contact';
import { Goals } from './goals/goals';
import { Projects } from './projects/projects';
import { Skills } from './skills/skills';
import { App } from './app';

export const routes: Routes = [

    { path: 'contact', component: Contact },
    { path: 'about-me', component: AboutMe },
    { path: 'goals', component: Goals },
    { path: 'projects', component: Projects },
    { path: 'skills', component: Skills },
    { path: '', component: App }        
    // { path: '**', component: NotFoundComponent } 
];
