import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  books:any[]=[];

  constructor(private http:HttpClient) { }
  
  getAllBooks():Observable<any[]> {  
   return this.http.get<any[]>('http://localhost:8089/login/book')
  }
}
