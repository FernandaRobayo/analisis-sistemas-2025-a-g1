// Interfaces para los objetos anidados
export interface Mesa {
    id: number;
    numero: number;
    capacidad: number;
    disponible: boolean;
    status: boolean;
}

export interface Cliente {
    id: number;
    nombre: string;
    telefono: number;
    status: boolean;
}

export interface Reserva {
    id?: number;
    fechaHora: string;
    mesa: Mesa;
    cliente: Cliente;
    status: boolean;
    createdAt?: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    createdBy?: number;
    updatedBy?: number | null;
    deletedBy?: number | null;
}

// Interfaz para crear una nueva reserva
export interface NuevaReserva {
    fecha_hora: string;
    mesa_id: number;
    cliente_id: number;
    status: boolean;
}

export interface ApiResponse {
    message: string;
    data: any;
} 