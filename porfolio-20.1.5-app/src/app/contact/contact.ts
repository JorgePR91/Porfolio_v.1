import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../services/contact-service';
import { HttpClientModule } from '@angular/common/http'; // ← MANTENER
import { TranslatePipe } from '../i18n/translate.pipe';
import { LangService } from '../i18n/lang.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, HttpClientModule, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnDestroy {
  formulari: FormGroup;
  msg = '';
  msgType = '';
  isLoading = false;
  private $destroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private lang: LangService,
  ) {
    this.formulari = this.fb.group({
      nom: ['', Validators.required],
      correu: ['', [Validators.required, Validators.email]],
      text: ['', Validators.required],
      telefon: [
        '',
        [Validators.maxLength(20), Validators.pattern(/^[0-9\s\+\-\(\)]*$/)],
      ],
    });
  }

  submit() {
    if (!this.formulari.valid) {
      this.msg = this.lang.instant('contact.errorRequired');
      this.msgType = 'error';
      return;
    }
    this.isLoading = true;
    this.msg = '';

    this.contactService
      .enviarMissatge(this.formulari.value)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.msg = res.message || this.lang.instant('contact.successMsg');
          this.msgType = 'success';
          this.formulari.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.msg = error.message || this.lang.instant('contact.errorSend');
          this.msgType = 'error';
        },
      });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
