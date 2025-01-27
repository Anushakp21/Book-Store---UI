import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private router: Router,private snackBar: MatSnackBar,private userService:HttpService) {}


  private loginSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginSubject.asObservable();

  private selectedBookSubject = new BehaviorSubject<any>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();

  private searchQuerySource = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySource.asObservable();

  private cartCountSource = new Subject<void>;
  cartCount$ = this.cartCountSource.asObservable();


  updateCartCount(): void {
    this.cartCountSource.next();
  }


  updateLoginStatus(status: boolean) {
    this.loginSubject.next(status);
  }

  updateSelectedBook(book: any) {
    this.selectedBookSubject.next(book);
  }

  updateSearchQuery(query: string) {
    this.searchQuerySource.next(query);
  }
}
