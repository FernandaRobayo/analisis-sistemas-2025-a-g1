// src/app/mesas/mesas.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de que CommonModule esté importado
import { FormsModule } from '@angular/forms';   // Asegúrate de que FormsModule esté importado
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Mesa } from './mesas';
import { MesaService } from './mesa.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-mesas', // El selector no causa el error de importación, pero es bueno que sea consistente
  standalone: true,      // <--- ¡CRUCIAL! Debe ser 'true' para un componente standalone
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
    // Si vas a usar HttpClient en el futuro, se añadiría HttpClientModule aquí
    // o se proveería globalmente en main.ts. Por ahora, no lo necesitamos si no consumes API.
  ],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css'] // O .css
})
// ---> ¡ESTE NOMBRE DE CLASE ES CRUCIAL! <---
export class MesasComponent implements OnInit {
  mesas: Mesa[] = [];
  isLoading = false;
  
  newMesa: Mesa = {
    numero: 0,
    capacidad: 0,
    disponible: true,
    status: true
  };
  
  mesaSeleccionada: Mesa | null = null;

  constructor(private mesaService: MesaService) { } // Constructor vacío si no se inyecta HttpClient por ahora

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas(): void {
    this.isLoading = true;
    this.mesaService.getMesas().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (mesas) => {
        this.mesas = mesas;
      },
      error: (error) => {
        console.error('Error al cargar mesas:', error);
        Swal.fire('Error', 'No se pudieron cargar las mesas', 'error');
      }
    });
  }

  guardarMesa(): void {
    if (this.newMesa.numero <= 0) {
      Swal.fire('Error', 'El número de mesa debe ser mayor a 0', 'error');
      return;
    }

    if (this.newMesa.capacidad <= 0) {
      Swal.fire('Error', 'La capacidad debe ser mayor a 0', 'error');
      return;
    }

    const mesaParaEnviar: Mesa = {
      ...this.newMesa
    };

    this.isLoading = true;

    if (this.mesaSeleccionada && this.mesaSeleccionada.id) {
      console.log('Actualizando mesa con ID:', this.mesaSeleccionada.id);
      console.log('Datos a enviar:', mesaParaEnviar);

      this.mesaService.update(this.mesaSeleccionada.id, mesaParaEnviar).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (mesaActualizada) => {
          console.log('Mesa actualizada exitosamente:', mesaActualizada);
          
          // Actualizar la lista local
          const index = this.mesas.findIndex(m => m.id === this.mesaSeleccionada?.id);
          if (index !== -1) {
            this.mesas[index] = mesaActualizada;
          }

          this.resetFormulario();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Mesa actualizada correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error detallado al actualizar:', error);
          let mensajeError = 'No se pudo actualizar la mesa.';
          if (error.message) {
            mensajeError = error.message;
          } else if (error.error && error.error.message) {
            mensajeError = error.error.message;
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensajeError
          });
        }
      });
    } else {
      this.mesaService.create(mesaParaEnviar).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (mesaCreada) => {
          console.log('Mesa creada exitosamente:', mesaCreada);
          this.resetFormulario();
          this.cargarMesas();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Mesa guardada correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error detallado al crear:', error);
          let mensajeError = 'No se pudo guardar la mesa.';
          if (error.error && error.error.message) {
            mensajeError += ` ${error.error.message}`;
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensajeError
          });
        }
      });
    }
  }

  editarMesa(mesa: Mesa): void {
    console.log('Editando mesa:', mesa);
    this.mesaSeleccionada = { ...mesa };
    this.newMesa = { ...mesa };
    
    // Hacer scroll al formulario
    const formElement = document.getElementById('formularioMesa');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Resaltar el formulario
    if (formElement) {
      formElement.classList.add('editing');
      setTimeout(() => {
        formElement.classList.remove('editing');
      }, 1000);
    }
  }

  eliminarMesa(mesa: Mesa): void {
    if (!mesa.id) {
      Swal.fire('Error', 'ID de mesa no válido', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la mesa #${mesa.numero}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && mesa.id) {
        this.isLoading = true;
        
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.mesaService.delete(mesa.id).pipe(
          finalize(() => {
            this.isLoading = false;
            Swal.hideLoading();
          })
        ).subscribe({
          next: (response) => {
            console.log('Mesa eliminada:', response);
            // Actualizamos la lista local
            this.mesas = this.mesas.filter(m => m.id !== mesa.id);
            
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: 'La mesa ha sido eliminada',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar la mesa', 'error');
          }
        });
      }
    });
  }

  resetFormulario(): void {
    this.newMesa = {
      numero: 0,
      capacidad: 0,
      disponible: true,
      status: true
    };
    this.mesaSeleccionada = null;
  }
}