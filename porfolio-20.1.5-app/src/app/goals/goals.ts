import { Component } from '@angular/core';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-goals',
  imports: [TranslatePipe],
  templateUrl: './goals.html',
  styleUrl: './goals.scss'
})
export class Goals {}
