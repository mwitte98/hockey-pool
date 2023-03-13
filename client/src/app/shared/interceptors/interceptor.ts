import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request.clone({ body: this.convertCase(request.body, this.toSnake) })).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          return event.clone({ body: this.convertCase(event.body, this.toCamel) });
        }
        return event;
      })
    );
  }

  convertCase(obj: any, convertFunction: (s: string) => string): any {
    if (Array.isArray(obj)) {
      return obj.map((elem) => this.convertCase(elem, convertFunction));
    } else if (obj === Object(obj)) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [convertFunction(k), this.convertCase(v, convertFunction)])
      );
    }
    return obj;
  }

  toSnake(s: string): string {
    return s.replaceAll(/[A-Z]/gu, (letter) => `_${letter.toLowerCase()}`);
  }

  toCamel(s: string): string {
    return s.replaceAll(/(?<case>_[a-z])/giu, ($case) => $case.toUpperCase().replace('_', ''));
  }
}
