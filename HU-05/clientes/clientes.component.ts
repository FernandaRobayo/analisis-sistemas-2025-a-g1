// src/app/clientes/clientes.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para componentes standalone
import { FormsModule } from '@angular/forms';     // Necesario para [(ngModel)]
import Swal from 'sweetalert2';                     // Para notificaciones (puedes instalarlo si no lo tienes: npm install sweetalert2)
import { Cliente } from './clientes'; // <--- ESTA ES LA LÍNEA CRÍTICA PARA LA IMPORTACIÓN DEL MODELO
import { ClienteService } from './cliente.service'; // <--- ESTA ES LA LÍNEA CRÍTICA PARA LA IMPORTACIÓN DEL SERVICIO
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-clientes',
  standalone: true, // Esto es correcto para tu componente
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'] // Usas .css, mantengo esto
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  isLoading = false;
  intentosFallidos = false;
  
  // Objeto para el formulario de nuevo cliente
  newCliente: Cliente = {
    nombre: '',
    telefono: 0,
    status: true
  };
  
  clienteSeleccionado: Cliente | null = null;

  // ¡IMPORTANTE! Aquí se inyecta el ClienteService en el constructor.
  // Esto permite que el componente use los métodos del servicio.
  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.isLoading = true;
    this.clienteService.getClientes().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (clientes) => {
        this.clientes = clientes.sort((a, b) => {
          const idA = a.id || 0;
          const idB = b.id || 0;
          return idB - idA;
        });
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
      }
    });
  }

  validarDatos(): boolean {
    if (!this.newCliente.nombre || this.newCliente.nombre.trim() === '') {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return false;
    }

    if (!this.newCliente.telefono || this.newCliente.telefono <= 0) {
      Swal.fire('Error', 'El teléfono es obligatorio y debe ser mayor a 0', 'error');
      return false;
    }

    return true;
  }

  editarCliente(cliente: Cliente): void {
    console.log('Editando cliente:', cliente);
    this.clienteSeleccionado = { ...cliente };
    this.newCliente = { ...cliente };
    
    // Hacer scroll al formulario
    const formElement = document.getElementById('formularioCliente');
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

  cancelarEdicion(): void {
    this.clienteSeleccionado = null;
    this.resetFormulario();
  }

  guardarCliente(): void {
    if (!this.validarDatos()) {
      return;
    }

    const clienteParaEnviar: Cliente = {
      nombre: this.newCliente.nombre.trim(),
      telefono: this.newCliente.telefono,
      status: this.newCliente.status
    };

    this.isLoading = true;

    if (this.clienteSeleccionado && this.clienteSeleccionado.id) {
      console.log('Actualizando cliente con ID:', this.clienteSeleccionado.id);
      console.log('Datos a enviar:', clienteParaEnviar);

      this.clienteService.update(this.clienteSeleccionado.id, clienteParaEnviar).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: (clienteActualizado) => {
          console.log('Cliente actualizado exitosamente:', clienteActualizado);
          
          // Actualizar la lista local
          const index = this.clientes.findIndex(c => c.id === this.clienteSeleccionado?.id);
          if (index !== -1) {
            this.clientes[index] = clienteActualizado;
          }

          this.resetFormulario();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Cliente actualizado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error detallado al actualizar:', error);
          let mensajeError = 'No se pudo actualizar el cliente.';
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
      this.clienteService.create(clienteParaEnviar).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: (clienteCreado) => {
          console.log('Cliente creado exitosamente:', clienteCreado);
          this.resetFormulario();
          this.cargarClientes();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Cliente guardado correctamente',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error detallado al crear:', error);
          let mensajeError = 'No se pudo guardar el cliente.';
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

  eliminarCliente(cliente: Cliente): void {
    if (!cliente.id) {
      Swal.fire('Error', 'ID de cliente no válido', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al cliente ${cliente.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && cliente.id) {
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

        this.clienteService.delete(cliente.id).pipe(
          finalize(() => {
            this.isLoading = false;
            Swal.hideLoading();
          })
        ).subscribe({
          next: (response) => {
            console.log('Cliente eliminado:', response);
            // Primero actualizamos la lista local
            this.clientes = this.clientes.filter(c => c.id !== cliente.id);
            // Luego mostramos el mensaje de éxito
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El cliente ha sido eliminado',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
          }
        });
      }
    });
  }

  resetFormulario(): void {
    this.newCliente = {
      nombre: '',
      telefono: 0,
      status: true
    };
    this.clienteSeleccionado = null;
  }
}