import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../services/contact-service';
import { HttpClientModule } from '@angular/common/http'; // ← MANTENER

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})

export class Contact implements OnDestroy{
  formulari: FormGroup;
  msg = '';
  msgType = '';
  isLoading = false;
  private $destroy = new Subject<void>();

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.formulari = this.fb.group({
     nom: ['', Validators.required],
     correu: ['', [Validators.required, Validators.email]],
     text: ['', Validators.required],
     telefon: ['']
    });
  }

  submit(){
    if(!this.formulari.valid){
      this.msg = "Per favor, ompli els camps requerits correctament";
      this.msgType = "error";
      return;
    }
    this.isLoading = true;
    this.msg = '';

    this.contactService.enviarMissatge(this.formulari.value).pipe(
      takeUntil(this.$destroy)
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.msg = res.message || "Missatge enviat correctament";
        this.msgType = 'success';
        this.formulari.reset();
      },
      error: (error) => {
        this.isLoading = false;
        this.msg = error.message || "Error al enviar el missatge";
        this.msgType = 'error';
      }}
    )
  }

    ngOnDestroy(): void {
      this.$destroy.next();
      this.$destroy.complete();
    }
}
