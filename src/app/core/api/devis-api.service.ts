import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { Devis, DevisRequest } from './devis.model';


@Injectable({ providedIn: 'root'}) 
export class DevisApiService {

    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/devis`;

    list(): Observable<Devis[]> {
        return this.http.get<Devis[]>(this.baseUrl);
    }

    get(id: number): Observable<Devis> {
        return this.http.get<Devis>(`${this.baseUrl}/${id}`);
    }

    create(request: DevisRequest): Observable<Devis> {
        return this.http.post<Devis>(this.baseUrl, request);
    }

    update(id: number, request: DevisRequest): Observable<Devis> {
        return this.http.put<Devis>(`${this.baseUrl}/${id}`, request);
    }

    convert(id: number): Observable<Devis> {
        return this.http.post<Devis>(`${this.baseUrl}/${id}/convert`, {});
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    // GET with Authorization header cannot be opened with window.open(), so the
    // PDF is fetched as a blob and downloaded via an object URL.
    downloadPdf(id: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${id}/pdf`, { responseType: 'blob'});
    }


}