export interface Mesa {
    id?: number;
    numero: number;
    capacidad: number;
    disponible: boolean;
    status: boolean;
    createdAt?: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    createdBy?: number;
    updatedBy?: number | null;
    deletedBy?: number | null;
}

export interface ApiResponse {
    status: boolean;
    data: Mesa[];
} 