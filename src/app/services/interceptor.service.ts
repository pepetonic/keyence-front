import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StatusCodeEnum } from '../enums/statusCode.enum';
import { MessageService } from './message-service.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) { }
  

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let cloned: HttpRequest<any> = req;
    let setToken = true;

    if (req.url.includes('auth')) {
      setToken = false;
    } else {
      setToken = true;
    }

    if (setToken && this.authService.checkToken()) {
      cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.authService.accesToken}`),
      });
    }

    return next.handle(cloned).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse && event.body.codigo !== StatusCodeEnum.OK) {
            this.readErrors(event instanceof HttpResponse && event.body.mensaje || '', event instanceof HttpResponse && event.body.codigo || 0);
          }
        },
        error: (error: HttpErrorResponse) => {
          const detalles = error.error?.details?.length ? error.error.details[0] : '';
          this.readErrors(detalles, error.status);
          // throw error;
        }
      })
    );
  }

  readErrors(detail: string = '', codigo: number): void {
    if (codigo === 0) {
      return;
    }
    const error = { message: ''};
    switch (codigo) {
      case StatusCodeEnum.BAD_REQUEST: {
        error.message = 'Error al enviar la petición'
        break;
      }
      case StatusCodeEnum.UNAUTHORIZED: {
        error.message = 'Sesión expirada';
        this.authService.logout();
        break;
      }
      case StatusCodeEnum.FORBIDDEN: {
        this.authService.logout();
        return;
      }
      case StatusCodeEnum.NOT_FOUND: {
        error.message = 'Recurso no encontrado';
        break;
      }
      case StatusCodeEnum.NOT_ALLOWED: {
        error.message = 'Método no permitido';
        break;
      }
      case StatusCodeEnum.CONFLICT: {
        error.message = 'Conflicto inesperado';
        break;
      }
      case StatusCodeEnum.SERVER_ERROR: {
        error.message = 'Error interno del servidor, intente más tarde';
        break;
      }
      default: {
        error.message = 'Error desconocido';
        break;
      }
    }

    this.messageService.showMessage(error.message);
  }


}
