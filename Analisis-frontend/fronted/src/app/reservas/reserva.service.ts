import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';
import { Reserva, ApiResponse, NuevaReserva } from './reservas';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:9093/reservas';
  private clientesUrl = 'http://localhost:9093/clientes';
  private mesasUrl = 'http://localhost:9093/mesas';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getReservas(): Observable<Reserva[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?status=true`).pipe(
      map(response => response.data)
    );
  }

  // Método para obtener un cliente por ID
  private getCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.clientesUrl}/${clienteId}`).pipe(
      map((response: any) => response.data),
      catchError(error => {
        console.error('Error al obtener cliente:', error);
        throw new Error('No se pudo encontrar el cliente especificado');
      })
    );
  }

  // Método para obtener una mesa por ID
  private getMesa(mesaId: number): Observable<any> {
    return this.http.get(`${this.mesasUrl}/${mesaId}`).pipe(
      map((response: any) => response.data),
      catchError(error => {
        console.error('Error al obtener mesa:', error);
        throw new Error('No se pudo encontrar la mesa especificada');
      })
    );
  }

  create(nuevaReserva: NuevaReserva): Observable<ApiResponse> {
    // Formatear la reserva según el formato esperado por el backend
    const reservaToSend = {
      fechaHora: nuevaReserva.fecha_hora,
      mesa: {
        id: nuevaReserva.mesa_id
      },
      cliente: {
        id: nuevaReserva.cliente_id
      },
      status: nuevaReserva.status
    };

    console.log('Enviando reserva al backend:', JSON.stringify(reservaToSend, null, 2));

    return this.http.post<ApiResponse>(this.apiUrl, reservaToSend, this.httpOptions).pipe(
      tap({
        next: (response) => console.log('Respuesta del backend:', response),
        error: (error) => console.error('Error del backend:', error)
      })
    );
  }

  update(id: number, reserva: NuevaReserva): Observable<ApiResponse> {
    const reservaToUpdate = {
      fechaHora: reserva.fecha_hora,
      mesa: {
        id: reserva.mesa_id
      },
      cliente: {
        id: reserva.cliente_id
      },
      status: reserva.status
    };

    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, reservaToUpdate, this.httpOptions);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
} 