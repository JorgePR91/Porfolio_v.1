import { Component } from '@angular/core';
import { Usuaris } from "../usuaris/usuaris";

@Component({
  //NOM DE L'ETIQUETA QUE DEGUEM UTILITZAR PER A CLAVAR-LO
  selector: 'app-prova',
  imports: [Usuaris],
  templateUrl: './prova.html',
  styleUrl: './prova.scss'
})
export class Prova {
  provaName = 'provaInicial';
  isRunning = true;

  greet(){
    alert('Foto de perfil de Github');
  }
}
