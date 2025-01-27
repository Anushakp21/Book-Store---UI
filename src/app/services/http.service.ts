import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  addUser(body:any):Observable<any>{
    return this.http.post('http://localhost:8089/register', body);
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:8089/login', credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  };


}
