// src/app/clientes/clientes.ts

export interface Cliente {
    id?: number;
    nombre: string;
    telefono: number;
    status?: boolean;
    deletedAt?: Date;
}

export interface ApiResponse {
    data: any;
    message?: string;
    error?: any;
}