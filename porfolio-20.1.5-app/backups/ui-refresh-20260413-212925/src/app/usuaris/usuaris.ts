import { Component } from '@angular/core';

@Component({
  selector: 'app-usuaris',
  imports: [],
  template: `
  <ul>
    @for(usu of usuarisLlista; track usu.id){
      <li> {{ usu.nom }}</li>
      
    }
    </ul>
  `,
  styles: ``
})
export class Usuaris {

  
  usuarisLlista =[
{
    id: 1,
    nom: 'Pepe'
},
{
    id: 2,
    nom: 'Laura'
},
{
    id: 3,
    nom: 'Antonio'
},
{
    id: 4,
    nom: 'Maria'
}    
  ]
}
