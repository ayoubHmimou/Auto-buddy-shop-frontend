import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Client, ClientRequest, Vehicle, VehicleRequest } from './client.model';

@Injectable({ providedIn: 'root'})
export class ClientApiService {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/clients`;

    list(q?: string): Observable<Client[]> {
        const params = q ? new HttpParams().set('q', q) : undefined;
        return this.http.get<Client[]>(this.baseUrl, { params });
    }

    get(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.baseUrl}/${id}`);
    }

    create(request: ClientRequest): Observable<Client> {
        return this.http.post<Client>(this.baseUrl, request);
    }

    update(id: number, request:ClientRequest): Observable<Client> {
        return this.http.put<Client>(`${this.baseUrl}/${id}`, request);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    addVehicle(clientId: number, request: VehicleRequest): Observable<Vehicle> {
        return this.http.post<Vehicle>(`${this.baseUrl}/${clientId}/vehicles`, request);
    }

     updateVehicle(clientId: number, vehicleId: number, request: VehicleRequest): Observable<Vehicle> {
        return this.http.put<Vehicle>(`${this.baseUrl}/${clientId}/vehicles/${vehicleId}`, request);
    }

    deleteVehicle(clientId: number, vehicleId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${clientId}/vehicles/${vehicleId}`);
    }
}