import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  getTaskUrl = `${environment.api}list`;
  getUsersUrl = `${environment.api}listusers`;
  createTaskUrl = `${environment.api}create`;
  deleteTaskUrl = `${environment.api}delete`;
  updateTaskUrl = `${environment.api}update`;

  loading = false;

  constructor(private http: HttpClient) { }

  getTasks() {
    const url = this.getTaskUrl;
    return this.http.get(url);
  }

  getUsers() {
    const url = this.getUsersUrl;
    return this.http.get(url);
  }

  createtask(task: any): Observable<any> {
    return this.http.post<any>(this.createTaskUrl, task);
  }

  deleteTask(task: any): Observable<any> {
    return this.http.post<any>(this.deleteTaskUrl, task);
  }

  updateTask(task: any): Observable<any> {
    return this.http.post<any>(this.updateTaskUrl, task);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
