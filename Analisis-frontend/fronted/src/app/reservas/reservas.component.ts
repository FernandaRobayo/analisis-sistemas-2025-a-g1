// src/app/reservas/reservas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReservaService } from './reserva.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { Reserva, NuevaReserva } from './reservas';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
  isLoading = false;
  reservas: Reserva[] = [];
  
  nuevaReserva: NuevaReserva = {
    fecha_hora: '',
    cliente_id: 0,
    mesa_id: 0,
    status: true
  };

  constructor(private reservaService: ReservaService) { }

  ngOnInit(): void {
    // Inicializar la fecha_hora con la fecha actual
    const now = new Date();
    this.nuevaReserva.fecha_hora = now.toISOString().slice(0, 16);
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading = true;
    this.reservaService.getReservas().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        console.log('Reservas cargadas:', reservas);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        Swal.fire('Error', 'No se pudieron cargar las reservas', 'error');
      }
    });
  }

  guardarReserva(): void {
    if (!this.nuevaReserva.fecha_hora) {
      Swal.fire('Error', 'La fecha y hora son obligatorias', 'error');
      return;
    }

    if (!this.nuevaReserva.cliente_id || this.nuevaReserva.cliente_id <= 0) {
      Swal.fire('Error', 'El ID del cliente debe ser mayor a 0', 'error');
      return;
    }

    if (!this.nuevaReserva.mesa_id || this.nuevaReserva.mesa_id <= 0) {
      Swal.fire('Error', 'El ID de la mesa debe ser mayor a 0', 'error');
      return;
    }

    // Formatear la fecha para el backend (asegurarnos que esté en UTC)
    const fecha = new Date(this.nuevaReserva.fecha_hora);
    const reservaParaEnviar: NuevaReserva = {
      ...this.nuevaReserva,
      fecha_hora: fecha.toISOString()
    };

    console.log('Intentando crear reserva con datos:', reservaParaEnviar);
    this.isLoading = true;

    this.reservaService.create(reservaParaEnviar).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        console.log('Reserva creada exitosamente:', response);
        this.cargarReservas();
        this.resetFormulario();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Reserva creada correctamente',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error al crear reserva:', error);
        let mensajeError = 'No se pudo crear la reserva';
        
        if (error instanceof Error) {
          // Si es un error de verificación de cliente o mesa
          mensajeError = error.message;
        } else if (error.error?.message) {
          // Si es un error del backend
          mensajeError += `: ${error.error.message}`;
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensajeError,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  resetFormulario(): void {
    const now = new Date();
    this.nuevaReserva = {
      fecha_hora: now.toISOString().slice(0, 16),
      cliente_id: 0,
      mesa_id: 0,
      status: true
    };
  }
}