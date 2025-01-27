import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { HttpService } from 'src/app/services/http.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isClicked: boolean = false;
  username: string | null = null;
  books: any[] = [];
  cartCount: number = 0;
  searchQuery: string = '';
  filteredBooks: any[] = [];

  isNavbarVisible: boolean = true; // Default navbar visibility
  constructor(
    private router: Router,
    private booksService: BookService,
    private sharedService: SharedService,
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private userService:HttpService
  ) {}

  toggleNavbar() {
    this.isNavbarVisible = !this.isNavbarVisible; // Toggle navbar visibility
  }

  ngOnInit() {
    this.extractUserName();
    this.fetchCartCount();
    this.sharedService.cartCount$.subscribe((count) => {
      this.cartCount++;
      console.log('Cart count updated:', this.cartCount);
    });
  }


  toggleClick(): void {
    this.isClicked = !this.isClicked;
  }
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessExpiration');
  }
 

  extractUserName(): void {
    const username = sessionStorage.getItem('username');
    if (username) {
      try {
        this.username = username || 'User';
        console.log(this.username)
      } catch (error) {
        console.error('Failed to decode username', error);
      }
    }
  }


  logout(): void {
    // Clear localStorage and sessionStorage
  
          localStorage.clear();
          sessionStorage.clear();
          this.snackbar.open('Logout Successfully', '', { duration: 3000 });
          this.router.navigateByUrl('/login');
        }

  fetchCartCount(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        console.log(response);
        
        if (response && Array.isArray(response)) {
          this.cartCount = response.length;
        } else {
          this.cartCount = 0;
        }
        console.log('Updated cart count:', this.cartCount);
      },
      (error) => {
        console.error('Error fetching cart count:', error);
        this.cartCount = 0; // Default to 0 in case of error
      }
    );
  }
  openCart(): void {
    this.router.navigate(['/cart-item']);
  }
  openOrder() {
    this.router.navigateByUrl('/order');
  }
  openWishList() {
    this.router.navigateByUrl('/wishlist');
  }
  filterBooks(): void {
    console.log("in filter books"+ this.searchQuery)
    this.sharedService.updateSearchQuery(this.searchQuery);
  }
}
