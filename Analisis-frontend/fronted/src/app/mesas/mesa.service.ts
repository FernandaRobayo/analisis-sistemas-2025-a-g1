import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { Mesa, ApiResponse } from './mesas';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private apiUrl = 'http://localhost:9093/mesas';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getMesas(): Observable<Mesa[]> {
    console.log('MesaService: Obteniendo mesas');
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      tap(response => console.log('Respuesta completa del servidor:', response)),
      map(response => {
        console.log('Mesas recibidas:', response);
        if (!response.data) {
          console.warn('No se recibieron datos del servidor');
          return [];
        }
        return response.data.filter(mesa => !mesa.deletedAt);
      })
    );
  }

  create(mesa: Mesa): Observable<Mesa> {
    const mesaData = {
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      disponible: mesa.disponible,
      status: true // Por defecto activo
    };

    console.log('MesaService: Datos a enviar al crear mesa:', JSON.stringify(mesaData, null, 2));
    return this.http.post<ApiResponse>(this.apiUrl, mesaData, this.httpOptions).pipe(
      tap(response => console.log('Respuesta del servidor al crear:', response)),
      map(response => {
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          throw new Error('No se recibieron datos del servidor');
        }
        return response.data[0];
      }),
      catchError(error => {
        console.error('Error al crear mesa:', error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, mesa: Mesa): Observable<Mesa> {
    // Preparar datos para actualización sin verificar estado
    const mesaData = {
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      disponible: mesa.disponible,
      status: true // Siempre mantener activo para permitir edición
    };

    console.log('MesaService: Datos a enviar al actualizar mesa:', JSON.stringify(mesaData, null, 2));
    
    // Realizar la actualización directamente sin verificación previa
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, mesaData, this.httpOptions).pipe(
      tap(response => console.log('Respuesta del servidor al actualizar:', response)),
      map(response => {
        if (!response.data) {
          return {
            ...mesaData,
            id: id
          } as Mesa;
        }
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            return {
              ...mesaData,
              id: id
            } as Mesa;
          }
          return response.data[0];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error al actualizar mesa:', error);
        // Manejo específico de errores
        if (error.error && error.error.message) {
          return throwError(() => new Error(error.error.message));
        }
        return throwError(() => new Error('Error al actualizar la mesa'));
      })
    );
  }

  delete(id: number): Observable<any> {
    console.log('MesaService: Eliminando mesa:', id);
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      tap(response => console.log('Respuesta del servidor al eliminar:', response)),
      map(response => {
        console.log('Respuesta de eliminación:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error al eliminar mesa:', error);
        return throwError(() => error);
      })
    );
  }
} 