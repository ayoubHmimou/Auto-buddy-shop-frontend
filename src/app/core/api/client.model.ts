export interface Vehicle {
    id: number;
    registration: string;
    modelId: number;
    makeId: number;
    make: string;
    model: string;
    year: number | null;
}

export interface Client {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    vehicles: Vehicle[];
}

export interface ClientRequest {
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
}

export interface VehicleRequest {
    registration: string;
    modelId: number;
    year: number | null;
}
