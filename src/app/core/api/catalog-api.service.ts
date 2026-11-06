import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { VehicleMake, VehicleModel } from './catalog.model';

@Injectable({ providedIn: 'root'})
export class CatalogApiService {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/vehicle-catalog`;


    findMakes(q?: string): Observable<VehicleMake[]> {
        const params = q ? new HttpParams().set('q', q) : undefined;
        return this.http.get<VehicleMake[]>(`${this.baseUrl}/makes`, { params });
    }

    findModels(makeId: number, q?: string): Observable<VehicleModel[]> {
        const params = q ? new HttpParams().set('q', q) : undefined;
        return this.http.get<VehicleModel[]>(`${this.baseUrl}/makes/${makeId}/models`, { params });
    }

    createMake(name: string): Observable<VehicleMake> {
        return this.http.post<VehicleMake>(`${this.baseUrl}/makes`, { name });
    }

    createModel(makeId: number, name: string): Observable<VehicleModel> {
        return this.http.post<VehicleModel>(`${this.baseUrl}/makes/${makeId}/models`, { name });
    }


}