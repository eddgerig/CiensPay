// Shared User type definition used across the application
// This matches the backend API response structure

export interface Card {
    id: number;
    numero_tarjeta: string;
    saldo: number;
    fecha_asignacion: string;
    fecha_vencimiento: string;
    activo: boolean;
}

export interface User {
    id: number;
    full_name: string;
    email: string;
    document_type: string;
    document_number: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending';
    registration_date: string;
    has_card: boolean;
    balance: string;
    rol: string;
    cards_count: number;
    cards: Card[];
}
