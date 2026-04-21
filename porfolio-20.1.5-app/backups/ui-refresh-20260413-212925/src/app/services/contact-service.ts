import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ContactRequest {
  nom: string;
  correu: string;
  text: string;
  telefon?: string;
}
export interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor (private http: HttpClient) {}

  private handleError (error: HttpErrorResponse) {
    let errorMissatge = 'Error desconegut al enviar el missatge';

    if(error.error instanceof ErrorEvent){
      errorMissatge = `Error de xarxa: ${error.error.message}`;
    } else {
      errorMissatge = `Resposta del servidor: ${error.status} - ${error.statusText}`;
    }

    console.error('ContactService error:', errorMissatge);
    return throwError(()=> new Error(errorMissatge));
  }

  enviarMissatge (data: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(
        `${environment.apiUrl}/enviar-email.php`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }


}
