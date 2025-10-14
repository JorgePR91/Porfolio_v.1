import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  formulari: FormGroup;
  msg = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formulari = this.fb.group({
     nom: ['', Validators.required],
     correu: ['', [Validators.required, Validators.email]],
     text: ['', Validators.required],
     telefon: ['']
    });
  }

  submit(){
    if(this.formulari.valid){
      this.http
      .post("http://localhost/PERSONAL/enviar-email.php", 
            this.formulari.value,
          { headers: { 'Content-Type': 'application/json' } }
        )
      .subscribe((res: any) => this.msg='Formulari de contacte enviat correctament',
      err => this.msg = 'Error al enviar el formulari');

      console.log('Enviat');
    }
  }

}
