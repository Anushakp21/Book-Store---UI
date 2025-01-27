import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  books: any[] = [];
  cartCount: number = 0;
  filteredBooks: any[] = [];
  searchQuery: string = '';
  
  

  constructor(
    private router: Router,

    private booksService: BookService,
    private sharedService: SharedService,
    private cartService: CartService,
    private user:HttpService,
    
  ) {}

  ngOnInit() {
    console.log('in side ngOnInit')
    this.fetchBooks();

    this.sharedService.searchQuery$.subscribe((query: string) => {
      this.searchQuery = query;
      this.filteredBooks = this.books.filter((book) =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  fetchBooks(): void {
    console.log('Fetching books...');
    this.booksService.getAllBooks().subscribe(
      (response: any) => {
        console.log('API Response:', response);
  
        // Check if response itself is an array
        if (Array.isArray(response)) {
          this.books = response.map((book: any) => this.mapBook(book));
        } 
        // Check if response.data exists and is an array
        else if (response && Array.isArray(response.data)) {
          this.books = response.data.map((book: any) => this.mapBook(book));
        } 
        else {
          console.error('Unexpected response format:', response);
          this.books = [];
        }
  
        // Update filteredBooks to match the current search query
        this.updateFilteredBooks();
      },
      (error) => {
        console.error('Error fetching books:', error);
        this.books = [];
      }
    );
  }

  private mapBook(book: any): any {

  
    return {
      bookId: book.bookId,
      image: book.bookImage || '', // Fallback if image is missing
      title: book.bookName || 'Unknown Title',
      author: book.authorName || 'Unknown Author',
      originalPrice: book.price || 'N/A',
      bookDetails: book.description || 'N/A',
    };
  }
  

 



  filterBooks(): void {
    this.fetchBooks();
  }

  viewBookDetails(book: any): void {
    console.log(book);
    this.sharedService.updateSelectedBook(book);
    this.router.navigate(['/cart']);
  }


  fetchCartCount(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          // Filter out items where isUnCarted or isOrdered is true
          console.log(response.data)
          const validItems = response.data
          this.cartCount = validItems.length;
        } else {
          console.error('Unexpected response format:', response);
          this.cartCount = 0;
        }
      },
      (error) => {
        console.error('Error fetching cart count:', error);
      }
    );
  }
  openCart(): void {
    this.router.navigate(['/myCart']);
  }
  openOrder() {
    this.router.navigateByUrl('/order');
  }

  updateFilteredBooks(): void {
    this.filteredBooks = this.books.filter((book) =>
      book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
