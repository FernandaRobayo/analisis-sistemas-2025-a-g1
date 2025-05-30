// src/app/clientes/cliente.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cliente, ApiResponse } from './clientes';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:9093/clientes'; // <--- LA URL DE TU API
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Obtener todos los clientes activos (no eliminados)
  getClientes(): Observable<Cliente[]> {
    console.log('ClienteService: Obteniendo clientes');
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      tap(response => console.log('Respuesta del servidor:', response)),
      map(response => {
        if (!response.data) {
          console.warn('No se recibieron datos del servidor');
          return [];
        }
        return response.data.filter((cliente: Cliente) => !cliente.deletedAt);
      })
    );
  }

  // Crear un nuevo cliente
  create(cliente: Cliente): Observable<Cliente> {
    console.log('ClienteService: Creando cliente:', cliente);
    return this.http.post<ApiResponse>(this.apiUrl, cliente, this.httpOptions).pipe(
      tap(response => console.log('Respuesta del servidor (crear):', response)),
      map(response => response.data)
    );
  }

  // Actualizar un cliente
  update(id: number, cliente: Cliente): Observable<Cliente> {
    console.log('ClienteService: Actualizando cliente:', { id, cliente });
    
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, cliente, this.httpOptions).pipe(
      tap(response => console.log('Respuesta del servidor (actualizar):', response)),
      map(response => {
        if (!response.data) {
          return {
            ...cliente,
            id: id
          };
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error en actualización:', error);
        if (error.error && error.error.message) {
          return throwError(() => new Error(error.error.message));
        }
        return throwError(() => error);
      })
    );
  }

  // Eliminar un cliente
  delete(id: number): Observable<any> {
    console.log('ClienteService: Eliminando cliente:', id);
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      tap(response => console.log('Respuesta del servidor (eliminar):', response))
    );
  }

  // Método para verificar si un cliente está activo
  verificarCliente(id: number): Observable<boolean> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Verificando estado del cliente:', response)),
      map(response => {
        if (!response.data) {
          return false;
        }
        const cliente = response.data;
        return cliente && cliente.status === true && !cliente.deletedAt;
      }),
      catchError(error => {
        console.error('Error al verificar cliente:', error);
        return throwError(() => new Error('No se pudo verificar el estado del cliente'));
      })
    );
  }
}