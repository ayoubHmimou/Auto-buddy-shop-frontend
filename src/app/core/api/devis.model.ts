export type DocumentType = 'DEVIS' | 'FACTURE' | 'SITUATION';

export interface DevisLine {
    id: number;
    quantity: number;
    description: string;
    unitPrice: number | null;
    lineTotal: number | null;
    included: boolean;
}

export interface Devis {
    id: number;
    documentType: DocumentType;
    number: string;
    issueDate: string;
    clientId: number | null;
    clientName: string;
    vehicleId: number | null;
    vehicleLabel: string | null;
    registration: string | null;
    total: number;
    convertedFromId: number | null;
    lines: DevisLine[];
}

export interface DevisLineRequest {
    quantity: number;
    description: string;
    unitPrice: number | null;
    included: boolean;
}

export interface DevisRequest {
    documentType: DocumentType;
    issueDate: string;
    clientId: number | null;
    clientName: string;
    vehicleId: number | null;
    vehicleLabel: string | null;
    registration: string | null;
    lines: DevisLineRequest[];
}

export interface DevisFilter {
    documentType: DocumentType | null;
    clientId: number | null;
    vehicleId: number | null;
    registration: string;
    q: string;
    from: string | null; // ISO yyyy-MM-dd format
    to: string | null;   // ISO yyyy-MM-dd format
}