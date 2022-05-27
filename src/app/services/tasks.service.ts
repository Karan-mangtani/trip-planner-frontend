import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  cityNamesApi = `/api/get-city-names`;
  tripInfoApi = `/api/get-trip`;

  loading = false;

  constructor(private http: HttpClient) { }

  getCities() {
    const url = this.cityNamesApi;
    return this.http.get(url);
  }

  getTrip(cityCode: string) {
    const url = `${this.tripInfoApi}/${cityCode}`;
    return this.http.get(url);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
