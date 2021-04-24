import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TasksService } from './tasks.service';
@Injectable()
export class CustomInterceptor implements HttpInterceptor {
    constructor(
        private taskService: TasksService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                AuthToken: 'Lnr0kGA5lj1eKUQmcTSjLX9NGtREX7Qs'
            }
        });

        if (request.method === 'GET') {
            this.taskService.setLoading(true);
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.taskService.setLoading(false);
                    if (event.body.status === 'error') {
                        window.alert(event.body.error);
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.taskService.setLoading(false);
                window.alert(error.message);
                return throwError(error);
            }));
    }
}
