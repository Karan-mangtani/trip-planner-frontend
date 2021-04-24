import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  commonUrl = "https://devza.com/tests/tasks/";
  getTaskUrl = `${this.commonUrl}list`;
  getUsersUrl = `${this.commonUrl}listusers`;
  createTaskUrl = `${this.commonUrl}create`;
  deleteTaskUrl = `${this.commonUrl}delete`;
  updateTaskUrl = `${this.commonUrl}update`;

  loading = false;

  constructor(private http: HttpClient) { }

  getTasks() {
    let url = this.getTaskUrl;
    return this.http.get(url);
  }

  getUsers() {
    let url = this.getUsersUrl;
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
