import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { SharedService } from 'src/app/services/shared.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  isAddedToCart: boolean = false;
  isAddedToWishlist:boolean=false;

  id: number | null = null;
  book: any;
  quantity: number = 1;

  feedback: string = ''; // Bind this property to the input field

  constructor(
    private sharedService: SharedService,
    private cartService: CartService,
    private matSnackBar: MatSnackBar,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

 

  resetInput(): void {
    this.feedback = ''; // Reset the bound property
    console.log('Input field has been reset!');
  }

  ngOnInit() {
    this.sharedService.selectedBook$.subscribe((book) => {
      console.log(book)
      this.book = book;
    });
  }



  changeQuantity(change: number): void {
    if (this.quantity + change > 0) {
      this.quantity += change;
    }
  }

  extractUserId(): void {
    const userId  = localStorage.getItem('userId');
    if (userId) {
      try {
        this.id = parseInt(userId);
      } catch (error) {
        console.error('Failed to extract userId', error);
      }
    }
  }

  addToCart(): void {
    this.sharedService.updateCartCount()
    console.log(this.book);
  if (this.book && this.book.bookId) {
    this.extractUserId();

    const bookId = this.book.bookId; // Extract bookId from the book object
    const quantity = this.quantity; // Use the current quantity

    this.cartService.addToCart(bookId, quantity).subscribe({
      next: (response) => {
        this.isAddedToCart = true;
        console.log('Cart added successfully:', response);
        // this.sharedService.updateCartCount(response.updatedCartCount);
        this.matSnackBar.open('Cart Added Successfully', '', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.matSnackBar.open('Error Adding to Cart', '', {
          duration: 3000,
        });
      },
    });
  } else {
    console.error('Book details are missing.');
    this.matSnackBar.open('Error: Book details are missing.', '', {
      duration: 3000,
    });
  }
  }
  addToWishlist(): void {
    if (this.book) {
      console.log(this.book.bookid)
      this.wishlistService.addToWishList(this.book.bookId).subscribe({
        next: (response) => {
          this.isAddedToWishlist=true;
          console.log('Added to wishlist successfully:', response);
          this.matSnackBar.open('Added to Wishlist Successfully', '', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.matSnackBar.open('Error adding to Wishlist', '', {
            duration: 3000,
          });
        },
      }); 
    }
  }

  goToCart() {
    this.router.navigate(['/cart-item'])
    console.log('Navigating to cart');
  }

  goToWishlist(){
    this.router.navigate(['wishlist'])
  }
  

}
